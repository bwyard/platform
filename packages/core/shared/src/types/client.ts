// ============================================================
// Client + Project types — string unions only, no enum
// ============================================================

export type ClientStatus = 'prospect' | 'active' | 'inactive' | 'churned';

export type ClientTechLevel = 'low' | 'medium' | 'high';

export type ProjectStatus = 'discovery' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  techLevel: ClientTechLevel;
  status: ClientStatus;
  notes: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  hoursPerMonth: number | null;
  rateInCents: number | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  techLevel?: ClientTechLevel;
  notes?: string;
}

export interface CreateProjectInput {
  name: string;
  slug: string;
  description?: string;
  hoursPerMonth?: number;
  rateInCents?: number;
}
