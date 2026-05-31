// ============================================================
// better-auth catch-all handler
// ============================================================

import { getAuth } from '@breeyard/auth';
import type { RequestHandler } from './$types';

const handler: RequestHandler = ({ request }) => getAuth().handler(request);

export const GET = handler;
export const POST = handler;
