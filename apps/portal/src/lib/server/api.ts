// ============================================================
// Portal API client — internal fetch to @breeyard/api
// All server-side data access goes through here, not the DB.
// ============================================================

import type { ApiResponse } from '@breeyard/shared';

const API_URL = process.env.PRIVATE_API_URL ?? 'http://localhost:3400';

export const apiFetch = async <T>(
  path: string,
  options: Omit<RequestInit, 'headers'> & {
    headers?: Record<string, string>;
    cookie?: string;
  } = {},
): Promise<T> => {
  const { headers = {}, cookie, ...rest } = options;

  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(cookie ? { Cookie: cookie } : {}),
      ...headers,
    },
  });

  const json = (await response.json()) as ApiResponse<T>;

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
};
