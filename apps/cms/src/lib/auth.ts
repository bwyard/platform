// ============================================================
// @breeyard/admin — auth client
// Points to the Fastify API, not the admin app itself.
// Env: PUBLIC_API_URL (falls back to localhost:3010 in dev)
// ============================================================

import { createAuthClient } from 'better-auth/svelte';

// import.meta.env values are untyped in Vite unless $env/static/public is used

const apiBase: string =
  typeof window !== 'undefined'
    ? ((import.meta.env.PUBLIC_API_URL as string | undefined) ?? 'http://localhost:3010')
    : 'http://localhost:3010';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authClient: ReturnType<typeof createAuthClient<any>> = createAuthClient({
  baseURL: apiBase,
});

export const { signIn, signOut, useSession } = authClient;
