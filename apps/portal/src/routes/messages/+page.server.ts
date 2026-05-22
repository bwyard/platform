// ============================================================
// Portal /messages — client message thread
// ============================================================

import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { PageServerLoadEvent } from './$types';
import { apiFetch } from '$lib/server/api';
import { getSession } from '$lib/server/session';

interface Message {
  id: string;
  clientId: string;
  fromClient: boolean;
  body: string;
  readAt: string | null;
  createdAt: string;
}

export const load: PageServerLoad = async ({ parent }: PageServerLoadEvent) => {
  const { user } = await parent();

  if (!user) return { messages: [] };

  const messages = await apiFetch<Message[]>(`/v1/portal/messages?userId=${user.id}`).catch(
    () => [],
  );

  return { messages };
};

export const actions: Actions = {
  send: async (event) => {
    const session = await getSession(event);

    if (!session) return fail(401, { error: 'Not authenticated.' });

    const { user } = session;
    const { request } = event;

    const form = await request.formData();
    const body = (form.get('body') as string | null)?.trim() ?? '';

    if (!body) return fail(400, { error: 'Message cannot be empty.' });

    try {
      await apiFetch('/v1/portal/messages', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, body }),
      });

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message.';
      return fail(500, { error: message });
    }
  },
};
