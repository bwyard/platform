// ============================================================
// Seed script — idempotent dev/staging data fixture
// Run: tsx --env-file=../../.env src/seed.ts
// ============================================================

import { promisify } from 'node:util';
import { scrypt, randomBytes } from 'node:crypto';
import { eq } from 'drizzle-orm';

const scryptAsync = promisify(scrypt);

const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString('hex');
  const key = (await scryptAsync(password.normalize('NFKC'), salt, 64, {
    N: 16384,
    r: 16,
    p: 1,
    maxmem: 128 * 16384 * 16 * 2,
  })) as Buffer;
  return `${salt}:${key.toString('hex')}`;
};
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

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('[seed] SEED_ADMIN_PASSWORD is required — refusing to seed with no password');
  }

  const SEED_USERS = [
    {
      email: process.env.SEED_ADMIN_EMAIL ?? 'bree@8ofwands.com',
      name: process.env.SEED_ADMIN_NAME ?? 'Bree',
      password: adminPassword,
      role: 'admin' as const,
      fixedId: 'user-admin',
    },
    {
      email: process.env.SEED_CLIENT_EMAIL ?? 'client@example.com',
      name: 'Test Client',
      password: process.env.SEED_CLIENT_PASSWORD ?? 'changeme',
      role: 'client' as const,
      fixedId: 'user-client',
    },
  ];

  const ids: Record<string, string> = {};

  for (const u of SEED_USERS) {
    const passwordHash = await hashPassword(u.password);

    // Upsert user row — update email/name/updatedAt if fixedId already exists
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, u.fixedId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(users)
        .set({ email: u.email, name: u.name, updatedAt: new Date() })
        .where(eq(users.id, u.fixedId));
      console.warn(`[seed]   updated ${u.email} (role=${u.role})`);
    } else {
      await db.insert(users).values({
        id: u.fixedId,
        email: u.email,
        name: u.name,
        role: u.role,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.warn(`[seed]   created ${u.email} (role=${u.role})`);
    }

    // Upsert credential account — always refresh the password hash
    const existingAccount = await db
      .select({ id: accounts.id })
      .from(accounts)
      .where(eq(accounts.userId, u.fixedId))
      .limit(1);

    if (existingAccount.length > 0 && existingAccount[0]) {
      await db
        .update(accounts)
        .set({ accountId: u.email, password: passwordHash, updatedAt: new Date() })
        .where(eq(accounts.id, existingAccount[0].id));
    } else {
      await db.insert(accounts).values({
        id: randomId(),
        userId: u.fixedId,
        accountId: u.email,
        providerId: 'credential',
        password: passwordHash,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    ids[u.fixedId] = u.fixedId;
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
  console.warn(
    `  admin login:  ${process.env.SEED_ADMIN_EMAIL ?? 'bree@8ofwands.com'} / (SEED_ADMIN_PASSWORD)`,
  );
  console.warn(
    `  client login: ${process.env.SEED_CLIENT_EMAIL ?? 'client@example.com'} / (SEED_CLIENT_PASSWORD or 'changeme')`,
  );
};

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error('[seed] fatal error', err);
    process.exit(1);
  });
