import type { Page } from '@playwright/test';

export const loginPage = (page: Page) => {
  const goto = (baseUrl: string) => page.goto(`${baseUrl}/login`);
  const emailInput = () => page.getByTestId('login-email');
  const passwordInput = () => page.getByTestId('login-password');
  const submitButton = () => page.getByTestId('login-submit');
  const forgotPasswordLink = () => page.getByRole('link', { name: /forgot password/i });
  const heading = () => page.getByRole('heading', { name: /sign in/i });

  const fillAndSubmit = async (baseUrl: string, email: string, password: string) => {
    await page.goto(`${baseUrl}/login`);
    await emailInput().waitFor({ state: 'visible' });
    await emailInput().fill(email);
    await passwordInput().fill(password);
    await submitButton().click();
  };

  return {
    goto,
    emailInput,
    passwordInput,
    submitButton,
    forgotPasswordLink,
    heading,
    fillAndSubmit,
  };
};
