// ============================================================
// Portal root layout — auth guard
// Public routes: /login, /register, /forgot-password.
// ============================================================

import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getSession } from '$lib/server/session';

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password'];

export const load: LayoutServerLoad = async (event) => {
  const isPublic = PUBLIC_PATHS.some((path) => event.url.pathname.startsWith(path));

  if (isPublic) return { user: null };

  const session = await getSession(event);

  if (!session) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(302, '/login');
  }

  return { user: session.user };
};
