// =============================================================================
// @breeyard/queue — job queue via pg-boss (Postgres-backed, no Redis)
// =============================================================================

import PgBoss from 'pg-boss';

let boss: PgBoss | undefined;

export const getQueue = (): PgBoss => {
  if (!boss) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL is required for @breeyard/queue');
    boss = new PgBoss(connectionString);
  }
  return boss;
};

export const startQueue = async (): Promise<PgBoss> => {
  const queue = getQueue();
  await queue.start();
  return queue;
};

export type { PgBoss };
