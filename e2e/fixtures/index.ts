import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { config } from '../config';

interface Fixtures {
  urls: typeof config.urls;
  credentials: typeof config.credentials;
  unauthedPage: Page;
}

const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  urls: async ({}, use) => use(config.urls),
  // eslint-disable-next-line no-empty-pattern
  credentials: async ({}, use) => use(config.credentials),
  unauthedPage: async ({ browser }, use) => {
    // Explicitly clear cookies — localhost cookies (domain: 'localhost') are shared
    // across Chromium contexts, so we must explicitly zero them out.
    const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
});

export { test };
export { expect } from '@playwright/test';
