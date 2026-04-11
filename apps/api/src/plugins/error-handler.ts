// ============================================================
// Global error handler plugin
// ============================================================

import type { FastifyInstance } from 'fastify';
import { isAppError } from '@breeyard/errors';
import { apiError } from '@breeyard/shared';

export const errorHandler = (fastify: FastifyInstance): void => {
  fastify.setErrorHandler((error, _request, reply) => {
    if (isAppError(error)) {
      return reply
        .status(error.statusCode)
        .send(apiError(error.code, error.message, error.details));
    }

    fastify.log.error({ err: error }, 'Unhandled error');
    return reply.status(500).send(apiError('INTERNAL_ERROR', 'An unexpected error occurred'));
  });
};
