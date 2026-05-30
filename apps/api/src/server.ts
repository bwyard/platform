// ============================================================
// @breeyard/api — Fastify server factory
// ============================================================

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { env } from './env.js';
import { errorHandler } from './plugins/error-handler.js';
import { authRoutes } from './routes/auth.js';
import { healthRoutes } from './routes/health.js';
import { navRoutes } from './routes/v1/nav.js';
import { blocksRoutes } from './routes/v1/blocks.js';
import { configRoutes } from './routes/v1/config.js';
import { clientsRoutes } from './routes/v1/clients.js';
import { projectsRoutes } from './routes/v1/projects.js';
import { portalRoutes } from './routes/v1/portal.js';

export const buildServer = async () => {
  const server = Fastify({
    logger: env.NODE_ENV === 'development' ? { level: 'info' } : { level: 'warn' },
  });

  // ---- Plugins ----
  await server.register(helmet);
  await server.register(cors, {
    origin: env.CORS_ORIGINS.length > 0 ? env.CORS_ORIGINS : false,
    credentials: true,
  });
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // ---- Error handler ----
  errorHandler(server);

  // ---- Not found — return empty 404, no body ----
  server.setNotFoundHandler((_req, reply) => {
    reply.code(404).send();
  });

  // ---- Routes ----
  await server.register(healthRoutes, { prefix: '/health' });
  await server.register(authRoutes, { prefix: '/auth' });
  await server.register(navRoutes, { prefix: '/v1/nav' });
  await server.register(blocksRoutes, { prefix: '/v1/blocks' });
  await server.register(configRoutes, { prefix: '/v1/config' });
  await server.register(clientsRoutes, { prefix: '/v1/clients' });
  await server.register(projectsRoutes, { prefix: '/v1/projects' });
  await server.register(portalRoutes, { prefix: '/v1/portal' });

  return server;
};
