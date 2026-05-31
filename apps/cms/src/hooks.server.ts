// =============================================================================
// apps/cms — server hooks
// =============================================================================

import { sequence } from '@sveltejs/kit/hooks';
import { securityHeaders } from '@breeyard/security';

export const handle = sequence(securityHeaders());
