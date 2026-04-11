// ============================================================
// Money utilities — amounts in cents throughout, no float math
// ============================================================

export const centsToDisplay = (cents: number, currency = 'USD'): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);

export const dollarsToCents = (dollars: number): number => Math.round(dollars * 100);

export const centsToDollars = (cents: number): number => cents / 100;
