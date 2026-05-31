// ============================================================
// @breeyard/crm — auth client
// Auth handled by this app's own SvelteKit handler via @breeyard/api-server.
// baseURL omitted — better-auth client defaults to current origin.
// ============================================================

import { createAuthClient } from 'better-auth/svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authClient: ReturnType<typeof createAuthClient<any>> = createAuthClient({
  basePath: '/auth',
  fetchOptions: { credentials: 'include' },
});

export const { signIn, signOut, useSession } = authClient;
