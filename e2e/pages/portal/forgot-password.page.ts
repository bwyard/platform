import type { Page, Locator } from '@playwright/test';

export const forgotPasswordPage = (page: Page) => ({
  goto: (baseUrl: string): Promise<void> =>
    page.goto(`${baseUrl}/forgot-password`).then(() => undefined),
  heading: (): Locator => page.getByRole('heading', { name: /reset your password/i }),
  emailInput: (): Locator => page.getByTestId('forgot-password-email'),
  submitButton: (): Locator => page.getByTestId('forgot-password-submit'),
  backToSignIn: (): Locator => page.getByRole('link', { name: /back to sign in/i }),
});

export type ForgotPasswordPage = ReturnType<typeof forgotPasswordPage>;
