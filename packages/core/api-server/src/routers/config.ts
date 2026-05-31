// =============================================================================
// config router — GET /v1/config equivalent
// Public platform config — no secrets exposed
// =============================================================================

import { router, publicProcedure } from '../trpc.js';
import { getPlatformConfig } from '@breeyard/config';

const PUBLIC_KEYS = new Set([
  'site.name',
  'site.description',
  'site.url',
  'site.logo',
  'site.favicon',
  'site.locale',
  'site.timezone',
  'contact.email',
  'social.twitter',
  'social.linkedin',
  'social.github',
  'theme.primary',
  'theme.accent',
]);

export const configRouter = router({
  get: publicProcedure.query(async () => {
    const config = await getPlatformConfig();
    return Object.fromEntries(Object.entries(config).filter(([key]) => PUBLIC_KEYS.has(key)));
  }),
});
