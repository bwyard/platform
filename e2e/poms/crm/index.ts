import { config } from '../../config';
import type { Page } from '@playwright/test';
import { crmDashboardPage } from './dashboard.page';
import { crmClientsPage } from './clients.page';
import { crmMessagesPage } from './messages.page';
import { crmClientEditPage } from './client-edit.page';
import { crmProjectDetailPage } from './project-detail.page';

export const crmApp = (page: Page, baseUrl = config.urls.crm) => ({
  dashboard: crmDashboardPage(page, baseUrl),
  clients: crmClientsPage(page, baseUrl),
  messages: crmMessagesPage(page, baseUrl),
  clientEdit: crmClientEditPage(page, baseUrl),
  projectDetail: crmProjectDetailPage(page, baseUrl),
});

export type CrmApp = ReturnType<typeof crmApp>;

export {
  crmDashboardPage,
  crmClientsPage,
  crmMessagesPage,
  crmClientEditPage,
  crmProjectDetailPage,
};
