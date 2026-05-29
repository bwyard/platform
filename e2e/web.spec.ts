import { test, expect } from './fixtures';
import { createWebHomePage } from './pages/web/home.page';

test.describe('web — public site', () => {
  test('home page loads', async ({ page, urls }) => {
    const home = createWebHomePage(page, urls.web);
    await home.goto();
    await expect(page).toHaveTitle(/.+/);
  });

  test('nav renders', async ({ page, urls }) => {
    const home = createWebHomePage(page, urls.web);
    await home.goto();
    await expect(home.nav()).toBeVisible();
  });

  test('footer renders', async ({ page, urls }) => {
    const home = createWebHomePage(page, urls.web);
    await home.goto();
    await expect(home.footer()).toBeVisible();
  });
});
