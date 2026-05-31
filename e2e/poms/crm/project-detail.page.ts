import type { Page, Locator } from '@playwright/test';

export const crmProjectDetailPage = (page: Page, baseUrl: string) => ({
  goto: (projectId: string): Promise<void> =>
    page.goto(`${baseUrl}/projects/${projectId}`).then(() => undefined),
  heading: (): Locator => page.getByTestId('project-name'),
  editToggle: (): Locator => page.getByTestId('edit-project-toggle'),
  nameInput: (): Locator => page.getByTestId('project-name-input'),
  statusSelect: (): Locator => page.getByTestId('project-status-select'),
  saveButton: (): Locator => page.getByTestId('save-project'),
});

export type CrmProjectDetailPage = ReturnType<typeof crmProjectDetailPage>;
