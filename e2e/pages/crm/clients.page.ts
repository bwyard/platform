import type { Page } from '@playwright/test';

export const createClientsPage = (page: Page, baseUrl: string) => {
  const goto = () => page.goto(`${baseUrl}/clients`);
  const heading = () => page.getByRole('heading', { name: /clients/i });
  const searchInput = () => page.getByTestId('client-search');
  const filterButton = (status: string) => page.getByTestId(`filter-${status}`);
  const clientRows = () => page.getByTestId('client-row');
  const clientsTable = () => page.getByTestId('clients-table');

  return { goto, heading, searchInput, filterButton, clientRows, clientsTable };
};
