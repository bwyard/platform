import { test, expect } from './fixtures';
import { portfolioHomePage } from './pages/portfolio/home.page';

test.describe('portfolio — breeyard.com', () => {
  test('home page loads', async ({ page, urls }) => {
    const home = portfolioHomePage(page);
    await home.goto(urls.portfolio);
    await expect(page).toHaveTitle(/.+/);
  });

  test('no login required', async ({ page, urls }) => {
    const home = portfolioHomePage(page);
    await home.goto(urls.portfolio);
    await expect(page).not.toHaveURL(/login/);
  });
});
