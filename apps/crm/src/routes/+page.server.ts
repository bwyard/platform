import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw redirect(302, '/clients');
};
