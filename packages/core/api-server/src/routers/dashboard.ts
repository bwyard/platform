// =============================================================================
// dashboard router — GET /v1/dashboard equivalent
// Admin-only: stats counts + recent clients
// =============================================================================

import { router, publicProcedure } from '../trpc.js';
import { clients, messages } from '@breeyard/database';
import { desc, and, eq, isNull, sql } from 'drizzle-orm';

export const dashboardRouter = router({
  stats: publicProcedure.query(async ({ ctx }) => {
    const [statusCounts, [unreadRow], recentClients] = await Promise.all([
      ctx.db
        .select({ status: clients.status, count: sql<number>`count(*)::int` })
        .from(clients)
        .groupBy(clients.status),
      ctx.db
        .select({ value: sql<number>`count(*)::int` })
        .from(messages)
        .where(and(eq(messages.fromClient, true), isNull(messages.readAt))),
      ctx.db.select().from(clients).orderBy(desc(clients.updatedAt)).limit(10),
    ]);

    const counts = { total: 0, prospect: 0, active: 0, inactive: 0, churned: 0 };
    for (const row of statusCounts) {
      const key = row.status as keyof typeof counts;
      if (key in counts) counts[key] = row.count;
      counts.total += row.count;
    }

    return {
      counts,
      unreadMessages: unreadRow?.value ?? 0,
      recentClients,
    };
  }),
});
