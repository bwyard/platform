// ============================================================
// Portal root layout — auth guard (client role only)
// Public routes: /login, /register, /forgot-password, /reset-password.
// ============================================================

import { redirect, error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getSession } from '$lib/server/session';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

export const load: LayoutServerLoad = async (event) => {
  const isPublic = PUBLIC_PATHS.some((path) => event.url.pathname.startsWith(path));

  if (isPublic) return { user: null };

  const session = await getSession(event);

  if (!session) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(302, '/login');
  }

  if (session.user.role !== 'client') {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw error(403, 'Access denied');
  }

  return { user: session.user };
};
