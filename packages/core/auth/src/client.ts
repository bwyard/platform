// ============================================================
// @breeyard/auth/client — browser-side better-auth client
// ============================================================

import { createAuthClient } from 'better-auth/svelte';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const authClient: ReturnType<typeof createAuthClient<any>> = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : '',
});

export const { signIn, signOut, signUp, useSession } = authClient;
