import type { APIRequestContext, Page } from '@playwright/test';
import { config, type AppKey } from '../config';
import { getUser, type UserAlias } from '../users';
import { sharedLoginPage } from '../poms/shared/login.page';

const resolveUrl = (appKey: AppKey, override?: string): string => override ?? config.urls[appKey];

export const signInAs = async (
  request: APIRequestContext,
  alias: UserAlias,
  appKey?: AppKey,
  baseUrl?: string,
): Promise<void> => {
  const { email, password, appKey: homeApp } = getUser(alias);
  const url = resolveUrl(appKey ?? homeApp, baseUrl);
  const response = await request.post(`${url}/auth/sign-in/email`, {
    data: { email, password },
    headers: { 'Content-Type': 'application/json' },
  });
  if (response.status() !== 200) {
    throw new Error(
      `signInAs [${alias}@${appKey ?? homeApp}]: ${response.status()} ${await response.text()}`,
    );
  }
};

export const loginAs = async (
  page: Page,
  alias: UserAlias,
  appKey?: AppKey,
  baseUrl?: string,
): Promise<void> => {
  const { email, password, appKey: homeApp } = getUser(alias);
  const base = resolveUrl(appKey ?? homeApp, baseUrl);
  const login = sharedLoginPage(page);
  await login.fillAndSubmit(base, email, password);
  await page.waitForURL((url) => !url.pathname.includes('/login'));
};
