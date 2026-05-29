import { test, expect } from './fixtures';
import { createPortfolioHomePage } from './pages/portfolio/home.page';

test.describe('portfolio — breeyard.com', () => {
  test('home page loads', async ({ page, urls }) => {
    const home = createPortfolioHomePage(page, urls.portfolio);
    await home.goto();
    await expect(page).toHaveTitle(/.+/);
  });

  test('no login required', async ({ page, urls }) => {
    const home = createPortfolioHomePage(page, urls.portfolio);
    await home.goto();
    await expect(page).not.toHaveURL(/login/);
  });
});
