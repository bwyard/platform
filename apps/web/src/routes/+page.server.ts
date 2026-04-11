// ============================================================
// Home page server load — fetches blocks for the home page
// ============================================================

import type { PageServerLoad } from './$types';
import { fetchBlocks } from '$lib/server/api';

export const load: PageServerLoad = async () => {
  const blocks = await fetchBlocks('home').catch(() => []);
  return { blocks };
};
