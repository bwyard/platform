import { defineConfig, devices } from '@playwright/test';

// =============================================================================
// Playwright weekly config — triple-browser + mobile sweep.
// Runs every Monday via .github/workflows/weekly.yml.
// Uses the same webServer setup and auth pattern as playwright.config.ts.
// =============================================================================

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 1,
  workers: 2,
  reporter: [['github'], ['html', { open: 'never' }]],

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // Auth setup — runs once, shared across all browser projects
    { name: 'setup', testMatch: /admin\.setup\.ts/ },
    { name: 'portal-setup', testMatch: /portal\.setup\.ts/ },

    // ── Chromium ─────────────────────────────────────────────────────────────
    {
      name: 'chromium-admin',
      use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/admin.json' },
      dependencies: ['setup'],
      testMatch: /(cms|crm)\.spec\.ts/,
    },
    {
      name: 'chromium-portal',
      use: { ...devices['Desktop Chrome'], storageState: 'e2e/.auth/portal-client.json' },
      dependencies: ['portal-setup'],
      testMatch: /portal\.spec\.ts/,
    },
    {
      name: 'chromium-public',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /(web|portfolio)\.spec\.ts/,
    },

    // ── Firefox ──────────────────────────────────────────────────────────────
    {
      name: 'firefox-admin',
      use: { ...devices['Desktop Firefox'], storageState: 'e2e/.auth/admin.json' },
      dependencies: ['setup'],
      testMatch: /(cms|crm)\.spec\.ts/,
    },
    {
      name: 'firefox-portal',
      use: { ...devices['Desktop Firefox'], storageState: 'e2e/.auth/portal-client.json' },
      dependencies: ['portal-setup'],
      testMatch: /portal\.spec\.ts/,
    },
    {
      name: 'firefox-public',
      use: { ...devices['Desktop Firefox'] },
      testMatch: /(web|portfolio)\.spec\.ts/,
    },

    // ── WebKit ────────────────────────────────────────────────────────────────
    {
      name: 'webkit-admin',
      use: { ...devices['Desktop Safari'], storageState: 'e2e/.auth/admin.json' },
      dependencies: ['setup'],
      testMatch: /(cms|crm)\.spec\.ts/,
    },
    {
      name: 'webkit-portal',
      use: { ...devices['Desktop Safari'], storageState: 'e2e/.auth/portal-client.json' },
      dependencies: ['portal-setup'],
      testMatch: /portal\.spec\.ts/,
    },
    {
      name: 'webkit-public',
      use: { ...devices['Desktop Safari'] },
      testMatch: /(web|portfolio)\.spec\.ts/,
    },

    // ── Mobile (Chromium / iPhone 14) — public + portal only ─────────────────
    {
      name: 'mobile',
      use: { ...devices['iPhone 14'], storageState: 'e2e/.auth/portal-client.json' },
      dependencies: ['portal-setup'],
      testMatch: /(web|portal|portfolio)\.spec\.ts/,
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
