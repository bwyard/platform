// ============================================================
// Nav schema — data-driven navigation (NavItem as DB record)
// ============================================================

import { pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const navItems = pgTable('nav_items', {
  id: text('id').primaryKey(),
  label: text('label').notNull(),
  href: text('href').notNull(),
  order: integer('order').notNull().default(0),
  target: text('target', { enum: ['_self', '_blank'] })
    .notNull()
    .default('_self'),
  visible: boolean('visible').notNull().default(true),
  parentId: text('parent_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
