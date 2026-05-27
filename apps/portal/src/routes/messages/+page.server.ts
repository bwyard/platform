// ============================================================
// Portal /messages — client message thread
// ============================================================

import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';

interface Message {
  id: string;
  clientId: string;
  fromClient: boolean;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export const load: PageServerLoad = async ({ parent, request }) => {
  const { user } = await parent();
  if (!user) return { messages: [] };

  const cookie = request.headers.get('cookie') ?? '';
  const messages = await apiFetch<Message[]>('/v1/portal/messages', { cookie }).catch(() => []);

  return { messages };
};

export const actions: Actions = {
  send: async ({ request }) => {
    const cookie = request.headers.get('cookie') ?? '';

    const form = await request.formData();
    const body = (form.get('body') as string | null)?.trim() ?? '';

    if (!body) return fail(400, { error: 'Message cannot be empty.' });

    try {
      await apiFetch('/v1/portal/messages', {
        method: 'POST',
        body: JSON.stringify({ body }),
        cookie,
      });
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message.';
      return fail(500, { error: message });
    }
  },
};
