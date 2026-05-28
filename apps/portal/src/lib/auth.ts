// ============================================================
// @breeyard/portal — auth client
// Points to the Fastify API, not the portal app itself.
// ============================================================

import { PUBLIC_API_URL } from '$env/static/public';
import { createAuthClient } from 'better-auth/svelte';

const apiBase: string =
  typeof window !== 'undefined'
    ? PUBLIC_API_URL || 'http://localhost:3400'
    : 'http://localhost:3400';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authClient: ReturnType<typeof createAuthClient<any>> = createAuthClient({
  baseURL: apiBase,
});

export const { signIn, signOut, useSession } = authClient;
