// ============================================================
// Seed script — idempotent dev/staging data fixture
// Run: tsx --env-file=../../.env src/seed.ts
// ============================================================

import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { getDatabase } from './client.js';
import {
  users,
  accounts,
  navItems,
  platformConfig,
  blocks,
  clients,
  projects,
} from './schema/index.js';

// ── helpers ─────────────────────────────────────────────────

const db = getDatabase();
const randomId = () => crypto.randomUUID();

// ── users ────────────────────────────────────────────────────

const seedUsers = async (): Promise<{ adminId: string; clientUserId: string }> => {
  console.warn('[seed] users…');

  const SEED_USERS = [
    {
      email: process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com',
      name: process.env.SEED_ADMIN_NAME ?? 'Admin',
      password: process.env.SEED_ADMIN_PASSWORD ?? 'test',
      role: 'admin' as const,
      fixedId: 'user-admin',
    },
    {
      email: 'client@example.com',
      name: 'Test Client',
      password: 'test',
      role: 'client' as const,
      fixedId: 'user-client',
    },
  ];

  const ids: Record<string, string> = {};

  for (const u of SEED_USERS) {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, u.email))
      .limit(1);

    if (existing.length > 0 && existing[0]) {
      console.warn(`[seed]   skip  ${u.email} — already exists`);
      ids[u.fixedId] = existing[0].id;
      continue;
    }

    const passwordHash = await hash(u.password, 12);

    await db.insert(users).values({
      id: u.fixedId,
      email: u.email,
      name: u.name,
      role: u.role,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(accounts).values({
      id: randomId(),
      userId: u.fixedId,
      accountId: u.email,
      providerId: 'credential',
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    ids[u.fixedId] = u.fixedId;
    console.warn(`[seed]   created ${u.email} (role=${u.role})`);
  }

  return {
    adminId: ids['user-admin'] ?? 'user-admin',
    clientUserId: ids['user-client'] ?? 'user-client',
  };
};

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

const seedClientsAndProjects = async (clientUserId: string): Promise<void> => {
  console.warn('[seed] clients…');

  const clientRows = [
    {
      id: 'client-example',
      name: 'Example Client',
      email: 'client@example.com',
      company: 'Example Co.',
      techLevel: 'medium' as const,
      status: 'active' as const,
      notes: 'Seeded dev fixture — safe to delete.',
      userId: clientUserId,
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

  const { clientUserId } = await seedUsers();
  await seedNavItems();
  await seedPlatformConfig();
  await seedBlocks();
  await seedClientsAndProjects(clientUserId);

  console.warn('[seed] complete');
  console.warn('  admin login:  admin@example.com / test');
  console.warn('  client login: client@example.com / test');
};

main().catch((err: unknown) => {
  console.error('[seed] fatal error', err);
  process.exit(1);
});

process.exit(0);
