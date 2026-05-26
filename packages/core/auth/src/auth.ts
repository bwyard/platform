// ============================================================
// @breeyard/auth — better-auth server instance
// ============================================================

import { betterAuth } from 'better-auth/minimal';
import type { Auth as BetterAuthInstance } from 'better-auth/types';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDatabase, schema } from '@breeyard/database';

export type Auth = BetterAuthInstance;

export const createAuth = (): Auth =>
  betterAuth({
    basePath: '/auth',
    database: drizzleAdapter(getDatabase(), {
      provider: 'pg',
      schema: {
        user: schema.users,
        session: schema.sessions,
        account: schema.accounts,
        verification: schema.verifications,
      },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'client',
          input: false,
        },
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
    advanced: {
      cookiePrefix: 'breeyard',
      generateId: () => crypto.randomUUID(),
    },
    trustedOrigins: (process.env.TRUSTED_ORIGINS ?? '').split(',').filter(Boolean),
  }) as unknown as Auth;

let authInstance: Auth | undefined;

export const getAuth = (): Auth => {
  authInstance ??= createAuth();
  return authInstance;
};
