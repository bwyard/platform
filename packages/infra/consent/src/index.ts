// @breeyard/consent — cookie banner + consent preference storage
// Always included in every deployment. Triggered by billing/marketing loading.
// TODO: implement banner component + preference store

export interface ConsentPreferences {
  readonly analytics: boolean;
  readonly marketing: boolean;
  readonly functional: boolean;
}

export const defaultConsent: ConsentPreferences = {
  analytics: false,
  marketing: false,
  functional: true,
};
