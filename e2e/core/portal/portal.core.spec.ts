import { test, expect } from '../../fixtures';
import { config } from '../../config';

const SEED_PROJECT_ID = 'project-example';

test.describe('auth guards', () => {
  test('unauthenticated dashboard redirects to login', async ({ unauthedPage }) => {
    await test.step('navigate unauthenticated', async () => {
      await unauthedPage.goto(`${config.urls.portal}/dashboard`);
      await expect(unauthedPage).toHaveURL(/login/);
    });
  });

  test('unauthenticated project detail redirects to login', async ({ unauthedPage }) => {
    await test.step('navigate unauthenticated', async () => {
      await unauthedPage.goto(`${config.urls.portal}/projects/${SEED_PROJECT_ID}`);
      await expect(unauthedPage).toHaveURL(/login/);
    });
  });
});

test('forgot password page is publicly accessible', async ({ unauthedPage }) => {
  await test.step('navigate to forgot password', async () => {
    await unauthedPage.goto(`${config.urls.portal}/forgot-password`);
    await expect(unauthedPage).toHaveURL(/forgot-password/);
  });
});
