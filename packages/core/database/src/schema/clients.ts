// ============================================================
// Clients schema — CRM: clients, projects, messages
// ============================================================

import { pgTable, text, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const clients = pgTable('clients', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  company: text('company'),
  phone: text('phone'),
  techLevel: text('tech_level', { enum: ['low', 'medium', 'high'] })
    .notNull()
    .default('medium'),
  status: text('status', { enum: ['active', 'inactive', 'prospect', 'churned'] })
    .notNull()
    .default('prospect'),
  notes: text('notes'),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  clientId: text('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  status: text('status', {
    enum: ['discovery', 'active', 'paused', 'completed', 'cancelled'],
  })
    .notNull()
    .default('discovery'),
  hoursPerMonth: integer('hours_per_month'),
  rateInCents: integer('rate_in_cents'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  clientId: text('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  projectId: text('project_id').references(() => projects.id, { onDelete: 'set null' }),
  fromClient: boolean('from_client').notNull().default(false),
  body: text('body').notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
