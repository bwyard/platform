import { test as setup } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { config } from './config';
import { signInViaApi } from './helpers/auth';

const authFile = 'e2e/.auth/portal-client.json';

setup('authenticate as portal client', async ({ page }) => {
  await mkdir('e2e/.auth', { recursive: true });

  const { email, password } = config.credentials.client;

  await signInViaApi(page.request, config.urls.api, email, password);

  await page.goto(`${config.urls.portal}/projects`);
  await page.waitForURL(/\/projects/);

  await page.context().storageState({ path: authFile });
});
