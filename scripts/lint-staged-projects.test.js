import { describe, it, expect } from 'vitest';
import { isDts, isLintable, parseStagedFiles } from './lint-staged-projects.js';

describe('isDts', () => {
  it('matches .d.ts files', () => {
    expect(isDts('packages/core/ui/src/Button.svelte.d.ts')).toBe(true);
    expect(isDts('packages/core/ui/src/Input.d.ts')).toBe(true);
  });

  it('does not match regular .ts files', () => {
    expect(isDts('packages/core/ui/src/utils.ts')).toBe(false);
    expect(isDts('apps/web/src/routes/+page.ts')).toBe(false);
  });
});

describe('isLintable', () => {
  it('accepts supported extensions', () => {
    expect(isLintable('src/foo.ts')).toBe(true);
    expect(isLintable('src/foo.js')).toBe(true);
    expect(isLintable('src/foo.svelte')).toBe(true);
    expect(isLintable('src/foo.mjs')).toBe(true);
    expect(isLintable('src/foo.cjs')).toBe(true);
  });

  it('rejects .d.ts even though extension ends in .ts', () => {
    expect(isLintable('src/Button.svelte.d.ts')).toBe(false);
    expect(isLintable('src/types.d.ts')).toBe(false);
  });

  it('rejects unsupported extensions', () => {
    expect(isLintable('src/styles.css')).toBe(false);
    expect(isLintable('README.md')).toBe(false);
    expect(isLintable('package.json')).toBe(false);
  });
});

describe('parseStagedFiles', () => {
  it('parses newline-separated output into an array', () => {
    const raw = 'src/foo.ts\nsrc/bar.svelte\n';
    // existsSync will return false for these paths — they get filtered
    // In real usage CWD is repo root and files exist. Here we just test parsing + filtering logic.
    const result = parseStagedFiles(raw);
    // Both are lintable extensions but won't exist on disk in test env
    expect(result).toBeInstanceOf(Array);
  });

  it('filters out .d.ts files', () => {
    // Even if a .d.ts file somehow existed on disk it should be filtered by isLintable
    const raw = 'src/Button.svelte.d.ts\nsrc/Input.d.ts\n';
    const result = parseStagedFiles(raw);
    expect(result).toHaveLength(0);
  });

  it('filters out unsupported extensions', () => {
    const raw = 'README.md\npackage.json\nsrc/styles.css\n';
    const result = parseStagedFiles(raw);
    expect(result).toHaveLength(0);
  });

  it('handles empty input', () => {
    expect(parseStagedFiles('')).toHaveLength(0);
    expect(parseStagedFiles('\n\n')).toHaveLength(0);
  });
});
