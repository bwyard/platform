import { test, expect } from './fixtures';
import { createLoginPage } from './pages/login.page';
import { createForgotPasswordPage } from './pages/portal/forgot-password.page';
import { createResetPasswordPage } from './pages/portal/reset-password.page';

test.describe('portal — client portal', () => {
  test('login page loads', async ({ page, urls }) => {
    const login = createLoginPage(page, urls.portal);
    await login.goto();
    await expect(login.heading()).toBeVisible();
  });

  test('login page has forgot password link', async ({ page, urls }) => {
    const login = createLoginPage(page, urls.portal);
    await login.goto();
    await expect(login.forgotPasswordLink()).toBeVisible();
  });

  test('unauthenticated root redirects to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(urls.portal);
    await expect(unauthedPage).toHaveURL(/login/);
  });

  test('unauthenticated dashboard redirects to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.portal}/dashboard`);
    await expect(unauthedPage).toHaveURL(/login/);
  });
});

test.describe('portal — forgot password', () => {
  test('forgot-password page is publicly accessible', async ({ page, urls }) => {
    const forgotPassword = createForgotPasswordPage(page, urls.portal);
    await forgotPassword.goto();
    await expect(page).toHaveURL(/forgot-password/);
    await expect(forgotPassword.heading()).toBeVisible();
  });

  test('forgot-password has email input and submit button', async ({ page, urls }) => {
    const forgotPassword = createForgotPasswordPage(page, urls.portal);
    await forgotPassword.goto();
    await expect(forgotPassword.emailInput()).toBeVisible();
    await expect(forgotPassword.submitButton()).toBeVisible();
  });

  test('forgot-password has back to sign in link', async ({ page, urls }) => {
    const forgotPassword = createForgotPasswordPage(page, urls.portal);
    await forgotPassword.goto();
    await expect(forgotPassword.backToSignIn()).toBeVisible();
  });
});

test.describe('portal — reset password', () => {
  test('reset-password page is publicly accessible', async ({ page, urls }) => {
    const resetPassword = createResetPasswordPage(page, urls.portal);
    await resetPassword.goto();
    await expect(page).toHaveURL(/reset-password/);
  });

  test('reset-password without token shows error state', async ({ page, urls }) => {
    const resetPassword = createResetPasswordPage(page, urls.portal);
    await resetPassword.goto();
    await expect(resetPassword.errorMessage()).toBeVisible();
  });

  test('reset-password with token shows password form', async ({ page, urls }) => {
    const resetPassword = createResetPasswordPage(page, urls.portal);
    await resetPassword.goto('test-token');
    await expect(resetPassword.heading()).toBeVisible();
    await expect(resetPassword.newPasswordInput()).toBeVisible();
    await expect(resetPassword.confirmInput()).toBeVisible();
    await expect(resetPassword.submitButton()).toBeVisible();
  });
});
