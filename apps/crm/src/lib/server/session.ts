import { getAuth } from '@breeyard/auth';
import type { RequestEvent } from '@sveltejs/kit';

export const getSession = async (event: RequestEvent) => {
  const auth = getAuth();
  return auth.api.getSession({ headers: event.request.headers });
};
