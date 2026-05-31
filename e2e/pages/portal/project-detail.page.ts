import type { Page, Locator } from '@playwright/test';

export const portalProjectDetailPage = (page: Page) => ({
  goto: (baseUrl: string, projectId: string): Promise<void> =>
    page.goto(`${baseUrl}/projects/${projectId}`).then(() => undefined),
  heading: (): Locator => page.getByTestId('project-name'),
  projectCards: (): Locator => page.getByTestId('project-card'),
});

export type PortalProjectDetailPage = ReturnType<typeof portalProjectDetailPage>;
