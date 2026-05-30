import { test, expect } from './fixtures';

test.describe('cms — content management', () => {
  test('pages section loads', async ({ page, urls }) => {
    await page.goto(`${urls.cms}/pages`);
    await expect(page).toHaveURL(/pages/);
  });

  test('blocks section loads', async ({ page, urls }) => {
    await page.goto(`${urls.cms}/blocks`);
    await expect(page).toHaveURL(/blocks/);
  });

  test('nav section loads', async ({ page, urls }) => {
    await page.goto(`${urls.cms}/nav`);
    await expect(page).toHaveURL(/nav/);
  });

  test('unauthenticated user is redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.cms}/pages`);
    await expect(unauthedPage).toHaveURL(/login/);
  });
});
