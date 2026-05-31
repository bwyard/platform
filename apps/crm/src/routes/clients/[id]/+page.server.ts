// ============================================================
// CRM /clients/[id]
// ============================================================

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ params, request }) => {
  try {
    const caller = await createCaller(request);
    const client = await caller.clients.get({ id: params.id });
    return { client, projects: client.projects, unreadCount: client.unreadCount };
  } catch {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error(404, 'Client not found');
  }
};

export const actions: Actions = {
  invite: async ({ params, request }) => {
    try {
      const caller = await createCaller(request);
      await caller.clients.invite({ id: params.id });
      return { invited: true };
    } catch (err) {
      return fail(400, { error: err instanceof Error ? err.message : 'Failed to send invite.' });
    }
  },
};
