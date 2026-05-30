// ============================================================
// CRM /projects — all projects list
// ============================================================

import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Project } from '@breeyard/shared';

export const load: PageServerLoad = async () => {
  const projects = await apiFetch<Project[]>('/v1/projects').catch(() => []);
  return { projects };
};
