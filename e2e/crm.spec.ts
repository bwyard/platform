import { test, expect } from '@playwright/test';

const CRM_URL = process.env.E2E_CRM_URL ?? 'http://localhost:3013';

test.describe('crm — client management', () => {
  test('dashboard loads', async ({ page }) => {
    await page.goto(`${CRM_URL}/dashboard`);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('clients section loads', async ({ page }) => {
    await page.goto(`${CRM_URL}/clients`);
    await expect(page).toHaveURL(/clients/);
  });

  test('unauthenticated user is redirected to login', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: undefined });
    const page = await ctx.newPage();
    await page.goto(`${CRM_URL}/dashboard`);
    await expect(page).toHaveURL(/login/);
    await ctx.close();
  });

  test('admin can log in via UI', async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();

    await page.goto(`${CRM_URL}/login`);
    // Allow extra time for first Vite compile of this route in CI
    await expect(page.getByLabel('Email')).toBeVisible({ timeout: 20_000 });
    await page.getByLabel('Email').fill(process.env.E2E_ADMIN_EMAIL ?? 'bree@8ofwands.com');
    await page.getByLabel('Password').fill(process.env.E2E_ADMIN_PASSWORD ?? '');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/clients/, { timeout: 15_000 });

    await ctx.close();
  });
});
