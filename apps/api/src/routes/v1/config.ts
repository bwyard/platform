// ============================================================
// Config routes — GET /v1/config (public platform config)
// ============================================================

import type { FastifyInstance } from 'fastify';
import { getPlatformConfig } from '@breeyard/config';
import { apiSuccess } from '@breeyard/shared';

// Keys safe to expose publicly (no secrets)
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

// eslint-disable-next-line @typescript-eslint/require-await
export const configRoutes = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async (_request, reply) => {
    const config = await getPlatformConfig();
    const publicConfig = Object.fromEntries(
      Object.entries(config).filter(([key]) => PUBLIC_KEYS.has(key)),
    );
    return reply.send(apiSuccess(publicConfig));
  });
};
