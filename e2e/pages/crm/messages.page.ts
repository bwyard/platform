import type { Page, Locator } from '@playwright/test';

export const messagesPage = (page: Page) => ({
  goto: (baseUrl: string, clientId: string): Promise<void> =>
    page.goto(`${baseUrl}/clients/${clientId}/messages`).then(() => undefined),
  heading: (): Locator => page.getByRole('heading', { name: /messages/i }),
  thread: (): Locator => page.getByTestId('message-thread'),
  messageItems: (): Locator => page.getByTestId('message-item'),
  replyInput: (): Locator => page.getByTestId('reply-input'),
  sendButton: (): Locator => page.getByTestId('reply-submit'),
  emptyState: (): Locator => page.getByTestId('messages-empty'),
  messagesLink: (): Locator => page.getByTestId('messages-link'),
  sendReply: async (text: string): Promise<void> => {
    await page.getByTestId('reply-input').waitFor({ state: 'visible' });
    await page.getByTestId('reply-input').fill(text);
    await page.getByTestId('reply-submit').click();
  },
});

export type MessagesPage = ReturnType<typeof messagesPage>;
