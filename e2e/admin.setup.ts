import { test as setup } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { config } from './config';
import { signInViaApi } from './helpers/auth';

const authFile = 'e2e/.auth/admin.json';

setup('authenticate as admin', async ({ page }) => {
  await mkdir('e2e/.auth', { recursive: true });

  const { email, password } = config.credentials.admin;

  await signInViaApi(page.request, config.urls.api, email, password);

  await page.goto(`${config.urls.crm}/clients`);
  await page.waitForURL(/\/clients/);

  await page.context().storageState({ path: authFile });
});
