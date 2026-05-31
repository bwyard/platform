// ============================================================
// Portal /projects/[id] — single project detail (read-only)
// ============================================================

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ params, request }) => {
  try {
    const caller = await createCaller(request);
    const project = await caller.portal.projectById({ id: params.id });
    return { project };
  } catch {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error(404, 'Project not found');
  }
};
