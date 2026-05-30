import { test, expect } from './fixtures';
import { loginPage } from './pages/login.page';
import { createForgotPasswordPage } from './pages/portal/forgot-password.page';
import { createResetPasswordPage } from './pages/portal/reset-password.page';
import { createPortalProjectDetailPage } from './pages/portal/project-detail.page';

const SEED_PROJECT_ID = 'project-example';

// Public page tests use unauthedPage — authenticated users are redirected away from /login
test.describe('portal — client portal', () => {
  test('login page loads', async ({ unauthedPage, urls }) => {
    const login = loginPage(unauthedPage);
    await login.goto(urls.portal);
    await expect(login.heading()).toBeVisible();
  });

  test('login page has forgot password link', async ({ unauthedPage, urls }) => {
    const login = loginPage(unauthedPage);
    await login.goto(urls.portal);
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
  test('forgot-password page is publicly accessible', async ({ unauthedPage, urls }) => {
    const forgotPassword = createForgotPasswordPage(unauthedPage, urls.portal);
    await forgotPassword.goto();
    await expect(unauthedPage).toHaveURL(/forgot-password/);
    await expect(forgotPassword.heading()).toBeVisible();
  });

  test('forgot-password has email input and submit button', async ({ unauthedPage, urls }) => {
    const forgotPassword = createForgotPasswordPage(unauthedPage, urls.portal);
    await forgotPassword.goto();
    await expect(forgotPassword.emailInput()).toBeVisible();
    await expect(forgotPassword.submitButton()).toBeVisible();
  });

  test('forgot-password has back to sign in link', async ({ unauthedPage, urls }) => {
    const forgotPassword = createForgotPasswordPage(unauthedPage, urls.portal);
    await forgotPassword.goto();
    await expect(forgotPassword.backToSignIn()).toBeVisible();
  });
});

test.describe('portal — reset password', () => {
  test('reset-password page is publicly accessible', async ({ unauthedPage, urls }) => {
    const resetPassword = createResetPasswordPage(unauthedPage, urls.portal);
    await resetPassword.goto();
    await expect(unauthedPage).toHaveURL(/reset-password/);
  });

  test('reset-password without token shows error state', async ({ unauthedPage, urls }) => {
    const resetPassword = createResetPasswordPage(unauthedPage, urls.portal);
    await resetPassword.goto();
    await expect(resetPassword.errorMessage()).toBeVisible();
  });

  test('reset-password with token shows password form', async ({ unauthedPage, urls }) => {
    const resetPassword = createResetPasswordPage(unauthedPage, urls.portal);
    await resetPassword.goto('test-token');
    await expect(resetPassword.heading()).toBeVisible();
    await expect(resetPassword.newPasswordInput()).toBeVisible();
    await expect(resetPassword.confirmInput()).toBeVisible();
    await expect(resetPassword.submitButton()).toBeVisible();
  });
});

// Authenticated tests use page fixture (client auth via portal-setup)
test.describe('portal — project detail', () => {
  test('projects list loads', async ({ page, urls }) => {
    await page.goto(`${urls.portal}/projects`);
    await expect(page).toHaveURL(/projects/);
  });

  test('project detail page loads when authenticated', async ({ page, urls }) => {
    const detail = createPortalProjectDetailPage(page, urls.portal, SEED_PROJECT_ID);
    await detail.goto();
    await expect(detail.heading()).toBeVisible();
  });

  test('unauthenticated redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.portal}/projects/${SEED_PROJECT_ID}`);
    await expect(unauthedPage).toHaveURL(/login/);
  });
});
