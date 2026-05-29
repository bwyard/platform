import type { Page } from '@playwright/test';

export const createResetPasswordPage = (page: Page, baseUrl: string) => {
  const goto = (token?: string) =>
    page.goto(`${baseUrl}/reset-password${token ? `?token=${token}` : ''}`);
  const heading = () => page.getByRole('heading', { name: /set your password/i });
  const newPasswordInput = () => page.getByTestId('reset-password-new');
  const confirmInput = () => page.getByTestId('reset-password-confirm');
  const submitButton = () => page.getByTestId('reset-password-submit');
  const errorMessage = () => page.getByText(/invalid or missing reset token/i);

  return { goto, heading, newPasswordInput, confirmInput, submitButton, errorMessage };
};
