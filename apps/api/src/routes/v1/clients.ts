// ============================================================
// Clients routes — /v1/clients
// GET  /v1/clients                    — list all clients
// POST /v1/clients                    — create a client
// GET  /v1/clients/:id                — get one client + projects + unreadCount
// POST /v1/clients/:id/invite         — create portal account + send welcome email
// POST /v1/clients/:id/projects       — create a project for a client
// GET  /v1/clients/:id/messages       — thread for a client (marks client msgs read)
// POST /v1/clients/:id/messages       — admin reply to a client
// ============================================================

import type { FastifyInstance } from 'fastify';
import { getDatabase, clients, projects, users, messages } from '@breeyard/database';
import { eq, desc, asc, and, isNull, count } from 'drizzle-orm';
import { apiSuccess, apiError } from '@breeyard/shared';
import type { CreateClientInput, CreateProjectInput } from '@breeyard/shared';
import { getAuth } from '@breeyard/auth';
import { getMailClient } from '@breeyard/mail';

// eslint-disable-next-line @typescript-eslint/require-await
export const clientsRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // ---- GET /v1/clients ----
  fastify.get('/', async (_request, reply) => {
    const db = getDatabase();
    const rows = await db.select().from(clients).orderBy(desc(clients.createdAt));
    return reply.send(apiSuccess(rows));
  });

  // ---- POST /v1/clients ----
  fastify.post<{ Body: CreateClientInput }>('/', async (request, reply) => {
    const { name, email, company, phone, techLevel = 'medium', notes } = request.body;

    if (!name.trim() || !email.trim()) {
      return reply.status(400).send(apiError('VALIDATION_ERROR', 'Name and email are required.'));
    }

    const db = getDatabase();
    const id = crypto.randomUUID();

    const [client] = await db
      .insert(clients)
      .values({
        id,
        name: name.trim(),
        email: email.trim(),
        company: company?.trim() ?? null,
        phone: phone?.trim() ?? null,
        techLevel,
        status: 'prospect',
        notes: notes?.trim() ?? null,
      })
      .returning();

    return reply.status(201).send(apiSuccess(client));
  });

  // ---- GET /v1/clients/:id ----
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const db = getDatabase();

    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, request.params.id))
      .limit(1);

    if (!client) {
      return reply.status(404).send(apiError('NOT_FOUND', 'Client not found.'));
    }

    const [clientProjects, [unread]] = await Promise.all([
      db
        .select()
        .from(projects)
        .where(eq(projects.clientId, client.id))
        .orderBy(desc(projects.createdAt)),
      db
        .select({ value: count() })
        .from(messages)
        .where(
          and(
            eq(messages.clientId, client.id),
            eq(messages.fromClient, true),
            isNull(messages.readAt),
          ),
        ),
    ]);

    return reply.send(
      apiSuccess({ ...client, projects: clientProjects, unreadCount: unread?.value ?? 0 }),
    );
  });

  // ---- POST /v1/clients/:id/invite ----
  fastify.post<{ Params: { id: string } }>('/:id/invite', async (request, reply) => {
    const db = getDatabase();

    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, request.params.id))
      .limit(1);

    if (!client) {
      return reply.status(404).send(apiError('NOT_FOUND', 'Client not found.'));
    }

    if (client.userId) {
      return reply.status(409).send(apiError('CONFLICT', 'Client already has a portal account.'));
    }

    // Use existing user if email already registered, otherwise create a new one.
    const [existingUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, client.email))
      .limit(1);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create user via better-auth. Temp password — client sets their own via forgot password.
      const result = (await getAuth().api.signUpEmail({
        body: { name: client.name, email: client.email, password: crypto.randomUUID() },
      })) as { user: { id: string } } | null;

      if (!result?.user) {
        return reply
          .status(500)
          .send(apiError('INTERNAL_ERROR', 'Failed to create portal account.'));
      }

      userId = result.user.id;
    }

    await db
      .update(clients)
      .set({ userId, updatedAt: new Date() })
      .where(eq(clients.id, client.id));

    const portalUrl = process.env.PORTAL_URL ?? 'http://localhost:3014';

    await getMailClient().sendWelcome(client.email, { name: client.name, loginUrl: portalUrl });

    return reply.send(apiSuccess({ invited: true }));
  });

  // ---- POST /v1/clients/:id/projects ----
  fastify.post<{ Params: { id: string }; Body: CreateProjectInput }>(
    '/:id/projects',
    async (request, reply) => {
      const db = getDatabase();

      const [client] = await db
        .select({ id: clients.id })
        .from(clients)
        .where(eq(clients.id, request.params.id))
        .limit(1);

      if (!client) {
        return reply.status(404).send(apiError('NOT_FOUND', 'Client not found.'));
      }

      const { name, slug, description, hoursPerMonth, rateInCents } = request.body;

      if (!name.trim() || !slug.trim()) {
        return reply.status(400).send(apiError('VALIDATION_ERROR', 'Name and slug are required.'));
      }

      const id = crypto.randomUUID();
      const [project] = await db
        .insert(projects)
        .values({
          id,
          clientId: client.id,
          name: name.trim(),
          slug: slug.trim(),
          description: description?.trim() ?? null,
          status: 'discovery',
          hoursPerMonth: hoursPerMonth ?? null,
          rateInCents: rateInCents ?? null,
        })
        .returning();

      return reply.status(201).send(apiSuccess(project));
    },
  );

  // ---- GET /v1/clients/:id/messages ----
  fastify.get<{ Params: { id: string } }>('/:id/messages', async (request, reply) => {
    const db = getDatabase();

    const [client] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.id, request.params.id))
      .limit(1);
    if (!client) return reply.status(404).send(apiError('NOT_FOUND', 'Client not found.'));

    const thread = await db
      .select()
      .from(messages)
      .where(eq(messages.clientId, client.id))
      .orderBy(asc(messages.createdAt));

    await db
      .update(messages)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(messages.clientId, client.id),
          eq(messages.fromClient, true),
          isNull(messages.readAt),
        ),
      );

    return reply.send(apiSuccess(thread));
  });

  // ---- POST /v1/clients/:id/messages ----
  fastify.post<{ Params: { id: string }; Body: { body: string } }>(
    '/:id/messages',
    async (request, reply) => {
      const db = getDatabase();

      const [client] = await db
        .select({ id: clients.id })
        .from(clients)
        .where(eq(clients.id, request.params.id))
        .limit(1);
      if (!client) return reply.status(404).send(apiError('NOT_FOUND', 'Client not found.'));

      const { body: messageBody } = request.body;
      if (!messageBody.trim()) {
        return reply.status(400).send(apiError('VALIDATION_ERROR', 'body is required.'));
      }

      const [message] = await db
        .insert(messages)
        .values({
          id: crypto.randomUUID(),
          clientId: client.id,
          fromClient: false,
          body: messageBody.trim(),
        })
        .returning();

      return reply.status(201).send(apiSuccess(message));
    },
  );
};
