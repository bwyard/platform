// ============================================================
// Portal /messages — client message thread
// ============================================================

import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ parent, request }) => {
  const { user } = await parent();
  if (!user) return { messages: [] };

  const caller = await createCaller(request);
  const messages = await caller.portal.messages().catch(() => []);

  return { messages };
};

export const actions: Actions = {
  send: async ({ request }) => {
    const form = await request.formData();
    const body = (form.get('body') as string | null)?.trim() ?? '';
    if (!body) return fail(400, { error: 'Message cannot be empty.' });
    try {
      const caller = await createCaller(request);
      await caller.portal.sendMessage({ body });
      return { success: true };
    } catch (err) {
      return fail(500, { error: err instanceof Error ? err.message : 'Failed to send message.' });
    }
  },
};
