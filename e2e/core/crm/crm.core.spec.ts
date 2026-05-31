import { test, expect } from '../../fixtures';
import { crmApp } from '../../poms/crm';
import { loginAs } from '../../helpers/auth';
import { config } from '../../config';

const SEED_CLIENT_ID = 'client-example';
const SEED_PROJECT_ID = 'project-example';

test.describe('auth guards', () => {
  test('unauthenticated root redirects to login', async ({ unauthedPage }) => {
    await test.step('navigate unauthenticated', async () => {
      await unauthedPage.goto(`${config.urls.crm}/`);
      await expect(unauthedPage).toHaveURL(/login/);
    });
  });

  test('unauthenticated clients page redirects to login', async ({ unauthedPage }) => {
    await test.step('navigate unauthenticated', async () => {
      await unauthedPage.goto(`${config.urls.crm}/clients`);
      await expect(unauthedPage).toHaveURL(/login/);
    });
  });

  test('unauthenticated messages page redirects to login', async ({ unauthedPage }) => {
    await test.step('navigate unauthenticated', async () => {
      await unauthedPage.goto(`${config.urls.crm}/clients/${SEED_CLIENT_ID}/messages`);
      await expect(unauthedPage).toHaveURL(/login/);
    });
  });

  test('unauthenticated client edit redirects to login', async ({ unauthedPage }) => {
    await test.step('navigate unauthenticated', async () => {
      await unauthedPage.goto(`${config.urls.crm}/clients/${SEED_CLIENT_ID}/edit`);
      await expect(unauthedPage).toHaveURL(/login/);
    });
  });

  test('unauthenticated project detail redirects to login', async ({ unauthedPage }) => {
    await test.step('navigate unauthenticated', async () => {
      await unauthedPage.goto(`${config.urls.crm}/projects/${SEED_PROJECT_ID}`);
      await expect(unauthedPage).toHaveURL(/login/);
    });
  });
});

test('admin can log in via UI', async ({ unauthedPage }) => {
  await test.step('submit login form as admin-1', async () => {
    await loginAs(unauthedPage, 'admin-1');
  });

  await test.step('confirm redirect after login', async () => {
    await expect(unauthedPage).toHaveURL(/\//, { timeout: 15_000 });
  });
});

test('admin can send a message reply', async ({ page }) => {
  const app = crmApp(page);

  await test.step('open client messages', async () => {
    await app.messages.goto(SEED_CLIENT_ID);
    await expect(app.messages.thread()).toBeVisible();
  });

  await test.step('send reply and confirm it appears', async () => {
    await app.messages.sendReply('Test reply from admin');
    await expect(app.messages.items().last()).toContainText('Test reply from admin', {
      timeout: 5_000,
    });
  });
});
