// ============================================================
// tRPC catch-all handler
// ============================================================

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter, createContext } from '@breeyard/api-server';
import type { RequestHandler } from './$types';

const handler: RequestHandler = (event) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: event.request,
    router: appRouter,
    createContext,
  });

export const GET = handler;
export const POST = handler;
