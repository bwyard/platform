import type { Page, Locator } from '@playwright/test';

export const clientsPage = (page: Page) => ({
  goto: (baseUrl: string): Promise<void> => page.goto(`${baseUrl}/clients`).then(() => undefined),
  heading: (): Locator => page.getByRole('heading', { name: /clients/i }),
  searchInput: (): Locator => page.getByTestId('client-search'),
  filterButton: (status: string): Locator => page.getByTestId(`filter-${status}`),
  clientRows: (): Locator => page.getByTestId('client-row'),
  clientsTable: (): Locator => page.getByTestId('clients-table'),
});

export type ClientsPage = ReturnType<typeof clientsPage>;
