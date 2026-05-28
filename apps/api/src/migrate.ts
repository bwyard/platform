// ============================================================
// @breeyard/api — run Drizzle migrations at container startup
// ============================================================

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is required for migrations');

console.warn('[migrate] running…');

const client = postgres(url, { max: 1 });
const db = drizzle(client);

await migrate(db, { migrationsFolder: './migrations' });

await client.end();

console.warn('[migrate] done');
