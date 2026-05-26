// ============================================================
// Portal /projects — all projects for this client
// ============================================================

import type { PageServerLoad, PageServerLoadEvent } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Project } from '@breeyard/shared';

export const load: PageServerLoad = async ({ parent }: PageServerLoadEvent) => {
  const { user } = await parent();

  if (!user) return { projects: [] };

  const projects = await apiFetch<Project[]>(`/v1/portal/projects?userId=${user.id}`).catch(
    () => [],
  );

  return { projects };
};
