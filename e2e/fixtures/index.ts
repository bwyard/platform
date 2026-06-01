import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';
import { config } from '../config';

interface Fixtures {
  urls: typeof config.urls;
  authedPage: Page;
  unauthedPage: Page;
}

const test = base.extend<Fixtures>({
  // eslint-disable-next-line no-empty-pattern
  urls: async ({}, use) => use(config.urls),
  // authedPage is the standard page fixture re-exported under an explicit name.
  // The project storageState (set in playwright.config.ts) provides auth.
  authedPage: async ({ page }, use) => use(page),
  unauthedPage: async ({ browser }, use) => {
    // Explicitly clear cookies — localhost cookies (domain: 'localhost') are shared
    // across Chromium contexts, so we must explicitly zero them out.
    const ctx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const freshPage = await ctx.newPage();
    await use(freshPage);
    await ctx.close();
  },
});

export { test };
export { expect } from '@playwright/test';
