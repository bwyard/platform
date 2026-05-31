// =============================================================================
// @breeyard/security — CORS + CSP + security header utilities
// Used in SvelteKit hooks.server.ts to apply headers globally
// =============================================================================

export interface CorsOptions {
  readonly origins: string[];
  readonly credentials: boolean;
}

export const buildCorsHeaders = (
  requestOrigin: string | null,
  options: CorsOptions,
): Record<string, string> => {
  const allowed =
    requestOrigin && options.origins.includes(requestOrigin)
      ? requestOrigin
      : (options.origins[0] ?? '');

  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Credentials': options.credentials ? 'true' : 'false',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  };
};

export const securityHeaders: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
