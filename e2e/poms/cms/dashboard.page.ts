import type { Page } from '@playwright/test';

export const cmsDashboardPage = (page: Page, baseUrl: string) => ({
  goto: (): Promise<void> => page.goto(`${baseUrl}/dashboard`).then(() => undefined),
});

export type CmsDashboardPage = ReturnType<typeof cmsDashboardPage>;
