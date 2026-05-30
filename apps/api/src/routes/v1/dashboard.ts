// ============================================================
// Dashboard routes — /v1/dashboard
// GET /v1/dashboard — stats counts + recent clients
// ============================================================

import type { FastifyInstance } from 'fastify';
import { getDatabase, clients, messages } from '@breeyard/database';
import { desc, and, eq, isNull, sql } from 'drizzle-orm';
import { apiSuccess } from '@breeyard/shared';

// eslint-disable-next-line @typescript-eslint/require-await
export const dashboardRoutes = async (fastify: FastifyInstance): Promise<void> => {
  // ---- GET /v1/dashboard ----
  fastify.get('/', async (_request, reply) => {
    const db = getDatabase();

    const [statusCounts, [unreadRow], recentClients] = await Promise.all([
      db
        .select({ status: clients.status, count: sql<number>`count(*)::int` })
        .from(clients)
        .groupBy(clients.status),
      db
        .select({ value: sql<number>`count(*)::int` })
        .from(messages)
        .where(and(eq(messages.fromClient, true), isNull(messages.readAt))),
      db.select().from(clients).orderBy(desc(clients.updatedAt)).limit(10),
    ]);

    const counts = { total: 0, prospect: 0, active: 0, inactive: 0, churned: 0 };
    for (const row of statusCounts) {
      const key = row.status as keyof typeof counts;
      if (key in counts) counts[key] = row.count;
      counts.total += row.count;
    }

    return reply.send(
      apiSuccess({
        counts,
        unreadMessages: unreadRow?.value ?? 0,
        recentClients,
      }),
    );
  });
};
