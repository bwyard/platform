// ============================================================
// Seed script — idempotent dev/staging data fixture
// Run: tsx --env-file=../../.env src/seed.ts
// ============================================================

import { getDatabase } from './client.js';
import { navItems, platformConfig, blocks, clients, projects } from './schema/index.js';

// ── helpers ─────────────────────────────────────────────────

const db = getDatabase();

// ── nav items ───────────────────────────────────────────────

const seedNavItems = async (): Promise<void> => {
  console.warn('[seed] nav items…');

  const rows = [
    {
      id: 'nav-home',
      label: 'Home',
      href: '/',
      order: 0,
      target: '_self' as const,
      visible: true,
      parentId: null,
    },
    {
      id: 'nav-services',
      label: 'Services',
      href: '/services',
      order: 1,
      target: '_self' as const,
      visible: true,
      parentId: null,
    },
    {
      id: 'nav-work',
      label: 'Work',
      href: '/work',
      order: 2,
      target: '_self' as const,
      visible: true,
      parentId: null,
    },
    {
      id: 'nav-contact',
      label: 'Contact',
      href: '/contact',
      order: 3,
      target: '_self' as const,
      visible: true,
      parentId: null,
    },
  ];

  await db.insert(navItems).values(rows).onConflictDoNothing();

  console.warn(`[seed] nav items done (${rows.length.toString()} rows)`);
};

// ── platform config ─────────────────────────────────────────

const seedPlatformConfig = async (): Promise<void> => {
  console.warn('[seed] platform config…');

  const rows = [
    { key: 'siteName', value: '8 of Wands' },
    { key: 'siteTagline', value: 'Fractional CTO · Software Engineer' },
    { key: 'contactEmail', value: 'hello@8ofwands.com' },
  ];

  await db.insert(platformConfig).values(rows).onConflictDoNothing();

  console.warn(`[seed] platform config done (${rows.length.toString()} rows)`);
};

// ── blocks ──────────────────────────────────────────────────

const seedBlocks = async (): Promise<void> => {
  console.warn('[seed] blocks…');

  const rows = [
    {
      id: 'block-home-hero',
      type: 'hero',
      order: 0,
      visible: true,
      pageSlug: 'home',
      data: {
        title: 'Fractional CTO Services',
        subtitle: 'Strategy, architecture, and execution for growing teams.',
      },
    },
    {
      id: 'block-home-services',
      type: 'services',
      order: 1,
      visible: true,
      pageSlug: 'home',
      data: {},
    },
  ];

  await db.insert(blocks).values(rows).onConflictDoNothing();

  console.warn(`[seed] blocks done (${rows.length.toString()} rows)`);
};

// ── clients + projects ───────────────────────────────────────

const seedClientsAndProjects = async (): Promise<void> => {
  console.warn('[seed] clients…');

  const clientRows = [
    {
      id: 'client-example',
      name: 'Example Client',
      email: 'client@example.com',
      company: 'Example Co.',
      techLevel: 'medium' as const,
      status: 'prospect' as const,
      notes: 'Seeded dev fixture — safe to delete.',
      userId: null,
    },
  ];

  await db.insert(clients).values(clientRows).onConflictDoNothing();

  console.warn('[seed] projects…');

  const projectRows = [
    {
      id: 'project-example',
      clientId: 'client-example',
      name: 'Example Project',
      slug: 'example-project',
      description: 'Seeded dev fixture — safe to delete.',
      status: 'discovery' as const,
      hoursPerMonth: null,
      rateInCents: null,
      startedAt: null,
      completedAt: null,
    },
  ];

  await db.insert(projects).values(projectRows).onConflictDoNothing();

  console.warn('[seed] clients + projects done');
};

// ── main ─────────────────────────────────────────────────────

const main = async (): Promise<void> => {
  console.warn('[seed] starting…');

  await seedNavItems();
  await seedPlatformConfig();
  await seedBlocks();
  await seedClientsAndProjects();

  console.warn('[seed] complete');
};

main().catch((err: unknown) => {
  console.error('[seed] fatal error', err);
  process.exit(1);
});

process.exit(0);
