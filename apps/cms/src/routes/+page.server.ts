// ============================================================
// CMS root — redirect to /blocks
// Auth guard in +layout.server.ts handles unauthenticated users.
// ============================================================

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw redirect(302, '/blocks');
};
