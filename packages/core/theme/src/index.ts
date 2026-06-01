/**
 * @breeyard/theme — TypeScript token types
 *
 * These types enumerate every CSS custom property defined in theme.css / dark.css.
 * Use them to build type-safe theme editor UIs or to reference tokens programmatically.
 *
 * In Svelte components, use Tailwind utilities directly:
 *   bg-primary, text-foreground, border-border, etc.
 * Do NOT import these types in component files — they are for theme management tooling only.
 */

export type ColorToken =
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'border'
  | 'input'
  | 'ring'
  | 'success'
  | 'success-foreground'
  | 'warning'
  | 'warning-foreground'
  | 'info'
  | 'info-foreground'
  | 'sidebar'
  | 'sidebar-foreground'
  | 'sidebar-primary'
  | 'sidebar-primary-foreground'
  | 'sidebar-accent'
  | 'sidebar-accent-foreground'
  | 'sidebar-border'
  | 'sidebar-ring';

export type RadiusToken = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type StatusToken = 'success' | 'warning' | 'info' | 'destructive';

/** All tokens grouped for theme editor enumeration */
export const COLOR_TOKENS = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'success',
  'success-foreground',
  'warning',
  'warning-foreground',
  'info',
  'info-foreground',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const satisfies ColorToken[];

export const RADIUS_TOKENS = ['sm', 'md', 'lg', 'xl', 'full'] as const satisfies RadiusToken[];

/** Produce the CSS variable reference string for a color token */
export const colorVar = (token: ColorToken): string => `var(--color-${token})`;

/** Produce the CSS variable reference string for a radius token */
export const radiusVar = (token: RadiusToken): string => `var(--radius-${token})`;
