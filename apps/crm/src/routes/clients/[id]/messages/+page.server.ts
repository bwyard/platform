// ============================================================
// CRM /clients/[id]/messages — admin message thread
// ============================================================

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { apiFetch } from '$lib/server/api';

export interface Message {
  id: string;
  clientId: string;
  fromClient: boolean;
  body: string;
  readAt: string | null;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
}

export const load: PageServerLoad = async ({ params }) => {
  try {
    const [client, messages] = await Promise.all([
      apiFetch<Client>(`/v1/clients/${params.id}`),
      apiFetch<Message[]>(`/v1/clients/${params.id}/messages`),
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
      await apiFetch(`/v1/clients/${params.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
      return { sent: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message.';
      return fail(500, { error: message });
    }
  },
};
