// ============================================================
// Root layout server load — no dynamic data needed for static site
// ============================================================

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = () => {
  return {};
};
