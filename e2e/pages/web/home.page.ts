import type { Page, Locator } from '@playwright/test';

export const webHomePage = (page: Page) => ({
  goto: (baseUrl: string): Promise<void> => page.goto(baseUrl).then(() => undefined),
  nav: (): Locator => page.getByRole('navigation'),
  footer: (): Locator => page.getByRole('contentinfo'),
});

export type WebHomePage = ReturnType<typeof webHomePage>;
