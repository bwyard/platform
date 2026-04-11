// ============================================================
// Dashboard page server load
// Auth guard in root +layout.server.ts handles redirect.
// Extend here with real stats queries as features land.
// ============================================================

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  return {};
};
