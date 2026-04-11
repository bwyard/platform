import { test, expect } from '@playwright/test';

test.describe('crm — client management', () => {
  test('dashboard loads', async ({ page }) => {
    await page.goto('http://localhost:3013/dashboard');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('clients section loads', async ({ page }) => {
    await page.goto('http://localhost:3013/clients');
    await expect(page).toHaveURL(/clients/);
  });

  test('unauthenticated user is redirected to login', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: undefined });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3013/dashboard');
    await expect(page).toHaveURL(/login/);
    await ctx.close();
  });
});
