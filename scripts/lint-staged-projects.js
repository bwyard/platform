#!/usr/bin/env node
// Pre-commit lint: runs eslint --fix on staged files only.
// Fast by design — one eslint invocation, only what you're committing.
// Full nx run-many lint (all files, all packages) happens at pre-push.
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const LINT_EXTS = new Set(['.ts', '.js', '.mjs', '.cjs', '.svelte']);

// .d.ts excluded — eslint projectService hangs on declaration files not in allowDefaultProject.
// Type correctness on .d.ts is enforced by tsc at pre-push.
const isDts = (f) => f.endsWith('.d.ts');
const isLintable = (f) => !isDts(f) && LINT_EXTS.has(f.slice(f.lastIndexOf('.')));

const stagedRaw = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();

if (!stagedRaw) {
  console.log('pre-commit: no staged files, skipping');
  process.exit(0);
}

const files = stagedRaw
  .split('\n')
  .filter(Boolean)
  .filter(isLintable)
  .filter(existsSync); // skip deleted files

if (files.length === 0) {
  console.log('pre-commit: no lintable staged files, skipping');
  process.exit(0);
}

console.log(`pre-commit: linting ${files.length} staged file(s)`);
files.forEach((f) => console.log(`  ${f}`));

execSync(`pnpm exec eslint --fix --no-warn-ignored ${files.join(' ')}`, { stdio: 'inherit' });

// Re-stage after --fix so the commit contains the fixed version.
execSync(`git add ${files.join(' ')}`, { stdio: 'pipe' });

console.log('pre-commit: lint passed');
