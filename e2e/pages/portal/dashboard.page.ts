import type { Page } from '@playwright/test';

export const portalDashboardPage = (page: Page) => ({
  goto: (baseUrl: string): Promise<void> => page.goto(`${baseUrl}/dashboard`).then(() => undefined),
});

export type PortalDashboardPage = ReturnType<typeof portalDashboardPage>;
