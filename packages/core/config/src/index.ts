// ============================================================
// @breeyard/config — platform config loader
// Reads from platform_config DB table with env override support
// ============================================================

import { getDatabase } from '@breeyard/database';
import { platformConfig } from '@breeyard/database';

// ---- Types ----

export type PlatformConfigKey =
  | 'site.name'
  | 'site.description'
  | 'site.url'
  | 'site.logo'
  | 'site.favicon'
  | 'site.locale'
  | 'site.timezone'
  | 'contact.email'
  | 'contact.phone'
  | 'social.twitter'
  | 'social.linkedin'
  | 'social.github'
  | 'theme.primary'
  | 'theme.accent';

export type PlatformConfigMap = Partial<Record<PlatformConfigKey, string>>;

// ---- Cache ----

let _cache: PlatformConfigMap | null = null;
let _cacheAt = 0;
const CACHE_TTL_MS = 60_000; // 1 minute

// ---- Loader ----

export const getPlatformConfig = async (bust = false): Promise<PlatformConfigMap> => {
  const now = Date.now();

  if (_cache && !bust && now - _cacheAt < CACHE_TTL_MS) {
    return _cache;
  }

  const db = getDatabase();
  const rows = await db.select().from(platformConfig);

  const result: PlatformConfigMap = {};
  for (const row of rows) {
    result[row.key as PlatformConfigKey] = row.value;
  }

  _cache = result;
  _cacheAt = now;
  return result;
};

export const getConfigValue = async (key: PlatformConfigKey): Promise<string | undefined> => {
  const config = await getPlatformConfig();
  return config[key];
};

export const setConfigValue = async (key: PlatformConfigKey, value: string): Promise<void> => {
  const db = getDatabase();
  await db
    .insert(platformConfig)
    .values({ key, value })
    .onConflictDoUpdate({ target: platformConfig.key, set: { value, updatedAt: new Date() } });
  _cache = null; // bust cache on write
};

export const _bustConfigCache = (): void => {
  _cache = null;
};
