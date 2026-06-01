import type { Page } from '@playwright/test';

export const portalDashboardPage = (page: Page, baseUrl: string) => ({
  goto: (): Promise<void> => page.goto(`${baseUrl}/dashboard`).then(() => undefined),
});

export type PortalDashboardPage = ReturnType<typeof portalDashboardPage>;
