import { test as setup, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const authFile = 'e2e/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await mkdir('e2e/.auth', { recursive: true });

  const email = process.env.E2E_ADMIN_EMAIL ?? 'bree@8ofwands.com';
  const password = process.env.E2E_ADMIN_PASSWORD ?? '';

  // Sign in via API directly — avoids CORS and Svelte hydration race conditions in setup.
  // The session cookie is shared with the browser context automatically by Playwright.
  const response = await page.request.post('http://localhost:3010/auth/sign-in/email', {
    data: { email, password },
    headers: { 'Content-Type': 'application/json' },
  });

  expect(
    response.status(),
    `Sign-in API returned ${response.status().toString()}: ${await response.text()}`,
  ).toBe(200);

  // Verify the session works end-to-end by loading a protected CRM route.
  await page.goto('http://localhost:3013/clients');
  await page.waitForURL(/\/clients/);

  await page.context().storageState({ path: authFile });
});
