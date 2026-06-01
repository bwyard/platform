#!/usr/bin/env node
// Pre-commit lint: runs eslint on staged files only — one invocation, no nx transitive deps.
// Full nx run-many lint happens at pre-push.
//
// Called from .husky/pre-commit. Run standalone: node scripts/lint-staged-projects.js
// Pure functions are exported for unit tests: scripts/lint-staged-projects.test.js
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Use the node binary already running this script + direct bin paths.
// Avoids pnpm/npx PATH dependency — git hooks run in a minimal shell environment.
const ESLINT_BIN = fileURLToPath(new URL('../node_modules/eslint/bin/eslint.js', import.meta.url));

const LINT_EXTS = new Set(['.ts', '.js', '.mjs', '.cjs', '.svelte']);
const ESLINT_TIMEOUT_MS = 30_000;

// .d.ts excluded — eslint projectService hangs on declaration files not in allowDefaultProject.
// Type correctness on .d.ts is enforced by tsc at pre-push. No logic to lint in declarations.
export const isDts = (f) => f.endsWith('.d.ts');

export const isLintable = (f) => !isDts(f) && LINT_EXTS.has(f.slice(f.lastIndexOf('.')));

export const parseStagedFiles = (raw) =>
  raw.split('\n').filter(Boolean).filter(isLintable).filter(existsSync); // skip deleted files — existsSync assumes CWD = repo root (husky guarantees this)

function main() {
  let stagedRaw;
  try {
    stagedRaw = execFileSync('git', ['diff', '--cached', '--name-only'], {
      encoding: 'utf8',
    }).trim();
  } catch {
    console.error('pre-commit: failed to get staged files — is this a git repo?');
    process.exit(1);
  }

  if (!stagedRaw) {
    console.log('pre-commit: no staged files, skipping');
    process.exit(0);
  }

  const lintFiles = parseStagedFiles(stagedRaw);

  if (lintFiles.length === 0) {
    console.log('pre-commit: no lintable staged files, skipping lint');
    process.exit(0);
  }

  console.log(`pre-commit: linting ${lintFiles.length} staged file(s)`);
  lintFiles.forEach((f) => console.log(`  ${f}`));

  try {
    execFileSync(process.execPath, [ESLINT_BIN, '--no-warn-ignored', ...lintFiles], {
      stdio: 'inherit',
      timeout: ESLINT_TIMEOUT_MS,
    });
  } catch (err) {
    if (err.signal === 'SIGTERM') {
      console.error(`pre-commit: eslint timed out after ${ESLINT_TIMEOUT_MS / 1000}s`);
    } else if (err.status != null && err.status !== 0) {
      console.error(`pre-commit: eslint exited with code ${String(err.status)}`);
    } else {
      console.error(`pre-commit: unexpected error — ${String(err)}`);
    }
    process.exit(1);
  }

  console.log('pre-commit: passed');
}

// Only run when called directly — not when imported by tests
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
