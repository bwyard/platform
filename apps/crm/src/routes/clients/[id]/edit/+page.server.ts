// ============================================================
// CRM /clients/[id]/edit
// ============================================================

import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ params, request }) => {
  try {
    const caller = await createCaller(request);
    const client = await caller.clients.get({ id: params.id });
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
      const caller = await createCaller(request);
      await caller.clients.update({
        id: params.id,
        name,
        email,
        company: (form.get('company') as string | null)?.trim() ?? null,
        phone: (form.get('phone') as string | null)?.trim() ?? null,
        techLevel: form.get('techLevel') as 'low' | 'medium' | 'high',
        status: form.get('status') as 'prospect' | 'active' | 'inactive' | 'churned',
        notes: (form.get('notes') as string | null)?.trim() ?? null,
      });
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect(302, '/clients/' + params.id);
    } catch (err) {
      if (err instanceof Response || (err as { status?: number }).status === 302) throw err;
      return fail(500, { error: err instanceof Error ? err.message : 'Failed to update client.' });
    }
  },

  archive: async ({ params, request }) => {
    try {
      const caller = await createCaller(request);
      await caller.clients.archive({ id: params.id });
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw redirect(302, '/clients');
    } catch (err) {
      if (err instanceof Response || (err as { status?: number }).status === 302) throw err;
      return fail(500, { error: err instanceof Error ? err.message : 'Failed to archive client.' });
    }
  },
};
