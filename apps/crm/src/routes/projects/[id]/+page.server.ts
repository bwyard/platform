// ============================================================
// CRM /projects/[id] — project detail + edit
// ============================================================

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Project } from '@breeyard/shared';

interface ProjectWithClient extends Project {
  client: { id: string; name: string; email: string } | null;
}

export const load: PageServerLoad = async ({ params }) => {
  try {
    const project = await apiFetch<ProjectWithClient>(`/v1/projects/${params.id}`);
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
      await apiFetch(`/v1/projects/${params.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name,
          description: (form.get('description') as string | null)?.trim() ?? null,
          status: form.get('status') as string,
          hoursPerMonth: form.get('hoursPerMonth') ? Number(form.get('hoursPerMonth')) : null,
          rateInCents: form.get('rateInCents') ? Number(form.get('rateInCents')) : null,
          startedAt: (form.get('startedAt') as string | null) ?? null,
          completedAt: (form.get('completedAt') as string | null) ?? null,
        }),
      });
      return { updated: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update project.';
      return fail(500, { error: message });
    }
  },
};
