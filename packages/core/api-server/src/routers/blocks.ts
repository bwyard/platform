// =============================================================================
// blocks router — GET /v1/blocks?page=home equivalent
// =============================================================================

import { z } from 'zod';
import { router, publicProcedure } from '../trpc.js';
import { blocks } from '@breeyard/database';
import { slugSchema } from '@breeyard/validation';
import { asc, and, eq } from 'drizzle-orm';

export const blocksRouter = router({
  list: publicProcedure
    .input(z.object({ page: slugSchema.optional().default('home') }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(blocks)
        .where(and(eq(blocks.pageSlug, input.page), eq(blocks.visible, true)))
        .orderBy(asc(blocks.order));
    }),
});
