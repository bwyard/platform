// =============================================================================
// @breeyard/security
//
// Security primitives: CSP builder, HSTS, CSRF, CORS, and a composable
// securityHeaders() Handle for SvelteKit hooks.server.ts.
//
// BOUNDARY: all security header I/O and CSRF logic lives here.
// Apps and packages never set security headers directly.
// =============================================================================

import type { Handle, RequestEvent } from '@sveltejs/kit';

// =============================================================================
// Types
// =============================================================================

export interface CspDirectives {
  readonly defaultSrc?: readonly string[];
  readonly scriptSrc?: readonly string[];
  readonly styleSrc?: readonly string[];
  readonly imgSrc?: readonly string[];
  readonly fontSrc?: readonly string[];
  readonly connectSrc?: readonly string[];
  readonly frameSrc?: readonly string[];
  readonly frameAncestors?: readonly string[];
  readonly objectSrc?: readonly string[];
  readonly baseUri?: readonly string[];
  readonly formAction?: readonly string[];
  readonly upgradeInsecureRequests?: boolean;
}

export interface SecurityOptions {
  readonly csp?: CspDirectives;
  readonly hstsMaxAge?: number;
  readonly hstsIncludeSubDomains?: boolean;
  readonly referrerPolicy?: string;
  readonly permissionsPolicy?: string;
}

export interface CorsOptions {
  readonly origin: string | readonly string[];
  readonly methods?: readonly string[];
  readonly headers?: readonly string[];
  readonly maxAge?: number;
}

// =============================================================================
// CSP builder
// =============================================================================

const buildCsp = (directives: CspDirectives): string => {
  const parts: string[] = [];

  const add = (key: string, values?: readonly string[]) => {
    if (values && values.length > 0) parts.push(`${key} ${values.join(' ')}`);
  };

  add('default-src', directives.defaultSrc ?? ["'self'"]);
  add('script-src', directives.scriptSrc ?? ["'self'"]);
  add('style-src', directives.styleSrc ?? ["'self'", "'unsafe-inline'"]);
  add('img-src', directives.imgSrc ?? ["'self'", 'data:', 'blob:', 'https:']);
  add('font-src', directives.fontSrc ?? ["'self'"]);
  add('connect-src', directives.connectSrc ?? ["'self'"]);
  add('frame-src', directives.frameSrc);
  add('frame-ancestors', directives.frameAncestors ?? ["'none'"]);
  add('object-src', directives.objectSrc ?? ["'none'"]);
  add('base-uri', directives.baseUri ?? ["'self'"]);
  add('form-action', directives.formAction ?? ["'self'"]);
  if (directives.upgradeInsecureRequests !== false) {
    parts.push('upgrade-insecure-requests');
  }

  return parts.join('; ');
};

// =============================================================================
// securityHeaders Handle factory
// =============================================================================

/**
 * SvelteKit Handle that applies security headers to every response.
 *
 * BOUNDARY: all security header writes are here.
 *
 * @example
 * ```ts
 * export const handle = sequence(securityHeaders(), sessionHandle)
 * ```
 */
export const securityHeaders =
  (options: SecurityOptions = {}): Handle =>
  async ({ event, resolve }) => {
    const response = await resolve(event);

    response.headers.set('Content-Security-Policy', buildCsp(options.csp ?? {}));

    const maxAge = options.hstsMaxAge ?? 31_536_000;
    if (maxAge > 0) {
      const includeSubDomains = options.hstsIncludeSubDomains !== false;
      response.headers.set(
        'Strict-Transport-Security',
        `max-age=${String(maxAge)}${includeSubDomains ? '; includeSubDomains' : ''}`,
      );
    }

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set(
      'Referrer-Policy',
      options.referrerPolicy ?? 'strict-origin-when-cross-origin',
    );
    response.headers.set(
      'Permissions-Policy',
      options.permissionsPolicy ?? 'camera=(), microphone=(), geolocation=()',
    );

    return response;
  };

// =============================================================================
// CORS Handle factory
// =============================================================================

/**
 * SvelteKit Handle that applies CORS headers and handles OPTIONS preflight.
 *
 * BOUNDARY: CORS policy enforcement. Review origin list before deploying.
 */
export const createCorsHandle = (options: CorsOptions): Handle => {
  const allowedMethods = options.methods ?? ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
  const allowedHeaders = options.headers ?? ['Content-Type', 'Authorization'];
  const maxAge = options.maxAge ?? 86_400;
  const resolvedOrigins: readonly string[] =
    typeof options.origin === 'string' ? [options.origin] : options.origin;

  const resolveOrigin = (requestOrigin: string | null): string => {
    if (!requestOrigin) return resolvedOrigins[0] ?? '*';
    if (resolvedOrigins.length === 1 && resolvedOrigins[0] === '*') return '*';
    return resolvedOrigins.includes(requestOrigin) ? requestOrigin : (resolvedOrigins[0] ?? '*');
  };

  return async ({ event, resolve }) => {
    const origin = resolveOrigin(event.request.headers.get('origin'));
    const methods = allowedMethods.join(', ');
    const headers = allowedHeaders.join(', ');

    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': methods,
          'Access-Control-Allow-Headers': headers,
          'Access-Control-Max-Age': String(maxAge),
        },
      });
    }

    const response = await resolve(event);
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', methods);
    response.headers.set('Access-Control-Allow-Headers', headers);
    return response;
  };
};

// =============================================================================
// CSRF utilities
// =============================================================================

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = 'csrf_token';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export const getCsrfToken = (event: RequestEvent): string | null =>
  event.request.headers.get(CSRF_HEADER) ?? event.cookies.get(CSRF_COOKIE) ?? null;

export const validateCsrf = (event: RequestEvent): boolean => {
  if (SAFE_METHODS.has(event.request.method)) return true;
  const header = event.request.headers.get(CSRF_HEADER);
  const cookie = event.cookies.get(CSRF_COOKIE);
  if (!header || !cookie) return false;
  return header === cookie;
};

export const csrfHandle: Handle = async ({ event, resolve }) => {
  if (!validateCsrf(event)) {
    return new Response('CSRF validation failed', { status: 403 });
  }
  return resolve(event);
};
