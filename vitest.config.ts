import { defineConfig } from 'vitest/config';

// =============================================================================
// Root Vitest config — node environment for packages and apps/api.
// SvelteKit apps (web, cms, crm, portal, portfolio) use per-app vitest.config.ts
// with happy-dom + svelte plugin for component tests.
//
// Testing Trophy (Kent C. Dodds / Fowler):
//   Static (TS, ESLint) → Unit (pure fns) → Integration (routes, actions) → E2E (Playwright)
//   Integration is the high-value tier — test like a user, not an implementation.
// =============================================================================

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'packages/**/src/**/*.test.{ts,js}',
      'apps/api/src/**/*.test.{ts,js}',
      'scripts/**/*.test.{ts,js}',
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.svelte-kit/**'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['packages/*/src/**/*.{ts,js}', 'apps/api/src/**/*.{ts,js}'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.svelte-kit/**',
        '**/*.test.{ts,js}',
        '**/*.d.ts',
        '**/index.ts',
        // Schema — pure Drizzle declarations, no runtime logic
        'packages/core/database/src/schema/**',
        // DB client — requires live connection, covered by integration tests
        'packages/core/database/src/client.ts',
        // Seed — run-once script
        'packages/core/database/src/seed.ts',
        // Type-only files
        'packages/core/shared/src/types/**',
        // Theme tokens — CSS variable definitions only
        'packages/core/theme/**',
        // Stub packages not yet implemented
        'packages/cms/pwa/**',
        // Queue requires live DB — no unit-testable pure logic
        'packages/infra/queue/**',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
