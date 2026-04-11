// ============================================================
// Media schema — S3-compatible object storage references
// ============================================================

import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const media = pgTable('media', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  url: text('url').notNull(),
  type: text('type', { enum: ['image', 'video', 'document', 'audio', 'other'] })
    .notNull()
    .default('other'),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  altText: text('alt_text'),
  uploadedBy: text('uploaded_by').references(() => users.id, { onDelete: 'set null' }),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
});
