// ============================================================
// Portal /dashboard — client overview
// ============================================================

import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Client, Project } from '@breeyard/shared';

export const load: PageServerLoad = async ({ parent, request }) => {
  const { user } = await parent();
  if (!user) return { client: null, projects: [] };

  const cookie = request.headers.get('cookie') ?? '';

  const [client, projects] = await Promise.all([
    apiFetch<Client>('/v1/portal/me', { cookie }).catch(() => null),
    apiFetch<Project[]>('/v1/portal/projects', { cookie }).catch(() => []),
  ]);

  return { client, projects };
};
