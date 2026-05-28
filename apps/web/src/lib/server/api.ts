// ============================================================
// @breeyard/web — server-side API client
// Env: INTERNAL_API_URL (falls back to localhost:3400 in dev)
// ============================================================

import type { NavItem, Block, ApiSuccess } from '@breeyard/shared';

const apiBase = (): string => {
  const url = process.env.INTERNAL_API_URL;
  if (!url) throw new Error('INTERNAL_API_URL is not set');
  return url;
};

const get = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${apiBase()}${path}`);
  if (!res.ok) throw new Error(`API ${path} returned ${String(res.status)}`);
  const body = (await res.json()) as ApiSuccess<T>;
  return body.data;
};

export const fetchNav = (): Promise<NavItem[]> => get<NavItem[]>('/v1/nav');

export const fetchBlocks = (page: string): Promise<Block[]> =>
  get<Block[]>(`/v1/blocks?page=${encodeURIComponent(page)}`);
