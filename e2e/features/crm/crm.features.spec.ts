import { test, expect } from '../../fixtures';
import { crmApp } from '../../poms/crm';
import { config } from '../../config';

const SEED_CLIENT_ID = 'client-example';
const SEED_PROJECT_ID = 'project-example';

test.describe('dashboard', () => {
  test('stat cards are visible', async ({ page }) => {
    const app = crmApp(page);

    await test.step('load dashboard', async () => {
      await app.dashboard.goto();
    });

    await test.step('verify stat cards', async () => {
      await expect(app.dashboard.statCard('total-clients')).toBeVisible();
      await expect(app.dashboard.statCard('active')).toBeVisible();
      await expect(app.dashboard.statCard('prospects')).toBeVisible();
      await expect(app.dashboard.statCard('unread-messages')).toBeVisible();
    });
  });

  test('recent clients table is visible', async ({ page }) => {
    const app = crmApp(page);

    await test.step('load dashboard', () => app.dashboard.goto());
    await expect(app.dashboard.recentClients()).toBeVisible();
  });
});

test.describe('clients', () => {
  test('search filters rows', async ({ page }) => {
    const app = crmApp(page);

    await test.step('load clients', () => app.clients.goto());

    await test.step('search and confirm results', async () => {
      await app.clients.search('example');
      await expect(app.clients.rows().first()).toBeVisible();
    });
  });

  test('status filter is shown', async ({ page }) => {
    const app = crmApp(page);

    await test.step('load clients', () => app.clients.goto());
    await expect(app.clients.filterBy('all')).toBeVisible();
  });
});

test.describe('messages', () => {
  test('empty state shown when no messages', async ({ page }) => {
    const app = crmApp(page);

    await test.step('open client messages', () => app.messages.goto(SEED_CLIENT_ID));

    await test.step('check empty or thread state', async () => {
      const count = await app.messages.items().count();
      if (count === 0) {
        await expect(app.messages.emptyState()).toBeVisible();
      }
    });
  });

  test('client detail shows messages link', async ({ page }) => {
    const app = crmApp(page);

    await test.step('navigate to client detail', async () => {
      await page.goto(`${config.urls.crm}/clients/${SEED_CLIENT_ID}`);
    });

    await expect(app.messages.messagesLink()).toBeVisible();
  });
});

test.describe('client edit', () => {
  test('edit page loads with form fields', async ({ page }) => {
    const app = crmApp(page);

    await test.step('open edit page', () => app.clientEdit.goto(SEED_CLIENT_ID));

    await test.step('verify form fields', async () => {
      await expect(app.clientEdit.nameInput()).toBeVisible();
      await expect(app.clientEdit.saveButton()).toBeVisible();
    });
  });

  test('client detail has edit link', async ({ page }) => {
    const app = crmApp(page);

    await test.step('navigate to client detail', async () => {
      await page.goto(`${config.urls.crm}/clients/${SEED_CLIENT_ID}`);
    });

    await expect(app.clientEdit.editLink()).toBeVisible();
  });

  test('archive action shows confirm step', async ({ page }) => {
    const app = crmApp(page);

    await test.step('open edit page', () => app.clientEdit.goto(SEED_CLIENT_ID));

    await test.step('trigger archive and confirm prompt', async () => {
      await expect(async () => {
        await app.clientEdit.archiveTrigger().click();
        await expect(app.clientEdit.archiveConfirm()).toBeVisible({ timeout: 2_000 });
      }).toPass({ timeout: 15_000 });
    });
  });
});

test.describe('project detail', () => {
  test('edit toggle reveals form', async ({ page }) => {
    const app = crmApp(page);

    await test.step('open project detail', () => app.projectDetail.goto(SEED_PROJECT_ID));

    await test.step('toggle edit and verify fields', async () => {
      await expect(async () => {
        await app.projectDetail.editToggle().click();
        await expect(app.projectDetail.nameInput()).toBeVisible({ timeout: 2_000 });
      }).toPass({ timeout: 15_000 });
      await expect(app.projectDetail.saveButton()).toBeVisible();
    });
  });
});
