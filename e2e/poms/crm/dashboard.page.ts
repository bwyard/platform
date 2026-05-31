import type { Page, Locator } from '@playwright/test';

export const crmDashboardPage = (page: Page, baseUrl: string) => ({
  goto: (): Promise<void> => page.goto(`${baseUrl}/`).then(() => undefined),
  heading: (): Locator => page.getByRole('heading', { name: /dashboard/i }),
  statCard: (label: string): Locator =>
    page.getByTestId(`stat-${label.toLowerCase().replace(/\s+/g, '-')}`),
  recentClients: (): Locator => page.getByTestId('recent-clients'),
});

export type CrmDashboardPage = ReturnType<typeof crmDashboardPage>;
