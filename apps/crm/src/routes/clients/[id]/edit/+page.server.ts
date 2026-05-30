// ============================================================
// CRM /clients/[id]/edit — edit client details
// ============================================================

import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Client } from '@breeyard/shared';

export const load: PageServerLoad = async ({ params }) => {
  try {
    const client = await apiFetch<Client>(`/v1/clients/${params.id}`);
    return { client };
  } catch {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error(404, 'Client not found');
  }
};

export const actions: Actions = {
  update: async ({ params, request }) => {
    const form = await request.formData();

    const name = (form.get('name') as string | null)?.trim() ?? '';
    const email = (form.get('email') as string | null)?.trim() ?? '';

    if (!name || !email) return fail(400, { error: 'Name and email are required.' });

    try {
      await apiFetch(`/v1/clients/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          email,
          company: (form.get('company') as string | null)?.trim() ?? null,
          phone: (form.get('phone') as string | null)?.trim() ?? null,
          techLevel: form.get('techLevel') as string,
          status: form.get('status') as string,
          notes: (form.get('notes') as string | null)?.trim() ?? null,
        }),
      });
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect(302, `/clients/${params.id}`);
    } catch (err) {
      if (err instanceof Response || (err as { status?: number }).status === 302) throw err;
      const message = err instanceof Error ? err.message : 'Failed to update client.';
      return fail(500, { error: message });
    }
  },

  archive: async ({ params }) => {
    try {
      await apiFetch(`/v1/clients/${params.id}`, { method: 'DELETE' });
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect(302, '/clients');
    } catch (err) {
      if (err instanceof Response || (err as { status?: number }).status === 302) throw err;
      const message = err instanceof Error ? err.message : 'Failed to archive client.';
      return fail(500, { error: message });
    }
  },
};
