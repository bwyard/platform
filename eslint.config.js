import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import * as sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import globals from 'globals';

// tseslint.config is flagged as deprecated in favour of ESLint's defineConfig(),
// but defineConfig() is not yet available as an ESM named export in eslint@10.2.0.
// Remove this disable and migrate when eslint is upgraded.
// eslint-disable-next-line @typescript-eslint/no-deprecated
export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierConfig,

  // Svelte rules via official flat config preset.
  ...sveltePlugin.configs['flat/recommended'],

  // Svelte parser + disable type-checked rules for .svelte files.
  // - svelteParser handles .svelte file structure
  // - tseslint.parser handles TypeScript in <script lang="ts"> blocks
  // - extraFileExtensions tells the TS parser .svelte is a valid extension
  // - disableTypeChecked: svelte-check (pnpm typecheck) owns type checking on .svelte
  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      // Svelte 5 component props use `type Props = {...}` by convention — no extension/inheritance.
      // stylisticTypeChecked defaults to 'interface'; override to 'type' for .svelte files.
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },

  // Apps + root-level files: full type-checked linting via projectService.
  // projectService scoped here because it hangs when TypeScript Language Service
  // is initialised from within a package subdirectory (how nx invokes eslint).
  // Packages are NOT in this block — tsc (pnpm typecheck) owns type safety there.
  {
    files: ['apps/**/*.{ts,js,mjs,cjs}', '*.{ts,js,mjs,cjs}'],
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
            'playwright.config.weekly.ts',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Packages: disable type-checked rules — tsc (pnpm typecheck) owns type safety.
  // projectService hangs when initialised from a package CWD due to .svelte import
  // resolution differences; syntax + stylistic rules still apply.
  {
    files: ['packages/**/*.{ts,js,mjs,cjs}'],
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
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
      '**/*.d.ts',
    ],
  },
);
