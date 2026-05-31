// ============================================================
// CRM /clients/new
// ============================================================

import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createCaller } from '$lib/server/api';
import type { CreateClientInput } from '@breeyard/shared';

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
    if (!name || !email) return fail(400, { error: 'Name and email are required.' });
    try {
      const caller = await createCaller(request);
      const client = await caller.clients.create({ name, email, company, phone, techLevel, notes });
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect(302, '/clients/' + client.id);
    } catch (err) {
      if (err instanceof Response) throw err;
      return fail(500, { error: err instanceof Error ? err.message : 'Failed to create client.' });
    }
  },
};
