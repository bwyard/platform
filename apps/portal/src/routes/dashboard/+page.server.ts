// ============================================================
// Portal /dashboard — client overview
// ============================================================

import type { PageServerLoad } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ parent, request }) => {
  const { user } = await parent();
  if (!user) return { client: null, projects: [] };

  const caller = await createCaller(request);
  const [client, projects] = await Promise.all([
    caller.portal.me().catch(() => null),
    caller.portal.projects().catch(() => []),
  ]);

  return { client, projects };
};
