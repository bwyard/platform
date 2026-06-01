import { config } from '../../config';
import type { Page } from '@playwright/test';
import { cmsDashboardPage } from './dashboard.page';

export const cmsApp = (page: Page, baseUrl = config.urls.cms) => ({
  dashboard: cmsDashboardPage(page, baseUrl),
});

export type CmsApp = ReturnType<typeof cmsApp>;

export { cmsDashboardPage };
