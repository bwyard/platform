import type { Page, Locator } from '@playwright/test';

export const clientEditPage = (page: Page) => ({
  goto: (baseUrl: string, clientId: string): Promise<void> =>
    page.goto(`${baseUrl}/clients/${clientId}/edit`).then(() => undefined),
  nameInput: (): Locator => page.getByTestId('edit-name'),
  emailInput: (): Locator => page.getByTestId('edit-email'),
  statusSelect: (): Locator => page.getByTestId('edit-status'),
  saveButton: (): Locator => page.getByTestId('save-client'),
  archiveTrigger: (): Locator => page.getByTestId('archive-trigger'),
  archiveConfirm: (): Locator => page.getByTestId('archive-confirm'),
  editLink: (): Locator => page.getByTestId('edit-client-link'),
});

export type ClientEditPage = ReturnType<typeof clientEditPage>;
