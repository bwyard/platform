import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

// tseslint.config is flagged as deprecated in favour of ESLint's defineConfig(),
// but defineConfig() is not yet available as an ESM named export in eslint@10.2.0.
// Remove this disable and migrate when eslint is upgraded.
// eslint-disable-next-line @typescript-eslint/no-deprecated
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierConfig,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            '*.config.js',
            '*.config.ts',
            'apps/web/svelte.config.js',
            'apps/cms/svelte.config.js',
            'apps/crm/svelte.config.js',
            'apps/portal/svelte.config.js',
            'apps/portfolio/svelte.config.js',
            // apps/admin kept until directory is manually deleted
            'apps/admin/svelte.config.js',
            'packages/core/database/drizzle.config.ts',
            'playwright.config.weekly.ts',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  // Root config files (vitest, playwright) use tool types not hoisted to root —
  // type-unsafe rules produce false positives here.
  {
    files: ['vitest.config.ts', 'playwright.config.ts', 'playwright.config.weekly.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
  // Test files — workspace deps (test-utils, etc.) may not have dist built locally,
  // causing unsafe-* false positives. Relax type-safety rules for test files only.
  {
    files: ['**/*.test.ts', '**/*.spec.ts', 'e2e/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
    },
  },
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.svelte-kit/**',
      '**/.turbo/**',
      '**/.nx/**',
      '**/coverage/**',
      'scripts/**',
    ],
  },
);
