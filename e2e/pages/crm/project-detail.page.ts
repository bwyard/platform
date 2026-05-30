import type { Page } from '@playwright/test';

export const createProjectDetailPage = (page: Page, baseUrl: string, projectId: string) => {
  const goto = () => page.goto(`${baseUrl}/projects/${projectId}`);
  const heading = () => page.getByTestId('project-name');
  const editToggle = () => page.getByTestId('edit-project-toggle');
  const nameInput = () => page.getByTestId('project-name-input');
  const statusSelect = () => page.getByTestId('project-status-select');
  const saveButton = () => page.getByTestId('save-project');

  return { goto, heading, editToggle, nameInput, statusSelect, saveButton };
};
