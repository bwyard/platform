// ============================================================
// Blocks routes — GET /v1/blocks?page=home
// ============================================================

import type { FastifyInstance } from 'fastify';
import { getDatabase } from '@breeyard/database';
import { blocks } from '@breeyard/database';
import { asc, eq, and } from 'drizzle-orm';
import { apiSuccess } from '@breeyard/shared';

// eslint-disable-next-line @typescript-eslint/require-await
export const blocksRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get<{ Querystring: { page?: string } }>('/', async (request, reply) => {
    const pageSlug = request.query.page ?? 'home';
    const db = getDatabase();

    const items = await db
      .select()
      .from(blocks)
      .where(and(eq(blocks.pageSlug, pageSlug), eq(blocks.visible, true)))
      .orderBy(asc(blocks.order));

    return reply.send(apiSuccess(items));
  });
};
