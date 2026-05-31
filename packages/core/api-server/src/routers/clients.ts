// =============================================================================
// clients router — /v1/clients equivalent
// Admin-facing: full client + project + message CRUD
// =============================================================================

import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc.js';
import { clients, projects, users, messages } from '@breeyard/database';
import { eq, desc, asc, and, isNull, count } from 'drizzle-orm';
import { getAuth } from '@breeyard/auth';
import { getMailClient } from '@breeyard/mail';

const clientIdInput = z.object({ id: z.string() });

export const clientsRouter = router({
  // ---- list ----
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(clients).orderBy(desc(clients.createdAt));
  }),

  // ---- create ----
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.email(),
        company: z.string().optional(),
        phone: z.string().optional(),
        techLevel: z.enum(['low', 'medium', 'high']).optional().default('medium'),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID();
      const [client] = await ctx.db
        .insert(clients)
        .values({
          id,
          name: input.name.trim(),
          email: input.email.trim(),
          company: input.company?.trim() ?? null,
          phone: input.phone?.trim() ?? null,
          techLevel: input.techLevel,
          status: 'prospect',
          notes: input.notes?.trim() ?? null,
        })
        .returning();
      if (!client)
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create client.' });
      return client;
    }),

  // ---- get ----
  get: publicProcedure.input(clientIdInput).query(async ({ ctx, input }) => {
    const [client] = await ctx.db.select().from(clients).where(eq(clients.id, input.id)).limit(1);

    if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' });

    const [clientProjects, [unread]] = await Promise.all([
      ctx.db
        .select()
        .from(projects)
        .where(eq(projects.clientId, client.id))
        .orderBy(desc(projects.createdAt)),
      ctx.db
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

    return { ...client, projects: clientProjects, unreadCount: unread?.value ?? 0 };
  }),

  // ---- update ----
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        email: z.email().optional(),
        company: z.string().nullable().optional(),
        phone: z.string().nullable().optional(),
        techLevel: z.enum(['low', 'medium', 'high']).optional(),
        status: z.enum(['prospect', 'active', 'inactive', 'churned']).optional(),
        notes: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select({ id: clients.id })
        .from(clients)
        .where(eq(clients.id, input.id))
        .limit(1);
      if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' });

      const { id, ...fields } = input;
      const [updated] = await ctx.db
        .update(clients)
        .set({
          ...(fields.name !== undefined && { name: fields.name.trim() }),
          ...(fields.email !== undefined && { email: fields.email.trim() }),
          ...(fields.company !== undefined && { company: fields.company?.trim() ?? null }),
          ...(fields.phone !== undefined && { phone: fields.phone?.trim() ?? null }),
          ...(fields.techLevel !== undefined && { techLevel: fields.techLevel }),
          ...(fields.status !== undefined && { status: fields.status }),
          ...(fields.notes !== undefined && { notes: fields.notes?.trim() ?? null }),
          updatedAt: new Date(),
        })
        .where(eq(clients.id, id))
        .returning();
      return updated;
    }),

  // ---- archive ----
  archive: publicProcedure.input(clientIdInput).mutation(async ({ ctx, input }) => {
    const [existing] = await ctx.db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.id, input.id))
      .limit(1);
    if (!existing) throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' });

    await ctx.db
      .update(clients)
      .set({ status: 'churned', updatedAt: new Date() })
      .where(eq(clients.id, input.id));

    return { archived: true };
  }),

  // ---- invite ----
  invite: publicProcedure.input(clientIdInput).mutation(async ({ ctx, input }) => {
    const [client] = await ctx.db.select().from(clients).where(eq(clients.id, input.id)).limit(1);
    if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' });
    if (client.userId)
      throw new TRPCError({ code: 'CONFLICT', message: 'Client already has a portal account.' });

    const [existingUser] = await ctx.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, client.email))
      .limit(1);

    let userId: string;
    if (existingUser) {
      userId = existingUser.id;
    } else {
      const result = (await getAuth().api.signUpEmail({
        body: { name: client.name, email: client.email, password: crypto.randomUUID() },
      })) as { user: { id: string } } | null;
      if (!result?.user)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create portal account.',
        });
      userId = result.user.id;
    }

    await ctx.db
      .update(clients)
      .set({ userId, updatedAt: new Date() })
      .where(eq(clients.id, client.id));

    const portalUrl = process.env.PORTAL_URL ?? 'http://localhost:3014';
    await getMailClient().sendWelcome(client.email, { name: client.name, loginUrl: portalUrl });

    return { invited: true };
  }),

  // ---- createProject ----
  createProject: publicProcedure
    .input(
      z.object({
        clientId: z.string(),
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        hoursPerMonth: z.number().optional(),
        rateInCents: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [client] = await ctx.db
        .select({ id: clients.id })
        .from(clients)
        .where(eq(clients.id, input.clientId))
        .limit(1);
      if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' });

      const [project] = await ctx.db
        .insert(projects)
        .values({
          id: crypto.randomUUID(),
          clientId: client.id,
          name: input.name.trim(),
          slug: input.slug.trim(),
          description: input.description?.trim() ?? null,
          status: 'discovery',
          hoursPerMonth: input.hoursPerMonth ?? null,
          rateInCents: input.rateInCents ?? null,
        })
        .returning();
      return project;
    }),

  // ---- messages ----
  messages: publicProcedure.input(clientIdInput).query(async ({ ctx, input }) => {
    const [client] = await ctx.db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.id, input.id))
      .limit(1);
    if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' });

    const thread = await ctx.db
      .select()
      .from(messages)
      .where(eq(messages.clientId, client.id))
      .orderBy(asc(messages.createdAt));

    await ctx.db
      .update(messages)
      .set({ readAt: new Date() })
      .where(
        and(
          eq(messages.clientId, client.id),
          eq(messages.fromClient, true),
          isNull(messages.readAt),
        ),
      );

    return thread;
  }),

  // ---- sendMessage ----
  sendMessage: publicProcedure
    .input(z.object({ id: z.string(), body: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [client] = await ctx.db
        .select({ id: clients.id })
        .from(clients)
        .where(eq(clients.id, input.id))
        .limit(1);
      if (!client) throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' });

      const [message] = await ctx.db
        .insert(messages)
        .values({
          id: crypto.randomUUID(),
          clientId: client.id,
          fromClient: false,
          body: input.body.trim(),
        })
        .returning();
      return message;
    }),
});
