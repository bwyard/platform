import type { Page } from '@playwright/test';

export const createPortalProjectDetailPage = (page: Page, baseUrl: string, projectId: string) => {
  const goto = () => page.goto(`${baseUrl}/projects/${projectId}`);
  const heading = () => page.getByTestId('project-name');
  const projectCards = () => page.getByTestId('project-card');

  return { goto, heading, projectCards };
};
