import { config } from '../../config';
import type { Page } from '@playwright/test';
import { portalDashboardPage } from './dashboard.page';
import { portalForgotPasswordPage } from './forgot-password.page';
import { portalResetPasswordPage } from './reset-password.page';
import { portalProjectDetailPage } from './project-detail.page';

export const portalApp = (page: Page, baseUrl = config.urls.portal) => ({
  dashboard: portalDashboardPage(page, baseUrl),
  forgotPassword: portalForgotPasswordPage(page, baseUrl),
  resetPassword: portalResetPasswordPage(page, baseUrl),
  projectDetail: portalProjectDetailPage(page, baseUrl),
});

export type PortalApp = ReturnType<typeof portalApp>;

export {
  portalDashboardPage,
  portalForgotPasswordPage,
  portalResetPasswordPage,
  portalProjectDetailPage,
};
