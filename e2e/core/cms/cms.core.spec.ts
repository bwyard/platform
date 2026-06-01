import { test, expect } from '../../fixtures';
import { config } from '../../config';

test('unauthenticated user is redirected to login', async ({ unauthedPage }) => {
  await test.step('navigate unauthenticated', async () => {
    await unauthedPage.goto(`${config.urls.cms}/pages`);
    await expect(unauthedPage).toHaveURL(/login/);
  });
});
