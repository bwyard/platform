import type { Page } from '@playwright/test';

export const createPortfolioHomePage = (page: Page, baseUrl: string) => {
  const goto = () => page.goto(baseUrl);

  return { goto };
};
