import { test, expect } from '@playwright/test';

// Runs with storageState: e2e/.auth/admin.json — already authenticated.

test.describe('cms — content management', () => {
  test('dashboard loads', async ({ page }) => {
    await page.goto('http://localhost:3012/dashboard');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('blocks section loads', async ({ page }) => {
    await page.goto('http://localhost:3012/blocks');
    await expect(page).toHaveURL(/blocks/);
  });

  test('nav section loads', async ({ page }) => {
    await page.goto('http://localhost:3012/nav');
    await expect(page).toHaveURL(/nav/);
  });

  test('unauthenticated user is redirected to login', async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: undefined });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3012/dashboard');
    await expect(page).toHaveURL(/login/);
    await ctx.close();
  });
});
