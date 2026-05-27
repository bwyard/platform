// ============================================================
// Portal /projects — all projects for this client
// ============================================================

import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Project } from '@breeyard/shared';

export const load: PageServerLoad = async ({ parent, request }) => {
  const { user } = await parent();
  if (!user) return { projects: [] };

  const cookie = request.headers.get('cookie') ?? '';

  const projects = await apiFetch<Project[]>('/v1/portal/projects', { cookie }).catch(() => []);

  return { projects };
};
