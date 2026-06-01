import type { Page, Locator } from '@playwright/test';

export const sharedLoginPage = (page: Page) => ({
  goto: (baseUrl: string): Promise<void> => page.goto(`${baseUrl}/login`).then(() => undefined),
  emailInput: (): Locator => page.getByTestId('login-email'),
  passwordInput: (): Locator => page.getByTestId('login-password'),
  submitButton: (): Locator => page.getByTestId('login-submit'),
  forgotPasswordLink: (): Locator => page.getByRole('link', { name: /forgot password/i }),
  heading: (): Locator => page.getByRole('heading', { name: /sign in/i }),
  fillAndSubmit: async (baseUrl: string, email: string, password: string): Promise<void> => {
    await page.goto(`${baseUrl}/login`);
    await page.getByTestId('login-email').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').fill(email);
    await page.getByTestId('login-password').fill(password);
    await page.getByTestId('login-submit').click();
  },
});

export type SharedLoginPage = ReturnType<typeof sharedLoginPage>;
