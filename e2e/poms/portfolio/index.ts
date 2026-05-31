import { config } from '../../config';
import type { Page } from '@playwright/test';
import { portfolioHomePage } from './home.page';

export const portfolioApp = (page: Page, baseUrl = config.urls.portfolio) => ({
  home: portfolioHomePage(page, baseUrl),
});

export type PortfolioApp = ReturnType<typeof portfolioApp>;

export { portfolioHomePage };
