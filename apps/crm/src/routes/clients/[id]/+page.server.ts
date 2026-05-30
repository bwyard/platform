// ============================================================
// CRM /clients/[id] — client detail
// ============================================================

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Client, Project } from '@breeyard/shared';

type ClientWithProjects = Client & { projects: Project[]; unreadCount: number };

export const load: PageServerLoad = async ({ params }) => {
  try {
    const client = await apiFetch<ClientWithProjects>(`/v1/clients/${params.id}`);
    return { client, projects: client.projects, unreadCount: client.unreadCount };
  } catch {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error(404, 'Client not found');
  }
};

export const actions: Actions = {
  invite: async ({ params }) => {
    try {
      await apiFetch(`/v1/clients/${params.id}/invite`, { method: 'POST' });
      return { invited: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send invite.';
      return fail(400, { error: message });
    }
  },
};
