import { test, expect } from './fixtures';
import { loginPage } from './pages/login.page';
import { createMessagesPage } from './pages/crm/messages.page';
import { createClientEditPage } from './pages/crm/client-edit.page';
import { createProjectDetailPage } from './pages/crm/project-detail.page';

const SEED_CLIENT_ID = 'client-example';
const SEED_PROJECT_ID = 'project-example';

test.describe('crm — client management', () => {
  test('clients section loads', async ({ page, urls }) => {
    await page.goto(`${urls.crm}/clients`);
    await expect(page).toHaveURL(/clients/);
  });

  test('unauthenticated user is redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.crm}/clients`);
    await expect(unauthedPage).toHaveURL(/login/);
  });

  test('admin can log in via UI', async ({ unauthedPage, urls, credentials }) => {
    const login = loginPage(unauthedPage);
    await login.fillAndSubmit(urls.crm, credentials.admin.email, credentials.admin.password);
    await expect(unauthedPage).toHaveURL(/\/clients/, { timeout: 15_000 });
  });
});

test.describe('crm — messages', () => {
  test('messages page loads for a client', async ({ page, urls }) => {
    const messages = createMessagesPage(page, urls.crm, SEED_CLIENT_ID);
    await messages.goto();
    await expect(messages.thread()).toBeVisible();
  });

  test('shows empty state when no messages', async ({ page, urls }) => {
    const messages = createMessagesPage(page, urls.crm, SEED_CLIENT_ID);
    await messages.goto();
    const count = await messages.messageItems().count();
    if (count === 0) {
      await expect(messages.emptyState()).toBeVisible();
    }
  });

  test('admin can send a reply', async ({ page, urls }) => {
    const messages = createMessagesPage(page, urls.crm, SEED_CLIENT_ID);
    await messages.goto();
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
    const messages = createMessagesPage(page, urls.crm, SEED_CLIENT_ID);
    await expect(messages.messagesLink()).toBeVisible();
  });
});

test.describe('crm — client edit', () => {
  test('edit page loads with client data', async ({ page, urls }) => {
    const edit = createClientEditPage(page, urls.crm, SEED_CLIENT_ID);
    await edit.goto();
    await expect(edit.nameInput()).toBeVisible();
    await expect(edit.saveButton()).toBeVisible();
  });

  test('client detail has edit link', async ({ page, urls }) => {
    await page.goto(`${urls.crm}/clients/${SEED_CLIENT_ID}`);
    const edit = createClientEditPage(page, urls.crm, SEED_CLIENT_ID);
    await expect(edit.editLink()).toBeVisible();
  });

  test('archive shows confirm step', async ({ page, urls }) => {
    const edit = createClientEditPage(page, urls.crm, SEED_CLIENT_ID);
    await edit.goto();
    await edit.archiveTrigger().click();
    await expect(edit.archiveConfirm()).toBeVisible();
  });

  test('unauthenticated redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.crm}/clients/${SEED_CLIENT_ID}/edit`);
    await expect(unauthedPage).toHaveURL(/login/);
  });
});

test.describe('crm — project detail', () => {
  test('project detail page loads', async ({ page, urls }) => {
    const project = createProjectDetailPage(page, urls.crm, SEED_PROJECT_ID);
    await project.goto();
    await expect(project.heading()).toBeVisible();
  });

  test('edit toggle shows edit form', async ({ page, urls }) => {
    const project = createProjectDetailPage(page, urls.crm, SEED_PROJECT_ID);
    await project.goto();
    await project.editToggle().click();
    await expect(project.nameInput()).toBeVisible();
    await expect(project.saveButton()).toBeVisible();
  });

  test('unauthenticated redirected to login', async ({ unauthedPage, urls }) => {
    await unauthedPage.goto(`${urls.crm}/projects/${SEED_PROJECT_ID}`);
    await expect(unauthedPage).toHaveURL(/login/);
  });
});
