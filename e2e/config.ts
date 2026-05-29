const optional = (key: string, fallback: string): string => process.env[key] ?? fallback;

export const config = {
  urls: {
    api: optional('E2E_API_URL', 'http://localhost:3010'),
    web: optional('E2E_WEB_URL', 'http://localhost:3011'),
    cms: optional('E2E_CMS_URL', 'http://localhost:3012'),
    crm: optional('E2E_CRM_URL', 'http://localhost:3013'),
    portal: optional('E2E_PORTAL_URL', 'http://localhost:3014'),
    portfolio: optional('E2E_PORTFOLIO_URL', 'http://localhost:3015'),
  },
  credentials: {
    admin: {
      email: optional('E2E_ADMIN_EMAIL', 'bree@8ofwands.com'),
      password: optional('E2E_ADMIN_PASSWORD', ''),
    },
  },
} as const;

export type Config = typeof config;
