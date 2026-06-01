# E2E Architecture — bwyard/platform

## Principles

1. Tests read like business logic, not command chains — use `test.step()` for grouping
2. POMs are functional factory functions, not classes
3. User identity is alias-based — callers never touch raw credentials
4. Setup is data-driven — one file maps over a user registry
5. Auth has two modes (API + UI) in one file, same alias-only API for both
6. Selectors live in exactly one place (the POM) — helpers import POMs, not inline selectors
7. Flows are never excluded from CI — own project, self-manage multi-context auth

---

## Directory structure

```
e2e/
  ARCHITECTURE.md       <- this file

  users.ts              <- USERS registry, getUser(), UserAlias type
  config.ts             <- URL registry, AppKey type

  helpers/
    auth.ts             <- signInAs (API) + loginAs (UI)
    nav.ts              <- goto(page, appKey, path)

  fixtures/
    index.ts            <- authedPage, unauthedPage, urls

  setup/
    auth.setup.ts       <- ONE file: maps Object.values(USERS) -> setup tests

  poms/
    shared/
      login.page.ts     <- sharedLoginPage — canonical selector source for /login UI
    crm/
      index.ts          <- crmApp(page, baseUrl?) factory, groups all crm POMs
      dashboard.page.ts
      clients.page.ts
      messages.page.ts
      client-edit.page.ts
      project-detail.page.ts
    portal/
      index.ts          <- portalApp(page, baseUrl?) factory
      dashboard.page.ts
      forgot-password.page.ts
      project-detail.page.ts
      reset-password.page.ts
    web/
      index.ts          <- webApp(page, baseUrl?) factory
      home.page.ts
    cms/
      index.ts          <- cmsApp(page, baseUrl?) factory
      dashboard.page.ts
    portfolio/
      index.ts          <- portfolioApp(page, baseUrl?) factory
      home.page.ts

  smokes/               <- quick "is it up" — minimal per-app sanity
    crm/
    portal/
    web/
    cms/
    portfolio/
    shared/             <- cross-app sanity (tRPC health, auth roundtrip)

  core/                 <- critical paths that must pass for the business
    crm/
    portal/
    cms/

  features/             <- feature-by-feature depth coverage
    crm/
    portal/

  flows/                <- cross-app journeys spanning 2+ apps
```

---

## User system (users.ts)

User identities are aliases. Credentials are never hardcoded — always resolved from env at call time.

**Alias to env var mapping:**

- `admin-1` -> E2E_ADMIN_1_EMAIL / E2E_ADMIN_1_PASSWORD
- `client-1` -> E2E_CLIENT_1_EMAIL / E2E_CLIENT_1_PASSWORD
- `client-2` -> E2E_CLIENT_2_EMAIL / E2E_CLIENT_2_PASSWORD

```ts
type UserConfig = { alias: UserAlias; role: 'admin' | 'client'; appKey: AppKey };

export const USERS = {
  'admin-1': { alias: 'admin-1', role: 'admin', appKey: 'crm' },
  'client-1': { alias: 'client-1', role: 'client', appKey: 'portal' },
  'client-2': { alias: 'client-2', role: 'client', appKey: 'portal' },
} as const satisfies Record<string, UserConfig>;

export type UserAlias = keyof typeof USERS;

export const getUser = (alias: UserAlias) => {
  const key = alias.toUpperCase().replace(/-/g, '_');
  return {
    ...USERS[alias],
    email: process.env[`E2E_${key}_EMAIL`] ?? '',
    password: process.env[`E2E_${key}_PASSWORD`] ?? '',
  };
};

export const usersByRole = (role: UserConfig['role']) =>
  Object.values(USERS).filter((u) => u.role === role);
```

**Adding a user:** add one entry to USERS. The setup file, auth helpers, and auth state generation all follow automatically.

---

## Auth helpers (helpers/auth.ts)

Two modes, same alias-only API. Neither exposes raw credentials to callers.

