// ============================================================
// CRM /projects/[id] — project detail + edit
// ============================================================

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ params, request }) => {
  try {
    const caller = await createCaller(request);
    const project = await caller.projects.get({ id: params.id });
    return { project };
  } catch {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error(404, 'Project not found');
  }
};

export const actions: Actions = {
  update: async ({ params, request }) => {
    const form = await request.formData();
    const name = (form.get('name') as string | null)?.trim() ?? '';
    if (!name) return fail(400, { error: 'Name is required.' });
    try {
      const caller = await createCaller(request);
      await caller.projects.update({
        id: params.id,
        name,
        description: (form.get('description') as string | null)?.trim() ?? null,
        status: form.get('status') as 'discovery' | 'active' | 'paused' | 'completed' | 'cancelled',
        hoursPerMonth: form.get('hoursPerMonth') ? Number(form.get('hoursPerMonth')) : null,
        rateInCents: form.get('rateInCents') ? Number(form.get('rateInCents')) : null,
        startedAt: (form.get('startedAt') as string | null) ?? null,
        completedAt: (form.get('completedAt') as string | null) ?? null,
      });
      return { updated: true };
    } catch (err) {
      return fail(500, { error: err instanceof Error ? err.message : 'Failed to update project.' });
    }
  },
};
