// ============================================================
// @breeyard/api — Fastify entry point
// ============================================================

import { buildServer } from './server.js';
import { env } from './env.js';

const start = async () => {
  const server = await buildServer();
  await server.listen({ host: env.HOST, port: env.PORT });
};

start().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
