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
    // @fastify/cors stores CORS headers in Fastify's internal reply map via reply.header().
    // The node handler writes directly to reply.raw and never calls reply.send(), so those
    // headers would never reach the wire. Flush them to reply.raw now so they survive
    // better-auth's writeHead call (Node.js merges setHeader() with writeHead() headers).
    for (const [key, value] of Object.entries(reply.getHeaders())) {
      if (value !== undefined) {
        reply.raw.setHeader(key, value);
      }
    }
    void handler(_request.raw, reply.raw);
  });
};
