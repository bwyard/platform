import { test, expect } from '../../fixtures';
import { portfolioApp } from '../../poms/portfolio';

test('home page loads', async ({ page }) => {
  const app = portfolioApp(page);

  await test.step('load home page', async () => {
    await app.home.goto();
    await expect(page).toHaveTitle(/.+/);
  });
});

test('no login required', async ({ page }) => {
  const app = portfolioApp(page);

  await test.step('load home page without auth', async () => {
    await app.home.goto();
    await expect(page).not.toHaveURL(/login/);
  });
});
