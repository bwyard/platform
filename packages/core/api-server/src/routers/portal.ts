// =============================================================================
// portal router — /v1/portal equivalent
// Client-scoped: all procedures require a valid session with a client record
// =============================================================================

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc.js';
import { clients, projects, messages } from '@breeyard/database';
import { eq, asc } from 'drizzle-orm';

export const portalRouter = router({
  // ---- me ----
  me: protectedProcedure.query(async ({ ctx }) => {
    const [client] = await ctx.db
      .select()
      .from(clients)
      .where(eq(clients.userId, ctx.userId))
      .limit(1);
    if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'No client record found.' });
    return client;
  }),

  // ---- projects ----
  projects: protectedProcedure.query(async ({ ctx }) => {
    const [client] = await ctx.db
      .select()
      .from(clients)
      .where(eq(clients.userId, ctx.userId))
      .limit(1);
    if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'No client record found.' });

    return ctx.db
      .select()
      .from(projects)
      .where(eq(projects.clientId, client.id))
      .orderBy(asc(projects.createdAt));
  }),

  // ---- projectById ----
  projectById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [client] = await ctx.db
        .select()
        .from(clients)
        .where(eq(clients.userId, ctx.userId))
        .limit(1);
      if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'No client record found.' });

      const [project] = await ctx.db
        .select()
        .from(projects)
        .where(eq(projects.id, input.id))
        .limit(1);

      if (project?.clientId !== client.id) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Project not found.' });
      }
      return project;
    }),

  // ---- messages ----
  messages: protectedProcedure.query(async ({ ctx }) => {
    const [client] = await ctx.db
      .select()
      .from(clients)
      .where(eq(clients.userId, ctx.userId))
      .limit(1);
    if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'No client record found.' });

    return ctx.db
      .select()
      .from(messages)
      .where(eq(messages.clientId, client.id))
      .orderBy(asc(messages.createdAt));
  }),

  // ---- sendMessage ----
  sendMessage: protectedProcedure
    .input(z.object({ body: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [client] = await ctx.db
        .select()
        .from(clients)
        .where(eq(clients.userId, ctx.userId))
        .limit(1);
      if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'No client record found.' });

      const [message] = await ctx.db
        .insert(messages)
        .values({
          id: crypto.randomUUID(),
          clientId: client.id,
          fromClient: true,
          body: input.body.trim(),
        })
        .returning();
      return message;
    }),
});
