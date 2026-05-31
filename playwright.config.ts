import { defineConfig, devices } from '@playwright/test';

// =============================================================================
// Playwright E2E config — bwyard/platform
//
// Strategy: E2E covers critical user journeys only.
// Don't duplicate integration-level assertions here.
//
// Auth pattern:
//   'setup' logs in once → saves to e2e/.auth/admin.json
//   Authed test projects depend on 'setup' and reuse that state.
//
// Ports (non-conflicting with artist-platform which uses 3001-3004, 4000):
//   api=3010  web=3011  cms=3012  crm=3013  portal=3014  portfolio=3015
// =============================================================================

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // 2 workers everywhere — matches CI (2 vCPUs) and keeps dev servers stable.
  // More workers causes context-setup timeouts on auth guard tests.
  workers: 2,
  reporter: process.env.CI ? 'github' : 'html',

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // 1a. Admin login — CRM + CMS
    {
      name: 'setup',
      testMatch: /admin\.setup\.ts/,
    },
    // 1b. Portal client login
    {
      name: 'portal-setup',
      testMatch: /portal\.setup\.ts/,
    },
    // 2. CMS — authed
    {
      name: 'cms-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/admin.json',
      },
      dependencies: ['setup'],
      testMatch: /cms\.spec\.ts/,
    },
    // 3. CRM — authed
    {
      name: 'crm-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/admin.json',
      },
      dependencies: ['setup'],
      testMatch: /crm\.spec\.ts/,
    },
    // 4. Web — public
    {
      name: 'web-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /web\.spec\.ts/,
    },
    {
      name: 'web-mobile',
      use: { ...devices['iPhone 14'] },
      testMatch: /web\.spec\.ts/,
    },
    // 5. Portal — public + authed flows (client auth)
    {
      name: 'portal-chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/portal-client.json',
      },
      dependencies: ['portal-setup'],
      testMatch: /portal\.spec\.ts/,
    },
    // 6. Portfolio — public
    {
      name: 'portfolio-chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /portfolio\.spec\.ts/,
    },
  ],

  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? []
    : [
        {
          name: 'api',
          command: 'pnpm --filter @breeyard/api dev',
          url: 'http://localhost:3010/health',
          reuseExistingServer: true,
          timeout: 60_000,
        },
        {
          name: 'web',
          command: 'pnpm --filter @breeyard/web dev',
          url: 'http://localhost:3011',
          reuseExistingServer: true,
          timeout: 60_000,
        },
        {
          name: 'cms',
          command: 'pnpm --filter @breeyard/cms dev',
          url: 'http://localhost:3012/login',
          reuseExistingServer: true,
          timeout: 60_000,
        },
        {
          name: 'crm',
          command: 'pnpm --filter @breeyard/crm dev',
          url: 'http://localhost:3013/login',
          reuseExistingServer: true,
          timeout: 60_000,
        },
        {
          name: 'portal',
          command: 'pnpm --filter @breeyard/portal dev',
          url: 'http://localhost:3014/login',
          reuseExistingServer: true,
          timeout: 60_000,
        },
        {
          name: 'portfolio',
          command: 'pnpm --filter @breeyard/portfolio dev',
          url: 'http://localhost:3015',
          reuseExistingServer: true,
          timeout: 60_000,
        },
      ],
});
