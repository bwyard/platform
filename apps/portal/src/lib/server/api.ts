// ============================================================
// Portal server-side tRPC caller
// Direct procedure calls — no HTTP round trip for SSR
// ============================================================

import { appRouter, createContextFromRequest } from '@breeyard/api-server';

export const createCaller = async (request: Request) => {
  const ctx = await createContextFromRequest(request);
  return appRouter.createCaller(ctx);
};
