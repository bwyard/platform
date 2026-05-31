import type { Page } from '@playwright/test';

export const portfolioHomePage = (page: Page, baseUrl: string) => ({
  goto: (): Promise<void> => page.goto(baseUrl).then(() => undefined),
});

export type PortfolioHomePage = ReturnType<typeof portfolioHomePage>;
