// ============================================================
// CRM /clients/new — create a new client
// ============================================================

import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Client, CreateClientInput } from '@breeyard/shared';

const formOptional = (data: FormData, key: string): string | undefined => {
  const value = (data.get(key) as string | null)?.trim();
  return value !== undefined && value !== '' ? value : undefined;
};

export const load: PageServerLoad = () => ({});

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();

    const name = (form.get('name') as string | null)?.trim() ?? '';
    const email = (form.get('email') as string | null)?.trim() ?? '';
    const company = formOptional(form, 'company');
    const phone = formOptional(form, 'phone');
    const techLevel = ((form.get('techLevel') as string | null) ??
      'medium') as CreateClientInput['techLevel'];
    const notes = formOptional(form, 'notes');

    if (!name || !email) {
      return fail(400, { error: 'Name and email are required.' });
    }

    try {
      const client = await apiFetch<Client>('/v1/clients', {
        method: 'POST',
        body: JSON.stringify({ name, email, company, phone, techLevel, notes }),
      });

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect(302, `/clients/${client.id}`);
    } catch (err) {
      if (err instanceof Response) throw err;
      const message = err instanceof Error ? err.message : 'Failed to create client.';
      return fail(500, { error: message });
    }
  },
};
