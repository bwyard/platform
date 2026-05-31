import { test, expect } from '../../fixtures';
import { webApp } from '../../poms/web';

test('home page loads', async ({ page }) => {
  const app = webApp(page);

  await test.step('load home page', async () => {
    await app.home.goto();
    await expect(page).toHaveTitle(/.+/);
  });
});

test('navigation and footer render', async ({ page }) => {
  const app = webApp(page);

  await test.step('load home page', () => app.home.goto());

  await test.step('verify chrome', async () => {
    await expect(app.home.nav()).toBeVisible();
    await expect(app.home.footer()).toBeVisible();
  });
});
