import { test as setup, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const authFile = 'e2e/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await mkdir('e2e/.auth', { recursive: true });

  await page.goto('http://localhost:3013/login');
  await expect(page.getByLabel('Email')).toBeVisible();
  await page.getByLabel('Email').fill(process.env.E2E_ADMIN_EMAIL ?? 'bree@8ofwands.com');
  await page.getByLabel('Password').fill(process.env.E2E_ADMIN_PASSWORD ?? '');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/(clients|dashboard)/);

  await page.context().storageState({ path: authFile });
});
