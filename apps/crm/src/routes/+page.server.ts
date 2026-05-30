// ============================================================
// CRM / — dashboard
// ============================================================

import type { PageServerLoad } from './$types';
import { apiFetch } from '$lib/server/api';
import type { Client } from '@breeyard/shared';

interface DashboardData {
  counts: { total: number; prospect: number; active: number; inactive: number; churned: number };
  unreadMessages: number;
  recentClients: Client[];
}

export const load: PageServerLoad = async () => {
  const dashboard = await apiFetch<DashboardData>('/v1/dashboard');
  return { dashboard };
};
