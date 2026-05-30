import type { Page } from '@playwright/test';

export const createClientEditPage = (page: Page, baseUrl: string, clientId: string) => {
  const goto = () => page.goto(`${baseUrl}/clients/${clientId}/edit`);
  const nameInput = () => page.getByTestId('edit-name');
  const emailInput = () => page.getByTestId('edit-email');
  const statusSelect = () => page.getByTestId('edit-status');
  const saveButton = () => page.getByTestId('save-client');
  const archiveTrigger = () => page.getByTestId('archive-trigger');
  const archiveConfirm = () => page.getByTestId('archive-confirm');
  const editLink = () => page.getByTestId('edit-client-link');

  return {
    goto,
    nameInput,
    emailInput,
    statusSelect,
    saveButton,
    archiveTrigger,
    archiveConfirm,
    editLink,
  };
};