```ts
// Fast path — API POST, used in setup to create storageState
signInAs(request: APIRequestContext, alias: UserAlias, appKey?: AppKey): Promise<void>

// UI path — navigates /login, fills form, waits for redirect
// Used when testing the login flow or switching users mid-test
loginAs(page: Page, alias: UserAlias, appKey?: AppKey): Promise<void>
```

- `appKey` is optional — defaults to the user's home app from USERS
- `loginAs` imports `sharedLoginPage` for selectors — they live in one place only
- Both resolve credentials internally via `getUser(alias)`

---

## Setup (setup/auth.setup.ts)

One file. Data-driven. No repetition.

```ts
const setupAuthFor = ({ alias }: UserConfig) =>
  setup(`${alias} — save auth state`, async ({ page }) => {
    await mkdir('e2e/.auth', { recursive: true });
    await signInAs(page.request, alias);
    await page.waitForURL((url) => !url.pathname.includes('/login'));
    await page.context().storageState({ path: `e2e/.auth/${alias}.json` });
  });

Object.values(USERS).forEach(setupAuthFor);
```

Auth state files: `e2e/.auth/admin-1.json`, `e2e/.auth/client-1.json`, etc.

**Adding a user:** only edit USERS in users.ts. Setup, auth state files, and config references all follow.

---

## POM pattern

### Naming

Every POM export is prefixed with its app name. No exceptions.

| App       | Prefix    | Example                        |
| --------- | --------- | ------------------------------ |
| crm       | Crm       | crmClientsPage, CrmClientsPage |
| portal    | Portal    | portalForgotPasswordPage       |
| web       | Web       | webHomePage                    |
| cms       | Cms       | cmsDashboardPage               |
| portfolio | Portfolio | portfolioHomePage              |
| shared    | Shared    | sharedLoginPage                |

Never use unprefixed names (LoginPage, ClientsPage) — they collide across apps in imports and test output.

### Construction-time baseUrl

baseUrl is passed at construction, not per method. Methods are URL-free:

```ts
// poms/crm/clients.page.ts
export const crmClientsPage = (page: Page, baseUrl: string) => ({
  goto: (): Promise<void> => page.goto(`${baseUrl}/clients`).then(() => undefined),
  search: (q: string): Promise<void> => page.getByTestId('client-search').fill(q),
  rows: (): Locator => page.getByTestId('client-row'),
  table: (): Locator => page.getByTestId('clients-table'),
  filterBy: (status: string): Locator => page.getByTestId(`filter-${status}`),
});

export type CrmClientsPage = ReturnType<typeof crmClientsPage>;
```

### App factory (poms/app/index.ts)

Each app folder exports a factory that groups all its POMs. Tests import one thing:

```ts
// poms/crm/index.ts
export const crmApp = (page: Page, baseUrl = config.urls.crm) => ({
  dashboard: crmDashboardPage(page, baseUrl),
  clients: crmClientsPage(page, baseUrl),
  messages: crmMessagesPage(page, baseUrl),
  clientEdit: crmClientEditPage(page, baseUrl),
  projectDetail: crmProjectDetailPage(page, baseUrl),
});
```

baseUrl override is available for integration tests, staging, or custom environments.

### Two POM setup types

**Single-app** — test imports from one app factory. Used in smokes/core/features:

```ts
const app = crmApp(page);
```

**Multi-app** — test imports from 2+ app factories. Used in flows only:

```ts
const admin = crmApp(adminPage);
const client = portalApp(clientPage);
```

---

## Test readability

Use `test.step()` to group operations at the business logic level. Tests should read like a user story.

### Single-app (smokes/core/features)

```ts
import { test, expect } from '../../fixtures';
import { crmApp } from '../../poms/crm';

test('admin manages client list', async ({ page }) => {
  const app = crmApp(page);

  await test.step('load clients', async () => {
    await app.clients.goto();
    await expect(app.clients.table()).toBeVisible();
  });

  await test.step('search filters results', async () => {
    await app.clients.search('example');
    await expect(app.clients.rows().first()).toBeVisible();
  });
});
```

### Cross-app (flows)

