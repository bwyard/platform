// ============================================================
// CRM root layout — auth guard (admin only)
// Public routes: /login only. Everything else requires admin role.
// ============================================================

import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getSession } from '$lib/server/session';

const PUBLIC_PATHS = ['/login'];

export const load: LayoutServerLoad = async (event) => {
  const isPublic = PUBLIC_PATHS.some((path) => event.url.pathname.startsWith(path));

  if (isPublic) return { user: null };

  const session = await getSession(event);

  if (!session) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(302, '/login');
  }

  if (session.user.role !== 'admin') {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error(403, 'Access denied');
  }

  return { user: session.user };
};
