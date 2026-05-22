// ============================================================
// Portal /dashboard — client overview
// ============================================================

import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Client, Project } from '@breeyard/shared';

export const load: PageServerLoad = async ({ parent }) => {
  const { user } = await parent();

  if (!user) return { client: null, projects: [] };

  const [client, projects] = await Promise.all([
    apiFetch<Client>(`/v1/portal/me?userId=${user.id}`).catch(() => null),
    apiFetch<Project[]>(`/v1/portal/projects?userId=${user.id}`).catch(() => []),
  ]);

  return { client, projects };
};
