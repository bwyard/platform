// ============================================================
// Portal routes — /v1/portal
// Client-scoped: all data filtered to the requesting user's client record.
//
// GET /v1/portal/me           — client record for the logged-in user
// GET /v1/portal/projects     — projects for the logged-in user's client
// GET /v1/portal/messages     — messages for the logged-in user's client
// POST /v1/portal/messages    — send a message from the client
// ============================================================

import type { FastifyInstance } from 'fastify';
import { getDatabase, clients, projects, messages } from '@breeyard/database';
import { eq, asc } from 'drizzle-orm';
import { apiSuccess, apiError } from '@breeyard/shared';

// eslint-disable-next-line @typescript-eslint/require-await
export const portalRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // ---- GET /v1/portal/me ----
  fastify.get<{ Querystring: { userId: string } }>('/me', async (request, reply) => {
    const { userId } = request.query;

    if (!userId) {
      return reply.status(400).send(apiError('VALIDATION_ERROR', 'userId is required.'));
    }

    const db = getDatabase();
    const [client] = await db.select().from(clients).where(eq(clients.userId, userId)).limit(1);

    if (!client) {
      return reply.status(404).send(apiError('NOT_FOUND', 'No client record found.'));
    }

    return reply.send(apiSuccess(client));
  });

  // ---- GET /v1/portal/projects ----
  fastify.get<{ Querystring: { userId: string } }>('/projects', async (request, reply) => {
    const { userId } = request.query;

    if (!userId) {
      return reply.status(400).send(apiError('VALIDATION_ERROR', 'userId is required.'));
    }

    const db = getDatabase();
    const [client] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.userId, userId))
      .limit(1);

    if (!client) {
      return reply.status(404).send(apiError('NOT_FOUND', 'No client record found.'));
    }

    const clientProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.clientId, client.id))
      .orderBy(asc(projects.createdAt));

    return reply.send(apiSuccess(clientProjects));
  });

  // ---- GET /v1/portal/messages ----
  fastify.get<{ Querystring: { userId: string } }>('/messages', async (request, reply) => {
    const { userId } = request.query;

    if (!userId) {
      return reply.status(400).send(apiError('VALIDATION_ERROR', 'userId is required.'));
    }

    const db = getDatabase();
    const [client] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.userId, userId))
      .limit(1);

    if (!client) {
      return reply.status(404).send(apiError('NOT_FOUND', 'No client record found.'));
    }

    const thread = await db
      .select()
      .from(messages)
      .where(eq(messages.clientId, client.id))
      .orderBy(asc(messages.createdAt));

    return reply.send(apiSuccess(thread));
  });

  // ---- POST /v1/portal/messages ----
  fastify.post<{ Body: { userId: string; body: string } }>('/messages', async (request, reply) => {
    const { userId, body: messageBody } = request.body;

    if (!userId || !messageBody.trim()) {
      return reply.status(400).send(apiError('VALIDATION_ERROR', 'userId and body are required.'));
    }

    const db = getDatabase();
    const [client] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.userId, userId))
      .limit(1);

    if (!client) {
      return reply.status(404).send(apiError('NOT_FOUND', 'No client record found.'));
    }

    const id = crypto.randomUUID();
    const [message] = await db
      .insert(messages)
      .values({
        id,
        clientId: client.id,
        fromClient: true,
        body: messageBody.trim(),
      })
      .returning();

    return reply.status(201).send(apiSuccess(message));
  });
};
