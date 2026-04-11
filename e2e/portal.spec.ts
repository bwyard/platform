import { test, expect } from '@playwright/test';

test.describe('portal — client portal', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('http://localhost:3014/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('unauthenticated root redirects to login', async ({ page }) => {
    await page.goto('http://localhost:3014');
    await expect(page).toHaveURL(/login/);
  });
});
