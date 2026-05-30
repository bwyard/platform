import type { Page } from '@playwright/test';

export const createMessagesPage = (page: Page, baseUrl: string, clientId: string) => {
  const goto = () => page.goto(`${baseUrl}/clients/${clientId}/messages`);
  const heading = () => page.getByRole('heading', { name: /messages/i });
  const thread = () => page.getByTestId('message-thread');
  const messageItems = () => page.getByTestId('message-item');
  const replyInput = () => page.getByTestId('reply-input');
  const sendButton = () => page.getByTestId('reply-submit');
  const emptyState = () => page.getByTestId('messages-empty');
  const messagesLink = () => page.getByTestId('messages-link');

  const sendReply = async (text: string) => {
    await replyInput().waitFor({ state: 'visible' });
    await replyInput().fill(text);
    await sendButton().click();
  };

  return {
    goto,
    heading,
    thread,
    messageItems,
    replyInput,
    sendButton,
    emptyState,
    messagesLink,
    sendReply,
  };
};
