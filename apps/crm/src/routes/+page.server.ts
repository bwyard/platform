// ============================================================
// CRM / — dashboard
// ============================================================

import type { PageServerLoad } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ request }) => {
  const caller = await createCaller(request);
  const dashboard = await caller.dashboard.stats();
  return { dashboard };
};
