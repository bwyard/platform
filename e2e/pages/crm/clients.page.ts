import type { Page } from '@playwright/test';

export const createClientsPage = (page: Page, baseUrl: string) => {
  const goto = () => page.goto(`${baseUrl}/clients`);
  const heading = () => page.getByRole('heading', { name: /clients/i });

  return { goto, heading };
};
