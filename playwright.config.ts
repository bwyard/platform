import { defineConfig, devices } from '@playwright/test';

// =============================================================================
// Playwright E2E config — bwyard/platform
//
// Architecture: see e2e/ARCHITECTURE.md
//
// Projects are scoped by auth context, not by app.
// Each project's testMatch covers all tier dirs (smokes/core/features) for that app.
// Flows get their own project — no storageState, tests create their own contexts.
//
// Ports (non-conflicting with artist-platform which uses 3001-3004, 4000):
//   web=3011  cms=3012  crm=3013  portal=3014  portfolio=3015
// =============================================================================

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // 2 workers — matches CI (2 vCPUs) and keeps dev servers stable.
  workers: 2,
  reporter: process.env.CI ? 'github' : 'html',

  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    // 1. Setup — runs first, creates auth state files for all users in USERS registry
    {
      name: 'setup',
      testMatch: /setup\/auth\.setup\.ts/,
    },

    // 2. CRM — admin auth, covers all crm tiers
    {
      name: 'crm',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/admin-1.json',
      },
      dependencies: ['setup'],
      testMatch: [
        'e2e/smokes/crm/**/*.spec.ts',
        'e2e/core/crm/**/*.spec.ts',
        'e2e/features/crm/**/*.spec.ts',
      ],
    },

    // 3. CMS — admin auth, covers all cms tiers
    {
      name: 'cms',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/admin-1.json',
      },
      dependencies: ['setup'],
      testMatch: [
        'e2e/smokes/cms/**/*.spec.ts',
        'e2e/core/cms/**/*.spec.ts',
        'e2e/features/cms/**/*.spec.ts',
      ],
    },

    // 4. Portal — client auth, covers all portal tiers
    {
      name: 'portal',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/client-1.json',
      },
      dependencies: ['setup'],
      testMatch: [
        'e2e/smokes/portal/**/*.spec.ts',
        'e2e/core/portal/**/*.spec.ts',
        'e2e/features/portal/**/*.spec.ts',
      ],
    },

    // 5. Web — public, desktop + mobile smokes
    {
      name: 'web',
      use: { ...devices['Desktop Chrome'] },
      testMatch: [
        'e2e/smokes/web/**/*.spec.ts',
        'e2e/core/web/**/*.spec.ts',
        'e2e/features/web/**/*.spec.ts',
      ],
    },
    {
      name: 'web-mobile',
      use: { ...devices['iPhone 14'] },
      testMatch: ['e2e/smokes/web/**/*.spec.ts'],
    },

    // 6. Portfolio — public
    {
      name: 'portfolio',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['e2e/smokes/portfolio/**/*.spec.ts', 'e2e/core/portfolio/**/*.spec.ts'],
    },

    // 7. Flows — cross-app journeys, no storageState
    // Tests create their own browser contexts per user alias
    {
      name: 'flows',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
      testMatch: ['e2e/flows/**/*.spec.ts'],
    },
  ],

  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? []
    : [
        {
          name: 'web',
          command: 'pnpm --filter @breeyard/web dev',
          url: 'http://localhost:3011',
          env: { BETTER_AUTH_URL: 'http://localhost:3011' },
          reuseExistingServer: true,
          timeout: 60_000,
        },
        {
          name: 'cms',
          command: 'pnpm --filter @breeyard/cms dev',
          url: 'http://localhost:3012/login',
          env: { BETTER_AUTH_URL: 'http://localhost:3012' },
          reuseExistingServer: true,
          timeout: 60_000,
        },
        {
          name: 'crm',
          command: 'pnpm --filter @breeyard/crm dev',
          url: 'http://localhost:3013/login',
          env: { BETTER_AUTH_URL: 'http://localhost:3013' },
          reuseExistingServer: true,
          timeout: 60_000,
        },
        {
          name: 'portal',
          command: 'pnpm --filter @breeyard/portal dev',
          url: 'http://localhost:3014/login',
          env: { BETTER_AUTH_URL: 'http://localhost:3014' },
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
