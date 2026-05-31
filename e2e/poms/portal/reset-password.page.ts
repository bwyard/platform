import type { Page, Locator } from '@playwright/test';

export const portalResetPasswordPage = (page: Page, baseUrl: string) => ({
  goto: (token?: string): Promise<void> =>
    page.goto(`${baseUrl}/reset-password${token ? `?token=${token}` : ''}`).then(() => undefined),
  heading: (): Locator => page.getByRole('heading', { name: /set your password/i }),
  newPasswordInput: (): Locator => page.getByTestId('reset-password-new'),
  confirmInput: (): Locator => page.getByTestId('reset-password-confirm'),
  submitButton: (): Locator => page.getByTestId('reset-password-submit'),
  errorMessage: (): Locator => page.getByText(/invalid or missing reset token/i),
});

export type PortalResetPasswordPage = ReturnType<typeof portalResetPasswordPage>;
