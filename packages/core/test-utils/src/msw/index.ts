// =============================================================================
// @breeyard/test-utils/msw
//
// MSW (Mock Service Worker) server setup + shared handlers.
// Use in vitest.svelte setupFiles to intercept tRPC + fetch calls during
// component tests without a real server.
//
// Usage in setupFiles:
//   import { server } from '@breeyard/test-utils/msw'
//   beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
//   afterEach(() => server.resetHandlers())
//   afterAll(() => server.close())
// =============================================================================

import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// =============================================================================
// Base handlers — override per test with server.use(handler)
// =============================================================================

export const handlers = [
  // Health
  http.get('*/api/health', () => HttpResponse.json({ status: 'ok' })),
];

// =============================================================================
// Server instance
// =============================================================================

export const server = setupServer(...handlers);

// =============================================================================
// Re-exports for convenience
// =============================================================================

export { http, HttpResponse } from 'msw';
export type { HttpHandler } from 'msw';
