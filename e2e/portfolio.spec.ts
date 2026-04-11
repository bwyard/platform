import { test, expect } from '@playwright/test';

test.describe('portfolio — breeyard.com', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('http://localhost:3015');
    await expect(page).toHaveTitle(/.+/);
  });

  test('no login required', async ({ page }) => {
    await page.goto('http://localhost:3015');
    await expect(page).not.toHaveURL(/login/);
  });
});
