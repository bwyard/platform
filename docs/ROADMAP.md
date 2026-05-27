# Roadmap — bwyard/platform

**Last updated:** 2026-05-27
**Status:** active development — s001+

---

## Current State

### Infrastructure

| Item                                                                   | Status                                   |
| ---------------------------------------------------------------------- | ---------------------------------------- |
| CI/CD (GitHub Actions — CI on PR, deploy on main)                      | ✅ live                                  |
| Docker Compose — all 6 containers                                      | ✅ deployed (devops fixing build issues) |
| Database schema + migrations                                           | ✅                                       |
| better-auth (session cookies, 30-day sessions)                         | ✅                                       |
| Monorepo build (tsconfig, svelte.config.js aligned to artist-platform) | ✅                                       |

### Apps

| App         | Domain              | Status                                                               |
| ----------- | ------------------- | -------------------------------------------------------------------- |
| `api`       | api.8ofwands.com    | ✅ auth, clients CRUD, portal routes, blocks/nav/config              |
| `web`       | 8ofwands.com        | ✅ nav, home, services, work, contact, client login button           |
| `crm`       | crm.8ofwands.com    | ✅ clients list/detail/new, projects — no messages, invoices stubbed |
| `portal`    | portal.8ofwands.com | ✅ login, dashboard, projects, messages (session-scoped auth)        |
| `cms`       | cms.8ofwands.com    | 🟡 routes scaffolded — DB wiring unverified                          |
| `portfolio` | breeyard.com        | ✅ home, work, about, contact                                        |

### Packages

| Package                   | Status                                                                   |
| ------------------------- | ------------------------------------------------------------------------ |
| `@breeyard/auth`          | ✅ fully implemented                                                     |
| `@breeyard/database`      | ✅ users, clients, projects, messages, blocks, nav, media, config        |
| `@breeyard/mail`          | ✅ fully implemented — sendWelcome, sendPasswordReset, sendProjectUpdate |
| `@breeyard/shared`        | ✅ types + API response helpers                                          |
| `@breeyard/billing`       | stub                                                                     |
| `@breeyard/notifications` | stub                                                                     |
| everything else           | stub                                                                     |

---

## Phase 1 — Client Loop (current focus)

The core client relationship loop: Bree onboards a client → client accesses portal → Bree and client communicate → Bree manages work.

### P1-A: Client invite flow

**Why:** Right now a client can only be linked to a portal account by manually inserting a `userId` into the DB. This is the biggest operational blocker — no real client can be onboarded without it.

**What to build:**

- `POST /v1/clients/:id/invite` — creates a better-auth user for the client's email, links `userId` to the client record, sends a welcome email via `@breeyard/mail.sendWelcome`
- CRM: "Send Invite" button on client detail page (only shown if `userId` is null)
- Portal: landing state when no client record found (graceful "account pending" message)
- Env vars needed: `PORTAL_URL` (server-side, for the invite link in the email)

**Dependencies:** `@breeyard/mail` ✅ already implemented

---

### P1-B: CRM message thread

**Why:** Portal clients can send messages. Bree has no way to read or reply in the CRM. The loop is half-open.

**What to build:**

- `GET /v1/clients/:id/messages` — list message thread for a client
- `POST /v1/clients/:id/messages` — Bree sends a reply (fromClient: false)
- CRM page: `apps/crm/src/routes/clients/[id]/messages/` — thread view + reply form
- CRM client detail: unread message count badge + link to thread

**Dependencies:** messages table ✅ already in schema

---

### P1-C: Email notifications on new message

**Why:** Neither Bree nor the client knows when the other sends a message unless they log in to check. `@breeyard/mail` is already fully implemented — this is just wiring.

**What to build:**

- When client sends a message via portal → email Bree (Bree's admin email from env)
- When Bree replies via CRM → email the client (`sendProjectUpdate` or a new `sendMessage` template)
- Both via `@breeyard/mail.send` directly — no queue needed at this scale

**Dependencies:** P1-B (CRM reply route), `@breeyard/mail` ✅

---

## Phase 2 — Billing Basics

No invoices table exists yet. Invoices are visible in the architecture but fully unbuilt.

### P2-A: Invoices schema + API

- Add `invoices` table: `clientId`, `projectId`, `amountInCents`, `status` (draft/sent/paid/void), `dueAt`, `paidAt`, `description`, `lineItems (json)`
- `GET /v1/clients/:id/invoices` — list invoices for a client
- `POST /v1/clients/:id/invoices` — create invoice (CRM)
- `PATCH /v1/invoices/:id` — update status (mark paid, void, etc.)

### P2-B: CRM invoices page

- Replace the current stub with a real list + create form
- Client detail: invoice summary (total owed, last invoice status)

### P2-C: Portal invoice view

- `GET /v1/portal/invoices` — invoices for the logged-in client
- Portal route: `apps/portal/src/routes/invoices/` — read-only list with status badges

---

## Phase 3 — CMS End-to-End

CMS routes are scaffolded but the DB wiring is unverified. Web content is static/placeholder.

### P3-A: Smoke test CMS → web pipeline

- Verify CMS can create/edit a block and it renders on web
- Verify nav edits propagate to web
- Identify and fix any broken wiring

### P3-B: CMS auth guard

- Verify CMS login/auth guard is enforced (currently has login page, unclear if guard is applied globally)

---

## Phase 4 — Hardening

Once the client loop is closed and billing basics exist.

- `PUBLIC_PORTAL_URL` set in web deployment env (so Client Login button links to actual portal)
- Rate limiting on API auth routes (via `@breeyard/rate-limit` stub → implement)
- Audit log on key actions (invite sent, message sent, invoice created) via `@breeyard/audit`
- E2E tests for: invite flow, portal login, message send/receive, invoice view
- CRM auth guard — verify admin-only access is enforced end-to-end

---

## Deferred

- **Stripe billing** (`@breeyard/billing`) — payment processing, invoice payment links. After P2 is stable.
- **Client site generator** — extract this repo as a template, scaffold new client deployments. Requires both bwyard and artist-platform to be live and stable first.
- **`@breeyard/roles`** — role-based access beyond admin/client split. Not needed until multi-admin.
- **`@breeyard/i18n`**, **`@breeyard/gdpr`**, **`@breeyard/search`** — post-generator, per-client feature flags.

---

## Build Order Summary

```
P1-A  Client invite flow      ← unlocks real onboarding
P1-B  CRM message thread      ← closes the comms loop
P1-C  Email notifications     ← makes P1-B useful async
P2-A  Invoices schema + API   ← data foundation
P2-B  CRM invoices page       ← Bree can bill
P2-C  Portal invoice view     ← client can see what they owe
P3-A  CMS smoke test          ← verify content pipeline works
P3-B  CMS auth guard          ← lock down internal tools
P4    Hardening               ← rate limiting, audit, e2e, env vars
```
