import { test as setup } from '@playwright/test';

// Login once, save session state for all authed test projects (cms, crm).
// Runs before any authed spec.

const authFile = 'e2e/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await page.goto('http://localhost:3012/login');
  await page.getByLabel('Email').fill(process.env.E2E_ADMIN_EMAIL ?? 'admin@breeyard.dev');
  await page.getByLabel('Password').fill(process.env.E2E_ADMIN_PASSWORD ?? 'changeme');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL('**/dashboard');
  await page.context().storageState({ path: authFile });
});
