// ============================================================
// Session helper — extract better-auth session from a Fastify request
// ============================================================

import { getAuth } from '@breeyard/auth';
import type { FastifyRequest } from 'fastify';

const toHeaders = (raw: FastifyRequest['headers']): Headers =>
  Object.entries(raw).reduce((acc, [key, value]) => {
    if (value !== undefined) acc.set(key, Array.isArray(value) ? value.join(', ') : value);
    return acc;
  }, new Headers());

export const getRequestSession = (request: FastifyRequest) =>
  getAuth().api.getSession({ headers: toHeaders(request.headers) });
