// ============================================================
// Health check route
// ============================================================

import type { FastifyInstance } from 'fastify';

// eslint-disable-next-line @typescript-eslint/require-await
export const healthRoutes = async (fastify: FastifyInstance) => {
  // eslint-disable-next-line @typescript-eslint/require-await
  fastify.get('/', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }));
};
