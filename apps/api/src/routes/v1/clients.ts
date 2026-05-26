// ============================================================
// Clients routes — /v1/clients
// GET  /v1/clients          — list all clients
// POST /v1/clients          — create a client
// GET  /v1/clients/:id      — get one client + projects
// POST /v1/clients/:id/projects — create a project for a client
// ============================================================

import type { FastifyInstance } from 'fastify';
import { getDatabase, clients, projects } from '@breeyard/database';
import { eq, desc } from 'drizzle-orm';
import { apiSuccess, apiError } from '@breeyard/shared';
import type { CreateClientInput, CreateProjectInput } from '@breeyard/shared';

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

    const clientProjects = await db
      .select()
      .from(projects)
      .where(eq(projects.clientId, client.id))
      .orderBy(desc(projects.createdAt));

    return reply.send(apiSuccess({ ...client, projects: clientProjects }));
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
};
