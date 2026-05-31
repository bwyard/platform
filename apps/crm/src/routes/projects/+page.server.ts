// ============================================================
// CRM /projects — all projects list
// ============================================================

import type { PageServerLoad } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ request }) => {
  const caller = await createCaller(request);
  const projects = await caller.projects.list().catch(() => []);
  return { projects };
};
