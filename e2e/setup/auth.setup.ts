import { test as setup } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { USERS, type UserAlias } from '../users';
import { signInAs } from '../helpers/auth';

const setupAuthFor = (alias: UserAlias) => {
  setup(`${alias} — save auth state`, async ({ page }) => {
    await mkdir('e2e/.auth', { recursive: true });
    await signInAs(page.request, alias);
    await page.waitForURL((url) => !url.pathname.includes('/login'));
    await page.context().storageState({ path: `e2e/.auth/${alias}.json` });
  });
};

(Object.keys(USERS) as UserAlias[]).forEach(setupAuthFor);
