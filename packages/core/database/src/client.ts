// ============================================================
// Database client — singleton postgres + drizzle instance
// ============================================================

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

const createDatabaseClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const queryClient = postgres(connectionString);
  return drizzle(queryClient, { schema });
};

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;

let client: DatabaseClient | undefined;

export const getDatabase = (): DatabaseClient => {
  client ??= createDatabaseClient();
  return client;
};

export { schema };
