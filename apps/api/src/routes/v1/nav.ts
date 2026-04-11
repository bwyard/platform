// ============================================================
// Nav routes — GET /v1/nav
// ============================================================

import type { FastifyInstance } from 'fastify';
import { getDatabase } from '@breeyard/database';
import { navItems } from '@breeyard/database';
import { asc, eq } from 'drizzle-orm';
import { apiSuccess } from '@breeyard/shared';

// eslint-disable-next-line @typescript-eslint/require-await
export const navRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async (_request, reply) => {
    const db = getDatabase();
    const items = await db
      .select()
      .from(navItems)
      .where(eq(navItems.visible, true))
      .orderBy(asc(navItems.order));

    return reply.send(apiSuccess(items));
  });
};
