import type { Page } from '@playwright/test';

export const createCrmDashboardPage = (page: Page, baseUrl: string) => {
  const goto = () => page.goto(`${baseUrl}/`);
  const heading = () => page.getByRole('heading', { name: /dashboard/i });
  const statCard = (label: string) =>
    page.getByTestId(`stat-${label.toLowerCase().replace(/\s+/g, '-')}`);
  const recentClients = () => page.getByTestId('recent-clients');

  return { goto, heading, statCard, recentClients };
};
