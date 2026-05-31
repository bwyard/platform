// =============================================================================
// projects router — /v1/projects equivalent
// =============================================================================

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc.js';
import { projects, clients } from '@breeyard/database';
import { eq, desc } from 'drizzle-orm';

export const projectsRouter = router({
  // ---- list ----
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(projects).orderBy(desc(projects.createdAt));
  }),

  // ---- get ----
  get: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    const [project] = await ctx.db
      .select()
      .from(projects)
      .where(eq(projects.id, input.id))
      .limit(1);
    if (!project) throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found.' });

    const [client] = await ctx.db
      .select({ id: clients.id, name: clients.name, email: clients.email })
      .from(clients)
      .where(eq(clients.id, project.clientId))
      .limit(1);

    return { ...project, client: client ?? null };
  }),

  // ---- update ----
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().nullable().optional(),
        status: z.enum(['discovery', 'active', 'paused', 'completed', 'cancelled']).optional(),
        hoursPerMonth: z.number().nullable().optional(),
        rateInCents: z.number().nullable().optional(),
        startedAt: z.string().nullable().optional(),
        completedAt: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.id, input.id))
        .limit(1);
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found.' });

      const { id, ...fields } = input;
      const [updated] = await ctx.db
        .update(projects)
        .set({
          ...(fields.name !== undefined && { name: fields.name.trim() }),
          ...(fields.description !== undefined && {
            description: fields.description?.trim() ?? null,
          }),
          ...(fields.status !== undefined && { status: fields.status }),
          ...(fields.hoursPerMonth !== undefined && { hoursPerMonth: fields.hoursPerMonth }),
          ...(fields.rateInCents !== undefined && { rateInCents: fields.rateInCents }),
          ...(fields.startedAt !== undefined && {
            startedAt: fields.startedAt ? new Date(fields.startedAt) : null,
          }),
          ...(fields.completedAt !== undefined && {
            completedAt: fields.completedAt ? new Date(fields.completedAt) : null,
          }),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning();
      return updated;
    }),
});
