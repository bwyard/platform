import type { Page } from '@playwright/test';

export const cmsDashboardPage = (page: Page) => ({
  goto: (baseUrl: string): Promise<void> => page.goto(`${baseUrl}/dashboard`).then(() => undefined),
});

export type CmsDashboardPage = ReturnType<typeof cmsDashboardPage>;
