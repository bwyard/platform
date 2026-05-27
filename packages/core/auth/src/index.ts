// ============================================================
// @breeyard/auth — server exports
// ============================================================

export { getAuth, createAuth } from './auth.js';
export type { Auth } from 'better-auth';

// Typed user shape including additional fields defined in createAuth.
// Use this type anywhere session.user is accessed.
export interface AppUser {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null;
  role?: string | null;
}

// Typed session shape. Cast the return of auth.api.getSession() to this.
export interface AppSession {
  user: AppUser;
  session: {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
}
