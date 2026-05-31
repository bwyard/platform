// ============================================================
// Portal /projects — all projects for this client
// ============================================================

import type { PageServerLoad } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ parent, request }) => {
  const { user } = await parent();
  if (!user) return { projects: [] };

  const caller = await createCaller(request);
  const projects = await caller.portal.projects().catch(() => []);

  return { projects };
};
