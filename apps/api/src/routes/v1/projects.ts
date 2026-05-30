// ============================================================
// Projects routes — /v1/projects
// GET   /v1/projects        — list all projects (newest first)
// GET   /v1/projects/:id    — get one project + client info
// PATCH /v1/projects/:id    — update project fields
// ============================================================

import type { FastifyInstance } from 'fastify';
import { getDatabase, projects, clients } from '@breeyard/database';
import { eq, desc } from 'drizzle-orm';
import { apiSuccess, apiError } from '@breeyard/shared';
import type { UpdateProjectInput } from '@breeyard/shared';

// eslint-disable-next-line @typescript-eslint/require-await
export const projectsRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // ---- GET /v1/projects ----
  fastify.get('/', async (_request, reply) => {
    const db = getDatabase();
    const rows = await db.select().from(projects).orderBy(desc(projects.createdAt));
    return reply.send(apiSuccess(rows));
  });

  // ---- GET /v1/projects/:id ----
  fastify.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
    const db = getDatabase();

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, request.params.id))
      .limit(1);
    if (!project) return reply.status(404).send(apiError('NOT_FOUND', 'Project not found.'));

    const [client] = await db
      .select({ id: clients.id, name: clients.name, email: clients.email })
      .from(clients)
      .where(eq(clients.id, project.clientId))
      .limit(1);

    return reply.send(apiSuccess({ ...project, client: client ?? null }));
  });

  // ---- PATCH /v1/projects/:id ----
  fastify.patch<{ Params: { id: string }; Body: UpdateProjectInput }>(
    '/:id',
    async (request, reply) => {
      const db = getDatabase();

      const [existing] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.id, request.params.id))
        .limit(1);
      if (!existing) return reply.status(404).send(apiError('NOT_FOUND', 'Project not found.'));

      const { name, description, status, hoursPerMonth, rateInCents, startedAt, completedAt } =
        request.body;

      const [updated] = await db
        .update(projects)
        .set({
          ...(name !== undefined && { name: name.trim() }),
          ...(description !== undefined && { description: description?.trim() ?? null }),
          ...(status !== undefined && { status }),
          ...(hoursPerMonth !== undefined && { hoursPerMonth }),
          ...(rateInCents !== undefined && { rateInCents }),
          ...(startedAt !== undefined && { startedAt: startedAt ? new Date(startedAt) : null }),
          ...(completedAt !== undefined && {
            completedAt: completedAt ? new Date(completedAt) : null,
          }),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, request.params.id))
        .returning();

      return reply.send(apiSuccess(updated));
    },
  );
};
