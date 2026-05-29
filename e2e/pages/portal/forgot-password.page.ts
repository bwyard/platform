import type { Page } from '@playwright/test';

export const createForgotPasswordPage = (page: Page, baseUrl: string) => {
  const goto = () => page.goto(`${baseUrl}/forgot-password`);
  const heading = () => page.getByRole('heading', { name: /reset your password/i });
  const emailInput = () => page.getByTestId('forgot-password-email');
  const submitButton = () => page.getByTestId('forgot-password-submit');
  const backToSignIn = () => page.getByRole('link', { name: /back to sign in/i });

  return { goto, heading, emailInput, submitButton, backToSignIn };
};
