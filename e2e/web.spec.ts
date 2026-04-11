import { test, expect } from '@playwright/test';

test.describe('web — public site', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('http://localhost:3011');
    await expect(page).toHaveTitle(/.+/);
  });

  test('nav renders', async ({ page }) => {
    await page.goto('http://localhost:3011');
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('footer renders', async ({ page }) => {
    await page.goto('http://localhost:3011');
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });
});
