import type { Page } from '@playwright/test';

export const createWebHomePage = (page: Page, baseUrl: string) => {
  const goto = () => page.goto(baseUrl);
  const nav = () => page.getByRole('navigation');
  const footer = () => page.getByRole('contentinfo');

  return { goto, nav, footer };
};
