import { test, expect } from '../../fixtures';
import { config } from '../../config';

test('pages section loads', async ({ page }) => {
  await test.step('navigate to pages', async () => {
    await page.goto(`${config.urls.cms}/pages`);
    await expect(page).toHaveURL(/pages/);
  });
});

test('blocks section loads', async ({ page }) => {
  await test.step('navigate to blocks', async () => {
    await page.goto(`${config.urls.cms}/blocks`);
    await expect(page).toHaveURL(/blocks/);
  });
});

test('nav section loads', async ({ page }) => {
  await test.step('navigate to nav', async () => {
    await page.goto(`${config.urls.cms}/nav`);
    await expect(page).toHaveURL(/nav/);
  });
});
