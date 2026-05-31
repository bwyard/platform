import { test, expect } from './fixtures';
import { webHomePage } from './pages/web/home.page';

test.describe('web — public site', () => {
  test('home page loads', async ({ page, urls }) => {
    const home = webHomePage(page);
    await home.goto(urls.web);
    await expect(page).toHaveTitle(/.+/);
  });

  test('nav renders', async ({ page, urls }) => {
    const home = webHomePage(page);
    await home.goto(urls.web);
    await expect(home.nav()).toBeVisible();
  });

  test('footer renders', async ({ page, urls }) => {
    const home = webHomePage(page);
    await home.goto(urls.web);
    await expect(home.footer()).toBeVisible();
  });
});
