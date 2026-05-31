// ============================================================
// CRM /clients — list all clients
// ============================================================

import type { PageServerLoad } from './$types';
import { createCaller } from '$lib/server/api';

export const load: PageServerLoad = async ({ request }) => {
  const caller = await createCaller(request);
  const clients = await caller.clients.list();
  return { clients };
};
