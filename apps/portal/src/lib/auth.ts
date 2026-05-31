// ============================================================
// @breeyard/portal — auth client
// Auth is served by this app at /api/auth — same origin.
// ============================================================

import { createAuthClient } from 'better-auth/svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authClient: ReturnType<typeof createAuthClient<any>> = createAuthClient({
  baseURL: '',
  basePath: '/api/auth',
  fetchOptions: { credentials: 'include' },
});

export const { signIn, signOut, useSession } = authClient;
