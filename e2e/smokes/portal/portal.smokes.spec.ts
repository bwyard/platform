import { test, expect } from '../../fixtures';
import { portalApp } from '../../poms/portal';
import { sharedLoginPage } from '../../poms/shared/login.page';
import { config } from '../../config';

const SEED_PROJECT_ID = 'project-example';

test('login page loads', async ({ unauthedPage }) => {
  const login = sharedLoginPage(unauthedPage);

  await test.step('load login page', async () => {
    await login.goto(config.urls.portal);
    await expect(login.heading()).toBeVisible();
  });
});

test('unauthenticated root redirects to login', async ({ unauthedPage }) => {
  await test.step('navigate unauthenticated', async () => {
    await unauthedPage.goto(config.urls.portal);
    await expect(unauthedPage).toHaveURL(/login/);
  });
});

test('authenticated client can view projects', async ({ page }) => {
  const app = portalApp(page);

  await test.step('navigate to projects', async () => {
    await page.goto(`${config.urls.portal}/projects`);
    await expect(page).toHaveURL(/projects/);
  });

  await test.step('load project detail', async () => {
    await app.projectDetail.goto(SEED_PROJECT_ID);
    await expect(app.projectDetail.heading()).toBeVisible();
  });
});
