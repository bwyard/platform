import { test, expect } from '../../fixtures';
import { portalApp } from '../../poms/portal';
import { sharedLoginPage } from '../../poms/shared/login.page';
import { config } from '../../config';

test.describe('login page', () => {
  test('forgot password link is visible', async ({ unauthedPage }) => {
    const login = sharedLoginPage(unauthedPage);

    await test.step('load login page', () => login.goto(config.urls.portal));
    await expect(login.forgotPasswordLink()).toBeVisible();
  });
});

test.describe('forgot password', () => {
  test('page has email input and submit', async ({ unauthedPage }) => {
    const app = portalApp(unauthedPage);

    await test.step('load forgot password page', () => app.forgotPassword.goto());

    await test.step('verify form elements', async () => {
      await expect(app.forgotPassword.emailInput()).toBeVisible();
      await expect(app.forgotPassword.submitButton()).toBeVisible();
    });
  });

  test('back to sign in link is visible', async ({ unauthedPage }) => {
    const app = portalApp(unauthedPage);

    await test.step('load forgot password page', () => app.forgotPassword.goto());
    await expect(app.forgotPassword.backToSignIn()).toBeVisible();
  });
});

test.describe('reset password', () => {
  test('page without token shows error', async ({ unauthedPage }) => {
    const app = portalApp(unauthedPage);

    await test.step('load reset password without token', () => app.resetPassword.goto());
    await expect(app.resetPassword.errorMessage()).toBeVisible();
  });

  test('page with token shows password form', async ({ unauthedPage }) => {
    const app = portalApp(unauthedPage);

    await test.step('load reset password with token', () => app.resetPassword.goto('test-token'));

    await test.step('verify form fields', async () => {
      await expect(app.resetPassword.heading()).toBeVisible();
      await expect(app.resetPassword.newPasswordInput()).toBeVisible();
      await expect(app.resetPassword.confirmInput()).toBeVisible();
      await expect(app.resetPassword.submitButton()).toBeVisible();
    });
  });
});
