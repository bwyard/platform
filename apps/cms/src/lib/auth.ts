// ============================================================
// @breeyard/admin — auth client
// Points to the Fastify API, not the admin app itself.
// Env: PUBLIC_API_URL (falls back to localhost:3400 in dev)
// ============================================================

import { PUBLIC_API_URL } from '$env/static/public';
import { createAuthClient } from 'better-auth/svelte';

const apiBase: string =
  typeof window !== 'undefined' ? PUBLIC_API_URL : (process.env.INTERNAL_API_URL ?? '');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authClient: ReturnType<typeof createAuthClient<any>> = createAuthClient({
  baseURL: apiBase,
  basePath: '/auth',
});

export const { signIn, signOut, useSession } = authClient;
