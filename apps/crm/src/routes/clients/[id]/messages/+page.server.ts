// ============================================================
// CRM /clients/[id]/messages — admin message thread
// ============================================================

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ params, request }) => {
  try {
    const caller = await createCaller(request);
    const [client, messages] = await Promise.all([
      caller.clients.get({ id: params.id }),
      caller.clients.messages({ id: params.id }),
    ]);
    return { client, messages };
  } catch {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error(404, 'Client not found');
  }
};

export const actions: Actions = {
  reply: async ({ params, request }) => {
    const form = await request.formData();
    const body = (form.get('body') as string | null)?.trim() ?? '';
    if (!body) return fail(400, { error: 'Message cannot be empty.' });
    try {
      const caller = await createCaller(request);
      await caller.clients.sendMessage({ id: params.id, body });
      return { sent: true };
    } catch (err) {
      return fail(500, { error: err instanceof Error ? err.message : 'Failed to send message.' });
    }
  },
};
