import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getSession } from '$lib/server/session';

export const load: PageServerLoad = async (event) => {
  const session = await getSession(event);
  if (session) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect(302, '/dashboard');
  }
  return {};
};
