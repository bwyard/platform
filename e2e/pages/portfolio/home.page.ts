import type { Page } from '@playwright/test';

export const portfolioHomePage = (page: Page) => ({
  goto: (baseUrl: string): Promise<void> => page.goto(baseUrl).then(() => undefined),
});

export type PortfolioHomePage = ReturnType<typeof portfolioHomePage>;
