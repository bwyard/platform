// ============================================================
// Auth routes — delegate all auth handling to better-auth
// ============================================================

import type { FastifyInstance } from 'fastify';
import { getAuth } from '@breeyard/auth';
import { toNodeHandler } from 'better-auth/node';

export const authRoutes = (fastify: FastifyInstance): void => {
  const auth = getAuth();
  const handler = toNodeHandler(auth);

  // Disable Fastify body parsing for auth routes — better-auth reads the raw stream
  fastify.addContentTypeParser('application/json', (_request, payload, done) => {
    done(null, payload);
  });

  fastify.all('/*', (_request, reply) => {
    void handler(_request.raw, reply.raw);
  });
};
