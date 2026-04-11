// ============================================================
// Environment validation — fail fast on missing required vars
// ============================================================

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '3010', 10),
  HOST: process.env.HOST ?? '0.0.0.0',
  DATABASE_URL: requireEnv('DATABASE_URL'),
  BETTER_AUTH_SECRET: requireEnv('BETTER_AUTH_SECRET'),
  BETTER_AUTH_URL: requireEnv('BETTER_AUTH_URL'),
  CORS_ORIGINS: (process.env.CORS_ORIGINS ?? '').split(',').filter(Boolean),
  TRUSTED_ORIGINS: (process.env.TRUSTED_ORIGINS ?? '').split(',').filter(Boolean),
} as const;
