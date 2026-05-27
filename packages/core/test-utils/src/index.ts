// =============================================================================
// @breeyard/test-utils
//
// Shared test helpers, factories, and fixtures for Vitest + integration tests.
// Import from this package instead of duplicating setup code across test files.
//
// IMPORTANT: only import this in *.test.ts / *.spec.ts files.
// =============================================================================

import { faker } from '@faker-js/faker';
import { vi } from 'vitest';

// =============================================================================
// Re-exports — so tests only need one import
// =============================================================================

export { vi, expect, describe, test, it, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
export { faker };

// =============================================================================
// Fastify mock request / reply
// =============================================================================

export interface MockRequest {
  readonly ip: string;
  readonly url: string;
  readonly method: string;
  readonly headers: Record<string, string | string[] | undefined>;
}

export interface MockReply {
  readonly header: ReturnType<typeof vi.fn>;
  readonly status: ReturnType<typeof vi.fn>;
  readonly send: ReturnType<typeof vi.fn>;
  readonly _headers: Record<string, string>;
  readonly _status: () => number;
  readonly _body: () => unknown;
}

export const createMockRequest = (overrides: Partial<MockRequest> = {}): MockRequest => ({
  ip: faker.internet.ipv4(),
  url: '/test',
  method: 'GET',
  headers: {},
  ...overrides,
});

export const createMockReply = (): MockReply => {
  const headers: Record<string, string> = {};
  let statusCode = 200;
  let body: unknown = null;

  const reply: MockReply = {
    header: vi.fn((name: string, value: string) => {
      headers[name] = value;
      return reply;
    }),
    status: vi.fn((code: number) => {
      statusCode = code;
      return reply;
    }),
    send: vi.fn((payload: unknown) => {
      body = payload;
      return reply;
    }),
    _headers: headers,
    _status: () => statusCode,
    _body: () => body,
  };

  return reply;
};

// =============================================================================
// User factory
// =============================================================================

export interface FakeUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly emailVerified: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export const createFakeUser = (overrides: Partial<FakeUser> = {}): FakeUser => ({
  id: faker.string.alphanumeric(24),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  emailVerified: true,
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
});

// =============================================================================
// NavItem factory
// =============================================================================

export interface FakeNavItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly target: string;
  readonly order: number;
  readonly visible: boolean;
  readonly parentId: string | null;
  readonly createdAt: Date;
}

export const createFakeNavItem = (overrides: Partial<FakeNavItem> = {}): FakeNavItem => ({
  id: faker.string.alphanumeric(24),
  label: faker.lorem.words(2),
  href: `/${faker.lorem.slug()}`,
  target: '_self',
  order: faker.number.int({ min: 0, max: 100 }),
  visible: true,
  parentId: null,
  createdAt: faker.date.past(),
  ...overrides,
});

// =============================================================================
// Block factory
// =============================================================================

export interface FakeBlock {
  readonly id: string;
  readonly pageSlug: string;
  readonly type: string;
  readonly data: Record<string, unknown>;
  readonly order: number;
  readonly visible: boolean;
  readonly createdAt: Date;
}

export const createFakeBlock = (overrides: Partial<FakeBlock> = {}): FakeBlock => ({
  id: faker.string.alphanumeric(24),
  pageSlug: 'home',
  type: faker.helpers.arrayElement(['profile', 'about', 'services', 'contact', 'text']),
  data: {},
  order: faker.number.int({ min: 0, max: 100 }),
  visible: true,
  createdAt: faker.date.past(),
  ...overrides,
});

// =============================================================================
// Client factory
// =============================================================================

export interface FakeClient {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly company: string | null;
  readonly status: string;
  readonly userId: string | null;
  readonly createdAt: Date;
}

export const createFakeClient = (overrides: Partial<FakeClient> = {}): FakeClient => ({
  id: faker.string.alphanumeric(24),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  company: faker.company.name(),
  status: 'active',
  userId: null,
  createdAt: faker.date.past(),
  ...overrides,
});

// =============================================================================
// Project factory
// =============================================================================

export interface FakeProject {
  readonly id: string;
  readonly clientId: string;
  readonly name: string;
  readonly status: string;
  readonly totalCents: number;
  readonly createdAt: Date;
}

export const createFakeProject = (overrides: Partial<FakeProject> = {}): FakeProject => ({
  id: faker.string.alphanumeric(24),
  clientId: faker.string.alphanumeric(24),
  name: faker.lorem.words(3),
  status: 'active',
  totalCents: faker.number.int({ min: 100_00, max: 10_000_00 }),
  createdAt: faker.date.past(),
  ...overrides,
});

// =============================================================================
// Invoice factory
// =============================================================================

export interface FakeInvoice {
  readonly id: string;
  readonly projectId: string;
  readonly clientId: string;
  readonly amountCents: number;
  readonly status: string;
  readonly dueAt: Date;
  readonly createdAt: Date;
}

export const createFakeInvoice = (overrides: Partial<FakeInvoice> = {}): FakeInvoice => ({
  id: faker.string.alphanumeric(24),
  projectId: faker.string.alphanumeric(24),
  clientId: faker.string.alphanumeric(24),
  amountCents: faker.number.int({ min: 50_00, max: 5_000_00 }),
  status: 'draft',
  dueAt: faker.date.future(),
  createdAt: faker.date.past(),
  ...overrides,
});

// =============================================================================
// waitFor — polling assertion helper
// =============================================================================

interface WaitForOptions {
  readonly timeout?: number;
  readonly interval?: number;
}

export const waitFor = async (
  fn: () => void | Promise<void>,
  options: WaitForOptions = {},
): Promise<void> => {
  const timeout = options.timeout ?? 1_000;
  const interval = options.interval ?? 50;
  const deadline = Date.now() + timeout;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      await fn();
      return;
    } catch (err) {
      lastError = err;
      await new Promise((res) => setTimeout(res, interval));
    }
  }

  throw lastError;
};

// =============================================================================
// Mock fetch
// =============================================================================

export const installMockFetch = (response: {
  readonly status?: number;
  readonly body?: unknown;
  readonly headers?: Record<string, string>;
}): { readonly mockFetch: ReturnType<typeof vi.fn>; readonly restore: () => void } => {
  const mockFetch = vi.fn().mockResolvedValue({
    ok: (response.status ?? 200) < 400,
    status: response.status ?? 200,
    json: () => Promise.resolve(response.body ?? {}),
    text: () => Promise.resolve(JSON.stringify(response.body ?? {})),
    headers: new Headers(response.headers ?? {}),
  });

  const original = globalThis.fetch;
  globalThis.fetch = mockFetch as typeof globalThis.fetch;

  return {
    mockFetch,
    restore: () => {
      globalThis.fetch = original;
    },
  };
};
