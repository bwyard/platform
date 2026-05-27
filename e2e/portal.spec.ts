import { test, expect } from '@playwright/test';

test.describe('portal — client portal', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('http://localhost:3014/login');
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });

  test('login page has forgot password link', async ({ page }) => {
    await page.goto('http://localhost:3014/login');
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible();
  });

  test('unauthenticated root redirects to login', async ({ page }) => {
    await page.goto('http://localhost:3014');
    await expect(page).toHaveURL(/login/);
  });

  test('unauthenticated dashboard redirects to login', async ({ page }) => {
    await page.goto('http://localhost:3014/dashboard');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('portal — forgot password', () => {
  test('forgot-password page is publicly accessible', async ({ page }) => {
    await page.goto('http://localhost:3014/forgot-password');
    await expect(page).toHaveURL(/forgot-password/);
    await expect(page.getByRole('heading', { name: /reset your password/i })).toBeVisible();
  });

  test('forgot-password has email input and submit button', async ({ page }) => {
    await page.goto('http://localhost:3014/forgot-password');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByRole('button', { name: /send reset link/i })).toBeVisible();
  });

  test('forgot-password has back to sign in link', async ({ page }) => {
    await page.goto('http://localhost:3014/forgot-password');
    await expect(page.getByRole('link', { name: /back to sign in/i })).toBeVisible();
  });
});

test.describe('portal — reset password', () => {
  test('reset-password page is publicly accessible', async ({ page }) => {
    await page.goto('http://localhost:3014/reset-password');
    await expect(page).toHaveURL(/reset-password/);
  });

  test('reset-password without token shows error state', async ({ page }) => {
    await page.goto('http://localhost:3014/reset-password');
    await expect(page.getByText(/invalid or missing reset token/i)).toBeVisible();
  });

  test('reset-password with token shows password form', async ({ page }) => {
    await page.goto('http://localhost:3014/reset-password?token=test-token');
    await expect(page.getByRole('heading', { name: /set your password/i })).toBeVisible();
    await expect(page.getByLabel('New password')).toBeVisible();
    await expect(page.getByLabel('Confirm password')).toBeVisible();
    await expect(page.getByRole('button', { name: /set password/i })).toBeVisible();
  });
});
