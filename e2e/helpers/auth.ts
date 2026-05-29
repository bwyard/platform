import type { APIRequestContext } from '@playwright/test';

export const signInViaApi = async (
  request: APIRequestContext,
  apiUrl: string,
  email: string,
  password: string,
): Promise<void> => {
  const response = await request.post(`${apiUrl}/auth/sign-in/email`, {
    data: { email, password },
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.status() !== 200) {
    throw new Error(`Sign-in failed: ${response.status().toString()} ${await response.text()}`);
  }
};
