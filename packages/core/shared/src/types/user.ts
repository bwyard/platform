// ============================================================
// User types — string unions only, no enum
// ============================================================

export type UserRole = 'admin' | 'client';

export type UserStatus = 'active' | 'suspended' | 'pending' | 'deleted';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
