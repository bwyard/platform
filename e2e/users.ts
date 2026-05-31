import type { AppKey } from './config';

interface UserConfig {
  alias: UserAlias;
  role: 'admin' | 'client';
  appKey: AppKey;
}

export const USERS = {
  'admin-1': { alias: 'admin-1' as const, role: 'admin' as const, appKey: 'crm' as const },
  'client-1': { alias: 'client-1' as const, role: 'client' as const, appKey: 'portal' as const },
  'client-2': { alias: 'client-2' as const, role: 'client' as const, appKey: 'portal' as const },
} as const satisfies Record<string, UserConfig>;

export type UserAlias = keyof typeof USERS;

export const getUser = (alias: UserAlias) => {
  const key = alias.toUpperCase().replace(/-/g, '_');
  return {
    ...USERS[alias],
    email: process.env[`E2E_${key}_EMAIL`] ?? '',
    password: process.env[`E2E_${key}_PASSWORD`] ?? '',
  };
};

export const usersByRole = (role: UserConfig['role']) =>
  Object.values(USERS).filter((u) => u.role === role);