```ts
import { crmApp } from '../../poms/crm';
import { portalApp } from '../../poms/portal';

test('admin creates project — client sees it', async ({ browser }) => {
  const adminCtx = await browser.newContext({ storageState: 'e2e/.auth/admin-1.json' });
  const clientCtx = await browser.newContext({ storageState: 'e2e/.auth/client-1.json' });
  const admin = crmApp(await adminCtx.newPage());
  const client = portalApp(await clientCtx.newPage());

  await test.step('admin navigates to clients', () => admin.clients.goto());
  await test.step('client checks their projects', () => client.projects.goto());
});
```

---

## Playwright projects (playwright.config.ts)

Projects are scoped by auth context. Each project's testMatch covers all tier dirs for that app.

```ts
{ name: 'setup',      testMatch: '**/setup/auth.setup.ts' },

{ name: 'crm',        testMatch: ['e2e/smokes/crm/**', 'e2e/core/crm/**', 'e2e/features/crm/**'],
  use: { storageState: 'e2e/.auth/admin-1.json',  ...devices['Desktop Chrome'] },
  dependencies: ['setup'] },

{ name: 'cms',        testMatch: ['e2e/smokes/cms/**', 'e2e/core/cms/**', 'e2e/features/cms/**'],
  use: { storageState: 'e2e/.auth/admin-1.json',  ...devices['Desktop Chrome'] },
  dependencies: ['setup'] },

{ name: 'portal',     testMatch: ['e2e/smokes/portal/**', 'e2e/core/portal/**', 'e2e/features/portal/**'],
  use: { storageState: 'e2e/.auth/client-1.json', ...devices['Desktop Chrome'] },
  dependencies: ['setup'] },

{ name: 'web',        testMatch: ['e2e/smokes/web/**', 'e2e/core/web/**', 'e2e/features/web/**'],
  use: { ...devices['Desktop Chrome'] } },

{ name: 'web-mobile', testMatch: ['e2e/smokes/web/**'],
  use: { ...devices['iPhone 14'] } },

{ name: 'portfolio',  testMatch: ['e2e/smokes/portfolio/**', 'e2e/core/portfolio/**'],
  use: { ...devices['Desktop Chrome'] } },

// Flows: no storageState — tests create their own contexts per alias
{ name: 'flows',      testMatch: ['e2e/flows/**/*.spec.ts'],
  use: { ...devices['Desktop Chrome'] },
  dependencies: ['setup'] },
```

BETTER_AUTH_URL is per-app via webServer[n].env — not a global CI env var.

---

## CI env (ci.yml)

**Removed from E2E job:**

- BETTER_AUTH_URL — now per-app via webServer.env in playwright.config.ts
- PUBLIC_API_URL — apps/api deleted
- INTERNAL_API_URL — apps/api deleted

**Kept:**

- BETTER_AUTH_SECRET — shared signing secret
- BETTER_AUTH_TRUSTED_ORIGINS — all app URLs, same value across apps
- DATABASE_URL, TRUSTED_ORIGINS, CORS_ORIGINS
- E2E_ADMIN_1_EMAIL / E2E_ADMIN_1_PASSWORD (from GitHub secrets)
- E2E_CLIENT_1_EMAIL / E2E_CLIENT_1_PASSWORD

---

## Adding new coverage

### New smoke test

Create `e2e/smokes/<app>/<name>.smokes.spec.ts`. Picked up automatically by the app project.

### New user

Add one entry to USERS in `e2e/users.ts`. Add matching secrets to CI and local .env. Everything else follows.

### New flow

Create `e2e/flows/<name>.spec.ts`. The flows project picks it up automatically.

### New app (future)

1. Add URL to `config.ts` (new AppKey)
2. Add user(s) to USERS with the new appKey
3. Create `poms/<app>/index.ts` + individual page files
4. Add tier dirs: `smokes/<app>/`, `core/<app>/`, `features/<app>/`
5. Add a new project to `playwright.config.ts`
6. Add webServer entry with its own BETTER_AUTH_URL env
