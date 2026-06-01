import { config } from '../../config';
import type { Page } from '@playwright/test';
import { webHomePage } from './home.page';

export const webApp = (page: Page, baseUrl = config.urls.web) => ({
  home: webHomePage(page, baseUrl),
});

export type WebApp = ReturnType<typeof webApp>;

export { webHomePage };
