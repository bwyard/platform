// =============================================================================
// tRPC context — created per request from a SvelteKit RequestEvent
// =============================================================================

import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { getAuth } from '@breeyard/auth';
import { getDatabase } from '@breeyard/database';
import type { DatabaseClient } from '@breeyard/database';

export interface Context {
  readonly db: DatabaseClient;
  readonly userId: string | null;
}

// Used by fetchRequestHandler (tRPC HTTP route)
export const createContext = async (opts: FetchCreateContextFnOptions): Promise<Context> =>
  createContextFromRequest(opts.req);

// Used by createCaller (direct server-side procedure calls — no HTTP round trip)
export const createContextFromRequest = async (request: Request): Promise<Context> => {
  const db = getDatabase();
  const session = await getAuth()
    .api.getSession({ headers: request.headers })
    .catch(() => null);
  return {
    db,
    userId: session?.user.id ?? null,
  };
};
