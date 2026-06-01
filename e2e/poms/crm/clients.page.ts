import type { Page, Locator } from '@playwright/test';

export const crmClientsPage = (page: Page, baseUrl: string) => ({
  goto: (): Promise<void> => page.goto(`${baseUrl}/clients`).then(() => undefined),
  heading: (): Locator => page.getByRole('heading', { name: /clients/i }),
  search: (q: string): Promise<void> => page.getByTestId('client-search').fill(q),
  searchInput: (): Locator => page.getByTestId('client-search'),
  filterBy: (status: string): Locator => page.getByTestId(`filter-${status}`),
  rows: (): Locator => page.getByTestId('client-row'),
  table: (): Locator => page.getByTestId('clients-table'),
});

export type CrmClientsPage = ReturnType<typeof crmClientsPage>;
