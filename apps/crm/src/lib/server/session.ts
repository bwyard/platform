// ============================================================
// CRM — server-side session helper
// Uses better-auth directly against the DB (shared @breeyard/auth)
// ============================================================

import { getAuth } from '@breeyard/auth';
import type { AppSession } from '@breeyard/auth';
import type { RequestEvent } from '@sveltejs/kit';

export const getSession = async (event: RequestEvent): Promise<AppSession | null> => {
  const auth = getAuth();
  return auth.api.getSession({ headers: event.request.headers }) as Promise<AppSession | null>;
};
