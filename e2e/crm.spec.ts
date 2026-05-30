import { test, expect } from './fixtures';
import { createLoginPage } from './pages/login.page';
import { createMessagesPage } from './pages/crm/messages.page';

const SEED_CLIENT_ID = 'client-example';

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

test.describe('crm — messages', () => {
  test('messages page loads for a client', async ({ page, urls }) => {
    const messages = createMessagesPage(page, urls.crm, SEED_CLIENT_ID);
    await messages.goto();
    await expect(messages.thread()).toBeVisible();
  });

  test('shows empty state when no messages', async ({ page, urls }) => {
    const messages = createMessagesPage(page, urls.crm, SEED_CLIENT_ID);
    await messages.goto();
    const count = await messages.messageItems().count();
    if (count === 0) {
      await expect(messages.emptyState()).toBeVisible();
    }
  });

  test('admin can send a reply', async ({ page, urls }) => {
    const messages = createMessagesPage(page, urls.crm, SEED_CLIENT_ID);
    await messages.goto();
    await messages.sendReply('Test reply from admin');
    await expect(messages.messageItems().last()).toContainText('Test reply from admin', {
      timeout: 5_000,
    });
  });

  test('unauthenticated user is redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.crm}/clients/${SEED_CLIENT_ID}/messages`);
    await expect(unauthedPage).toHaveURL(/login/);
  });

  test('client detail shows messages link', async ({ page, urls }) => {
    await page.goto(`${urls.crm}/clients/${SEED_CLIENT_ID}`);
    const messages = createMessagesPage(page, urls.crm, SEED_CLIENT_ID);
    await expect(messages.messagesLink()).toBeVisible();
  });
});
