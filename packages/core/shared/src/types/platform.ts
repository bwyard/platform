// ============================================================
// Platform types — sub-type and feature vocabulary
// ============================================================

export type PlatformType = 'platform' | 'marketplace' | 'ecommerce' | 'membership' | 'community';

export type PlatformFeature =
  | 'cms'
  | 'client-portal'
  | 'billing'
  | 'messaging'
  | 'notifications'
  | 'search'
  | 'roles'
  | 'i18n'
  | 'gdpr'
  | 'analytics'
  | 'audit'
  | 'maintenance'
  | 'flags'
  | 'pwa';

export interface PlatformConfig {
  name: string;
  type: PlatformType;
  features: PlatformFeature[];
  locale: string;
  timezone: string;
}
