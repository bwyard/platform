import type { Page } from '@playwright/test';
import { config, type AppKey } from '../config';

export const goto = (page: Page, appKey: AppKey, path = ''): Promise<void> =>
  page.goto(`${config.urls[appKey]}${path}`).then(() => undefined);
