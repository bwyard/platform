// ============================================================
// Blocks schema — block registry, pure typed records
// ============================================================

import { pgTable, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const blocks = pgTable('blocks', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  order: integer('order').notNull().default(0),
  visible: boolean('visible').notNull().default(true),
  data: jsonb('data').notNull().default({}),
  pageSlug: text('page_slug').notNull().default('home'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
