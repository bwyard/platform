import { test, expect } from './fixtures';
import { createLoginPage } from './pages/login.page';

test.describe('crm — client management', () => {
  test('dashboard loads', async ({ page, urls }) => {
    await page.goto(`${urls.crm}/dashboard`);
    await expect(page).toHaveURL(/dashboard/);
  });

  test('clients section loads', async ({ page, urls }) => {
    await page.goto(`${urls.crm}/clients`);
    await expect(page).toHaveURL(/clients/);
  });

  test('unauthenticated user is redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.crm}/dashboard`);
    await expect(unauthedPage).toHaveURL(/login/);
  });

  test('admin can log in via UI', async ({ unauthedPage, urls, credentials }) => {
    const login = createLoginPage(unauthedPage, urls.crm);
    await login.goto();
    await login.login(credentials.admin.email, credentials.admin.password);
    await expect(unauthedPage).toHaveURL(/\/clients/, { timeout: 15_000 });
  });
});
