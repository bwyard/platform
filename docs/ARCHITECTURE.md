# Architecture — bwyard/platform

**Sub-type:** platform (8 of Wands CTO practice + Bree Yard portfolio)
**Status:** active development — s001+

---

## Stack

| Layer                 | Technology                                   | Version      |
| --------------------- | -------------------------------------------- | ------------ |
| Runtime               | Node.js                                      | 22           |
| Package manager       | pnpm workspaces                              | 10           |
| Task runner           | Nx                                           | ^22.6.4      |
| Frontend              | SvelteKit 5 + Svelte 5 runes                 | latest       |
| API                   | Fastify                                      | 5            |
| ORM                   | Drizzle                                      | ^0.43        |
| Database              | PostgreSQL                                   | 17           |
| Auth                  | better-auth                                  | ^1.6         |
| Validation            | Zod                                          | ^3           |
| Styling               | Tailwind                                     | v4           |
| Payments              | Stripe (via @breeyard/billing)               | ^17          |
| Storage               | MinIO (via @breeyard/storage)                | —            |
| Queue                 | pg-boss (via @breeyard/queue)                | —            |
| Logging               | Pino (via @breeyard/logging)                 | —            |
| Email (transactional) | Nodemailer + Stalwart relay                  | —            |
| Email (marketing)     | Brevo (via @breeyard/marketing)              | —            |
| Testing               | Vitest (unit/integration) + Playwright (e2e) | 3.x / latest |

---

## Apps

| App       | Package             | Port (local) | Port (server) | Domain              |
| --------- | ------------------- | ------------ | ------------- | ------------------- |
| api       | @breeyard/api       | 3010         | 3400          | api.8ofwands.com    |
| web       | @breeyard/web       | 3011         | 3411          | 8ofwands.com        |
| cms       | @breeyard/cms       | 3012         | 3412          | cms.8ofwands.com    |
| crm       | @breeyard/crm       | 3013         | 3413          | crm.8ofwands.com    |
| portal    | @breeyard/portal    | 3014         | 3414          | portal.8ofwands.com |
| portfolio | @breeyard/portfolio | 3015         | 3415          | breeyard.com        |

**Port isolation:** local 3010–3015 do not conflict with artist-platform (3001–3004, 4000).
**Note:** 3401 is occupied by bulwark-webmail on dev-01. Bwyard frontends use 3411–3415.

---

## App Roles

- **api** — Fastify bridge. All SvelteKit apps call this. Auth, blocks, nav, config, CRM endpoints.
- **web** — Public 8ofwands.com site. Pricing, contact, demos, CTO services.
- **cms** — Internal content management. Blocks, pages, nav, media, templates, gallery.
- **crm** — Client management. Clients, projects, invoices, messages.
- **portal** — Client-facing login. Project status, messages, invoices.
- **portfolio** — breeyard.com. Bree Yard personal portfolio + work showcase.

---

## Package Groups

```
packages/
  core/         — always included, every deployment
    auth        database    mail        shared
    config      crypto      seo         storage
    hooks       test-utils  theme       ui
    validation

  infra/         — always included, every deployment
    cache        errors      health      logging
    metrics      queue       rate-limit  consent

  ops/           — always included
    audit        analytics

  client-portal/ — portal sub-type
    kv           messaging   notifications  session

  cms/           — cms sub-type
    pwa

  billing/       — payment processing (Stripe default)

  extended/      — feature-gated, enabled per deployment
    flags        gdpr        i18n        maintenance
    payments→    roles       search
    (payments renamed to billing — see /billing)

  marketing/     — bulk/campaign email (Brevo default)
    (to be scaffolded)
```

---

## Key Decisions

- **Single API** — one Fastify instance serves all 5 frontend apps. No per-app APIs.
- **better-auth** — shared via `@breeyard/auth`, `basePath: '/auth'`, same instance across all apps.
- **kit.alias** — `@breeyard/*` path resolution in SvelteKit apps uses `kit.alias` not tsconfig paths. This avoids SvelteKit auto-generated tsconfig conflicts.
- **Drizzle** — schema-first, migrations in `packages/core/database/migrations/`. Run `db:migrate` before first boot.
- **EU-only hosting** — all infrastructure on Hetzner Helsinki. No US data residency.
- **Template extraction** — this repo is customer zero. When stable, a generator will scaffold new client deployments from this pattern. Both bwyard and artist-platform must be live before extraction begins.

---

## Deploy Target

**Server:** dev-01 — Hetzner CPX31, Ubuntu 24.04, Helsinki (EU), 204.168.153.140
**Process:** Docker Compose behind Caddy reverse proxy
**CI:** GitHub Actions → SSH deploy to dev-01

See devops runbook at `claude-resources/sessions/devops/` for full server config.
