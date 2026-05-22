// ============================================================
// CRM /clients — list all clients
// ============================================================

import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Client } from '@breeyard/shared';

export const load: PageServerLoad = async () => {
  const clients = await apiFetch<Client[]>('/v1/clients');
  return { clients };
};
