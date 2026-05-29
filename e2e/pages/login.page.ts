import type { Page } from '@playwright/test';

export const createLoginPage = (page: Page, baseUrl: string) => {
  const goto = () => page.goto(`${baseUrl}/login`);
  const emailInput = () => page.getByTestId('login-email');
  const passwordInput = () => page.getByTestId('login-password');
  const submitButton = () => page.getByTestId('login-submit');
  const forgotPasswordLink = () => page.getByRole('link', { name: /forgot password/i });
  const heading = () => page.getByRole('heading', { name: /sign in/i });

  const login = async (email: string, password: string) => {
    await page.waitForLoadState('networkidle');
    await emailInput().fill(email);
    await passwordInput().fill(password);
    await submitButton().click();
  };

  return { goto, emailInput, passwordInput, submitButton, forgotPasswordLink, heading, login };
};
