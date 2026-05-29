import type { Page } from '@playwright/test';

export const createPortalDashboardPage = (page: Page, baseUrl: string) => {
  const goto = () => page.goto(`${baseUrl}/dashboard`);

  return { goto };
};
