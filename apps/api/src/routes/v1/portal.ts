// ============================================================
// Portal routes — /v1/portal
// Client-scoped: session cookie required, all data filtered to
// the authenticated user's client record.
//
// GET /v1/portal/me           — client record for the logged-in user
// GET /v1/portal/projects     — projects for the logged-in user's client
// GET /v1/portal/messages     — messages for the logged-in user's client
// POST /v1/portal/messages    — send a message from the client
// ============================================================

import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getDatabase, clients, projects, messages } from '@breeyard/database';
import { eq, asc } from 'drizzle-orm';
import { apiSuccess, apiError } from '@breeyard/shared';
import { getRequestSession } from '../../lib/session.js';

const requireClientSession = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<string | null> => {
  const session = await getRequestSession(request);
  if (!session) {
    await reply.status(401).send(apiError('UNAUTHORIZED', 'Not authenticated.'));
    return null;
  }
  return session.user.id;
};

const getClientForUser = async (userId: string) => {
  const db = getDatabase();
  const [client] = await db.select().from(clients).where(eq(clients.userId, userId)).limit(1);
  return client ?? null;
};

// eslint-disable-next-line @typescript-eslint/require-await
export const portalRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // ---- GET /v1/portal/me ----
  fastify.get('/me', async (request, reply) => {
    const userId = await requireClientSession(request, reply);
    if (!userId) return;

    const client = await getClientForUser(userId);
    if (!client) return reply.status(404).send(apiError('NOT_FOUND', 'No client record found.'));

    return reply.send(apiSuccess(client));
  });

  // ---- GET /v1/portal/projects ----
  fastify.get('/projects', async (request, reply) => {
    const userId = await requireClientSession(request, reply);
    if (!userId) return;

    const client = await getClientForUser(userId);
    if (!client) return reply.status(404).send(apiError('NOT_FOUND', 'No client record found.'));

    const db = getDatabase();
    const clientProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.clientId, client.id))
      .orderBy(asc(projects.createdAt));

    return reply.send(apiSuccess(clientProjects));
  });

  // ---- GET /v1/portal/messages ----
  fastify.get('/messages', async (request, reply) => {
    const userId = await requireClientSession(request, reply);
    if (!userId) return;

    const client = await getClientForUser(userId);
    if (!client) return reply.status(404).send(apiError('NOT_FOUND', 'No client record found.'));

    const db = getDatabase();
    const thread = await db
      .select()
      .from(messages)
      .where(eq(messages.clientId, client.id))
      .orderBy(asc(messages.createdAt));

    return reply.send(apiSuccess(thread));
  });

  // ---- POST /v1/portal/messages ----
  fastify.post<{ Body: { body: string } }>('/messages', async (request, reply) => {
    const userId = await requireClientSession(request, reply);
    if (!userId) return;

    const { body: messageBody } = request.body;
    if (!messageBody.trim()) {
      return reply.status(400).send(apiError('VALIDATION_ERROR', 'body is required.'));
    }

    const client = await getClientForUser(userId);
    if (!client) return reply.status(404).send(apiError('NOT_FOUND', 'No client record found.'));

    const db = getDatabase();
    const [message] = await db
      .insert(messages)
      .values({
        id: crypto.randomUUID(),
        clientId: client.id,
        fromClient: true,
        body: messageBody.trim(),
      })
      .returning();

    return reply.status(201).send(apiSuccess(message));
  });
};
