// =============================================================================
// nav router — GET /v1/nav equivalent
// =============================================================================

import { router, publicProcedure } from '../trpc.js';
import { navItems } from '@breeyard/database';
import { asc, eq } from 'drizzle-orm';

export const navRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(navItems)
      .where(eq(navItems.visible, true))
      .orderBy(asc(navItems.order));
  }),
});
