// ============================================================
// Portal /projects/[id] — single project detail (read-only)
// ============================================================

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Project } from '@breeyard/shared';

export const load: PageServerLoad = async ({ params, request }) => {
  const cookie = request.headers.get('cookie') ?? '';
  try {
    const project = await apiFetch<Project>(`/v1/portal/projects/${params.id}`, { cookie });
    return { project };
  } catch {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error(404, 'Project not found');
  }
};
