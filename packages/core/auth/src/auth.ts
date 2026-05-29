// ============================================================
// @breeyard/auth — better-auth server instance
// ============================================================

import { betterAuth } from 'better-auth/minimal';
import type { Auth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { getDatabase, schema } from '@breeyard/database';
import { getMailClient } from '@breeyard/mail';

export const createAuth = (): Auth =>
  // better-auth's inferred generic type references internal modules that tsc
  // cannot name in .d.ts files. Cast through unknown to the public Auth type.

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
      sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
        await getMailClient().sendPasswordReset(user.email, { resetUrl: url });
      },
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
      // In production, COOKIE_DOMAIN=.8ofwands.com shares the session cookie across
      // all subdomains (api, crm, portal). Not needed locally — localhost ports share
      // cookies without this.
      ...(process.env.COOKIE_DOMAIN
        ? { crossSubDomainCookies: { enabled: true, domain: process.env.COOKIE_DOMAIN } }
        : {}),
    },
    trustedOrigins: (process.env.TRUSTED_ORIGINS ?? '').split(',').filter(Boolean),
  }) as unknown as Auth;

let authInstance: Auth | undefined;

export const getAuth = (): Auth => {
  authInstance ??= createAuth();
  return authInstance;
};
