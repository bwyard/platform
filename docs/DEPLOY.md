# bwyard/platform — Deploy Playbook

Everything a session needs to know to build, deploy, and debug any app in this monorepo.

---

## How deploy works

Push to `main` triggers `.github/workflows/deploy.yml`:

1. SSH to dev-01
2. `git pull origin main`
3. `docker compose build --no-cache api web cms crm portal portfolio`
4. Start postgres + redis, run migrations
5. Rolling restart (api first, then frontends)
6. Health check `localhost:3400/health` — auto-rollback on failure

---

## CI jobs (`.github/workflows/ci.yml`)

Runs on every PR to `main` and every push to `dev`.

| Job                   | Commands                                                                                | Must pass before |
| --------------------- | --------------------------------------------------------------------------------------- | ---------------- |
| **Typecheck + Lint**  | Build packages → `pnpm -r --if-present run typecheck` → `pnpm -r --if-present run lint` | —                |
| **Build**             | `pnpm --filter './packages/**' run build` → `pnpm --filter './apps/**' run build`       | check            |
| **Docker Build (×6)** | `docker build -f apps/<app>/Dockerfile .` for each app                                  | check            |

**Rule:** packages must be built before typecheck because workspace deps need `dist/` to resolve types. NX handled this automatically; without NX, the build step must come first.

---

## SvelteKit apps — `svelte.config.js` kit.alias

**Every** workspace package imported (directly or transitively) by the app must have a `kit.alias` entry. Vite resolves aliased packages to their TypeScript source and bundles them inline — no pre-built `dist/` needed at Docker build time.

Missing an alias → `ERR_MODULE_NOT_FOUND` during `docker build`, not during local dev.

### Current alias map (all SvelteKit apps: web, cms, crm, portal)

```js
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** @param {string} rel */
const pkg = (rel) => path.resolve(__dirname, `../../packages/${rel}/src/index.ts`);

kit: {
  alias: {
    $lib: './src/lib',
    '$lib/*': './src/lib/*',
    '@breeyard/database': pkg('core/database'),  // transitive dep of auth
    '@breeyard/mail':     pkg('core/mail'),       // transitive dep of auth
    '@breeyard/shared':   pkg('core/shared'),
    '@breeyard/auth':     pkg('core/auth'),
    '@breeyard/theme':    pkg('core/theme'),
    '@breeyard/ui':       pkg('core/ui'),
    // add any new workspace package the app imports here
  }
}
```

**Portfolio** does not use auth so it omits `database` and `mail`.

**Web and CMS** also alias `@breeyard/seo` and (CMS only) `@breeyard/audit`, `@breeyard/analytics`.

### Rule for adding a new workspace package

When you add a new `@breeyard/*` import anywhere in a SvelteKit app's source (or in a package that app already aliases):

1. Add its alias to that app's `svelte.config.js`
2. Check if it has its own `@breeyard/*` imports — add those too
3. Run `pnpm install` if you changed any `package.json`
4. Commit `pnpm-lock.yaml` in the same commit as the `package.json` change

---

## API app — Dockerfile build order

The Fastify API uses tsc (not Vite/SvelteKit). No `kit.alias` — workspace packages must have `dist/` compiled before `tsc` runs.

```dockerfile
# Build all workspace packages first
RUN pnpm --filter './packages/**' build

# Then build the API (tsc resolves @breeyard/* from their dist/)
RUN pnpm --filter @breeyard/api build
```

---

## Mail — `@breeyard/mail` env vars

`getMailClient()` reads these from env at runtime:

| Var                 | Production value              | Notes                                 |
| ------------------- | ----------------------------- | ------------------------------------- |
| `SMTP_HOST`         | `smtp.resend.com`             | Resend SMTP relay                     |
| `SMTP_PORT`         | `587`                         | STARTTLS                              |
| `SMTP_SECURE`       | `false`                       |                                       |
| `SMTP_USER`         | `resend`                      | literal string                        |
| `SMTP_PASS`         | Resend API key                | `re_...` from infra `.env` on mail-01 |
| `MAIL_FROM`         | `onboarding@8ofwands.com`     | must be a verified Resend sender      |
| `PUBLIC_PORTAL_URL` | `https://portal.8ofwands.com` | used in email links                   |

**Why Resend:** Hetzner blocks port 25 on new servers. Resend is pre-wired — `resend._domainkey.8ofwands.com` DKIM record is live in Cloudflare. Tested 2026-05-27.

**Stalwart (mail-01, 62.238.15.230):** handles inbound only. All `@8ofwands.com` addresses (bree, admin, billing, hello, support, onboarding) route to bree's mailbox. Admin UI: `https://mail.8ofwands.com`.

---

## Lockfile rule

**Never push a `package.json` change without committing the updated `pnpm-lock.yaml`.**

CI runs `pnpm install --frozen-lockfile`. If the lockfile is stale, CI fails immediately on install.

```bash
# After any package.json change:
pnpm install      # updates pnpm-lock.yaml
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
```

---

## TypeScript — workspace package type resolution

`tsconfig.base.json` has **no `paths` block**. Workspace packages are resolved through `node_modules` (installed via pnpm workspaces), not via path aliases.

Consequences:

- Local typecheck works because pnpm links `packages/*/dist/` into `node_modules/@breeyard/*`
- CI typecheck needs packages built first (`pnpm --filter './packages/**' run build`) before running `tsc --noEmit`
- SvelteKit apps use `kit.alias` instead of `paths` so Vite can bundle source directly

---

## better-auth typing — `AppUser` / `AppSession`

`better-auth`'s `Auth<BetterAuthOptions>` base type drops `additionalFields` (including `role`). Use the typed wrappers from `@breeyard/auth`:

```ts
import type { AppSession } from '@breeyard/auth';

export const getSession = async (event: RequestEvent): Promise<AppSession | null> => {
  const auth = getAuth();
  return auth.api.getSession({ headers: event.request.headers }) as Promise<AppSession | null>;
};
```

`AppSession.user` includes `role?: string | null`. Use `AppSession` everywhere `session.user.role` is accessed.

---

## Adding a new SvelteKit app

Checklist:

- [ ] Copy `svelte.config.js` from an existing app (web or portal as template)
- [ ] Add `kit.alias` entries for every `@breeyard/*` the app will import (direct + transitive)
- [ ] Copy `Dockerfile` from an existing SvelteKit app
- [ ] Add the app to the Docker Build matrix in `.github/workflows/ci.yml`
- [ ] Add the app to `$COMPOSE build` and rolling restart loop in `.github/workflows/deploy.yml`
- [ ] Add the app to `docker-compose.prod.yml`
- [ ] Run `pnpm install` and commit the lockfile

## Adding a new workspace package

Checklist:

- [ ] Create `packages/<scope>/<name>/` with `src/index.ts`, `package.json`, `tsconfig.json`
- [ ] `tsconfig.json` should extend `../../tsconfig.base.json` (no custom `paths`)
- [ ] Add `"build": "tsc"` script
- [ ] Run `pnpm install` and commit the lockfile
- [ ] Add `kit.alias` entry to every SvelteKit app that will import it
- [ ] If it has `@breeyard/*` imports of its own, alias those too in every consuming app
