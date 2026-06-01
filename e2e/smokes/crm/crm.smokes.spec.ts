import { test, expect } from '../../fixtures';
import { crmApp } from '../../poms/crm';

const SEED_CLIENT_ID = 'client-example';
const SEED_PROJECT_ID = 'project-example';

test('dashboard is reachable', async ({ page }) => {
  const app = crmApp(page);

  await test.step('load dashboard', async () => {
    await app.dashboard.goto();
    await expect(app.dashboard.heading()).toBeVisible();
  });
});

test('clients list is accessible', async ({ page }) => {
  const app = crmApp(page);

  await test.step('load clients', async () => {
    await app.clients.goto();
    await expect(app.clients.table()).toBeVisible();
  });
});

test('messages page loads for a client', async ({ page }) => {
  const app = crmApp(page);

  await test.step('open client messages', async () => {
    await app.messages.goto(SEED_CLIENT_ID);
    await expect(app.messages.thread()).toBeVisible();
  });
});

test('project detail page loads', async ({ page }) => {
  const app = crmApp(page);

  await test.step('open project detail', async () => {
    await app.projectDetail.goto(SEED_PROJECT_ID);
    await expect(app.projectDetail.heading()).toBeVisible();
  });
});
