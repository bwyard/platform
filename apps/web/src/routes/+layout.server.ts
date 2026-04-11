// ============================================================
// Root layout server load — fetches nav for all pages
// ============================================================

import type { LayoutServerLoad } from './$types';
import { fetchNav } from '$lib/server/api';

export const load: LayoutServerLoad = async () => {
  const nav = await fetchNav().catch(() => []);
  return { nav };
};
