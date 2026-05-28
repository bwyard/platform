// ============================================================
// CRM API client — internal fetch to @breeyard/api
// All server-side data access goes through here, not the DB.
// ============================================================

import type { ApiResponse } from '@breeyard/shared';

const API_URL = process.env.INTERNAL_API_URL;

export const apiFetch = async <T>(
  path: string,
  options: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> } = {},
): Promise<T> => {
  const { headers = {}, ...rest } = options;

  if (!API_URL) throw new Error('INTERNAL_API_URL is not set');
  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  const json = (await response.json()) as ApiResponse<T>;

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
};
