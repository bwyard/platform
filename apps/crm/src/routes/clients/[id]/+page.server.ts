// ============================================================
// CRM /clients/[id] — client detail
// ============================================================

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Client, Project } from '@breeyard/shared';

type ClientWithProjects = Client & { projects: Project[] };

export const load: PageServerLoad = async ({ params }) => {
  try {
    const client = await apiFetch<ClientWithProjects>(`/v1/clients/${params.id}`);
    return { client, projects: client.projects };
  } catch {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error(404, 'Client not found');
  }
};
