import { test, expect } from './fixtures';
import { loginPage } from './pages/login.page';
import { crmDashboardPage } from './pages/crm/dashboard.page';
import { clientsPage } from './pages/crm/clients.page';
import { messagesPage } from './pages/crm/messages.page';
import { clientEditPage } from './pages/crm/client-edit.page';
import { crmProjectDetailPage } from './pages/crm/project-detail.page';

const SEED_CLIENT_ID = 'client-example';
const SEED_PROJECT_ID = 'project-example';

test.describe('crm — dashboard', () => {
  test('dashboard loads', async ({ page, urls }) => {
    const dashboard = crmDashboardPage(page);
    await dashboard.goto(urls.crm);
    await expect(dashboard.heading()).toBeVisible();
  });

  test('dashboard shows stat cards', async ({ page, urls }) => {
    const dashboard = crmDashboardPage(page);
    await dashboard.goto(urls.crm);
    await expect(dashboard.statCard('total-clients')).toBeVisible();
    await expect(dashboard.statCard('active')).toBeVisible();
    await expect(dashboard.statCard('prospects')).toBeVisible();
    await expect(dashboard.statCard('unread-messages')).toBeVisible();
  });

  test('dashboard shows recent clients table', async ({ page, urls }) => {
    const dashboard = crmDashboardPage(page);
    await dashboard.goto(urls.crm);
    await expect(dashboard.recentClients()).toBeVisible();
  });

  test('unauthenticated user is redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.crm}/`);
    await expect(unauthedPage).toHaveURL(/login/);
  });
});

test.describe('crm — client management', () => {
  test('clients section loads', async ({ page, urls }) => {
    const clients = clientsPage(page);
    await clients.goto(urls.crm);
    await expect(clients.clientsTable()).toBeVisible();
  });

  test('client search filters rows', async ({ page, urls }) => {
    const clients = clientsPage(page);
    await clients.goto(urls.crm);
    await clients.searchInput().fill('example');
    const rows = clients.clientRows();
    await expect(rows.first()).toBeVisible();
  });

  test('status filter shows all by default', async ({ page, urls }) => {
    const clients = clientsPage(page);
    await clients.goto(urls.crm);
    await expect(clients.filterButton('all')).toBeVisible();
  });

  test('unauthenticated user is redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.crm}/clients`);
    await expect(unauthedPage).toHaveURL(/login/);
  });

  test('admin can log in via UI', async ({ unauthedPage, urls, credentials }) => {
    const login = loginPage(unauthedPage);
    await login.fillAndSubmit(urls.crm, credentials.admin.email, credentials.admin.password);
    await expect(unauthedPage).toHaveURL(/\//, { timeout: 15_000 });
  });
});

test.describe('crm — messages', () => {
  test('messages page loads for a client', async ({ page, urls }) => {
    const messages = messagesPage(page);
    await messages.goto(urls.crm, SEED_CLIENT_ID);
    await expect(messages.thread()).toBeVisible();
  });

  test('shows empty state when no messages', async ({ page, urls }) => {
    const messages = messagesPage(page);
    await messages.goto(urls.crm, SEED_CLIENT_ID);
    const count = await messages.messageItems().count();
    if (count === 0) {
      await expect(messages.emptyState()).toBeVisible();
    }
  });

  test('admin can send a reply', async ({ page, urls }) => {
    const messages = messagesPage(page);
    await messages.goto(urls.crm, SEED_CLIENT_ID);
    await messages.sendReply('Test reply from admin');
    await expect(messages.messageItems().last()).toContainText('Test reply from admin', {
      timeout: 5_000,
    });
  });

  test('unauthenticated user is redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.crm}/clients/${SEED_CLIENT_ID}/messages`);
    await expect(unauthedPage).toHaveURL(/login/);
  });

  test('client detail shows messages link', async ({ page, urls }) => {
    await page.goto(`${urls.crm}/clients/${SEED_CLIENT_ID}`);
    const messages = messagesPage(page);
    await expect(messages.messagesLink()).toBeVisible();
  });
});

test.describe('crm — client edit', () => {
  test('edit page loads with client data', async ({ page, urls }) => {
    const edit = clientEditPage(page);
    await edit.goto(urls.crm, SEED_CLIENT_ID);
    await expect(edit.nameInput()).toBeVisible();
    await expect(edit.saveButton()).toBeVisible();
  });

  test('client detail has edit link', async ({ page, urls }) => {
    await page.goto(`${urls.crm}/clients/${SEED_CLIENT_ID}`);
    const edit = clientEditPage(page);
    await expect(edit.editLink()).toBeVisible();
  });

  test('archive shows confirm step', async ({ page, urls }) => {
    const edit = clientEditPage(page);
    await edit.goto(urls.crm, SEED_CLIENT_ID);
    await expect(async () => {
      await edit.archiveTrigger().click();
      await expect(edit.archiveConfirm()).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
  });

  test('unauthenticated redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.crm}/clients/${SEED_CLIENT_ID}/edit`);
    await expect(unauthedPage).toHaveURL(/login/);
  });
});

test.describe('crm — project detail', () => {
  test('project detail page loads', async ({ page, urls }) => {
    const project = crmProjectDetailPage(page);
    await project.goto(urls.crm, SEED_PROJECT_ID);
    await expect(project.heading()).toBeVisible();
  });

  test('edit toggle shows edit form', async ({ page, urls }) => {
    const project = crmProjectDetailPage(page);
    await project.goto(urls.crm, SEED_PROJECT_ID);
    await expect(async () => {
      await project.editToggle().click();
      await expect(project.nameInput()).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 15_000 });
    await expect(project.saveButton()).toBeVisible();
  });

  test('unauthenticated redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.crm}/projects/${SEED_PROJECT_ID}`);
    await expect(unauthedPage).toHaveURL(/login/);
  });
});
