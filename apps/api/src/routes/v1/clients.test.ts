// =============================================================================
// /v1/clients — invite route integration tests
// =============================================================================

import { describe, test, expect, vi, beforeEach } from 'vitest';
import Fastify from 'fastify';
import { clientsRoutes } from './clients.js';
import { createFakeClient } from '@breeyard/test-utils';

// ---- Module mocks ----

const mockDb = {
  select: vi.fn(),
  update: vi.fn(),
  insert: vi.fn(),
};

const mockAuth = {
  api: {
    signUpEmail: vi.fn(),
  },
};

const mockMail = {
  sendWelcome: vi.fn(),
};

vi.mock('@breeyard/database', () => ({
  getDatabase: () => mockDb,
  clients: 'clients',
  projects: 'projects',
  users: 'users',
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn((_col: unknown, _val: unknown) => 'eq_condition'),
  desc: vi.fn((_col: unknown) => 'desc_condition'),
  asc: vi.fn((_col: unknown) => 'asc_condition'),
}));

vi.mock('@breeyard/auth', () => ({
  getAuth: () => mockAuth,
}));

vi.mock('@breeyard/mail', () => ({
  getMailClient: () => mockMail,
}));

vi.mock('@breeyard/shared', () => ({
  apiSuccess: (data: unknown) => ({ success: true, data }),
  apiError: (code: string, message: string) => ({ success: false, error: { code, message } }),
}));

// ---- Query chain builder ----

const makeQueryChain = (result: unknown[]) => ({
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockResolvedValue(result),
  orderBy: vi.fn().mockResolvedValue(result),
  set: vi.fn().mockReturnThis(),
});

const makeUpdateChain = () => ({
  set: vi.fn().mockReturnThis(),
  where: vi.fn().mockResolvedValue([]),
});

// ---- Server factory ----

const buildTestServer = async () => {
  const app = Fastify({ logger: false });
  await app.register(clientsRoutes, { prefix: '/v1/clients' });
  return app;
};

// =============================================================================
// POST /v1/clients/:id/invite
// =============================================================================

describe('POST /v1/clients/:id/invite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockMail.sendWelcome.mockResolvedValue({ messageId: 'test', accepted: [], rejected: [] });
    mockAuth.api.signUpEmail.mockResolvedValue({ user: { id: 'new-user-id' } });
  });

  test('returns 404 when client does not exist', async () => {
    const chain = makeQueryChain([]);
    mockDb.select.mockReturnValue(chain);

    const app = await buildTestServer();
    const res = await app.inject({ method: 'POST', url: '/v1/clients/nonexistent/invite' });

    expect(res.statusCode).toBe(404);
    expect(res.json()).toMatchObject({ success: false, error: { code: 'NOT_FOUND' } });
  });

  test('returns 409 when client already has a portal account', async () => {
    const client = createFakeClient({ userId: 'existing-user-id' });
    const chain = makeQueryChain([client]);
    mockDb.select.mockReturnValue(chain);

    const app = await buildTestServer();
    const res = await app.inject({ method: 'POST', url: `/v1/clients/${client.id}/invite` });

    expect(res.statusCode).toBe(409);
    expect(res.json()).toMatchObject({ success: false, error: { code: 'CONFLICT' } });
  });

  test('creates user and links to client when no account exists', async () => {
    const client = createFakeClient();
    // First select: client. Second select: no existing user with that email.
    const clientChain = makeQueryChain([client]);
    const noUserChain = makeQueryChain([]);
    mockDb.select.mockReturnValueOnce(clientChain).mockReturnValueOnce(noUserChain);

    const updateChain = makeUpdateChain();
    mockDb.update.mockReturnValue(updateChain);

    const app = await buildTestServer();
    const res = await app.inject({ method: 'POST', url: `/v1/clients/${client.id}/invite` });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ success: true, data: { invited: true } });
    expect(mockAuth.api.signUpEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({ email: client.email, name: client.name }),
      }),
    );
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockMail.sendWelcome).toHaveBeenCalledWith(
      client.email,
      expect.objectContaining({ name: client.name }),
    );
  });

  test('reuses existing user when email already registered', async () => {
    const client = createFakeClient();
    const existingUser = { id: 'existing-user-abc' };
    const clientChain = makeQueryChain([client]);
    const existingUserChain = makeQueryChain([existingUser]);
    mockDb.select.mockReturnValueOnce(clientChain).mockReturnValueOnce(existingUserChain);

    const updateChain = makeUpdateChain();
    mockDb.update.mockReturnValue(updateChain);

    const app = await buildTestServer();
    const res = await app.inject({ method: 'POST', url: `/v1/clients/${client.id}/invite` });

    expect(res.statusCode).toBe(200);
    expect(mockAuth.api.signUpEmail).not.toHaveBeenCalled();
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockMail.sendWelcome).toHaveBeenCalled();
  });

  test('returns 500 when user creation fails', async () => {
    const client = createFakeClient();
    const clientChain = makeQueryChain([client]);
    const noUserChain = makeQueryChain([]);
    mockDb.select.mockReturnValueOnce(clientChain).mockReturnValueOnce(noUserChain);

    mockAuth.api.signUpEmail.mockResolvedValue(null);

    const app = await buildTestServer();
    const res = await app.inject({ method: 'POST', url: `/v1/clients/${client.id}/invite` });

    expect(res.statusCode).toBe(500);
    expect(mockMail.sendWelcome).not.toHaveBeenCalled();
  });
});
