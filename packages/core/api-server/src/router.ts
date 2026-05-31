// =============================================================================
// Root tRPC router — compose all sub-routers here
// =============================================================================

import { router } from './trpc.js';
import { navRouter } from './routers/nav.js';
import { blocksRouter } from './routers/blocks.js';
import { configRouter } from './routers/config.js';
import { dashboardRouter } from './routers/dashboard.js';
import { clientsRouter } from './routers/clients.js';
import { projectsRouter } from './routers/projects.js';
import { portalRouter } from './routers/portal.js';

export const appRouter = router({
  nav: navRouter,
  blocks: blocksRouter,
  config: configRouter,
  dashboard: dashboardRouter,
  clients: clientsRouter,
  projects: projectsRouter,
  portal: portalRouter,
});

export type AppRouter = typeof appRouter;
