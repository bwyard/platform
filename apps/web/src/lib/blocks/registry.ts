// ============================================================
// Block registry — maps BlockType → Svelte component
// Add new block components here as they are built
// ============================================================

import type { Component } from 'svelte';
import type { BlockType } from '@breeyard/shared';

import ProfileBlock from './ProfileBlock.svelte';
import AboutBlock from './AboutBlock.svelte';
import ServicesBlock from './ServicesBlock.svelte';
import ContactBlock from './ContactBlock.svelte';
import TextBlock from './TextBlock.svelte';

export interface BlockProps {
  data: Record<string, unknown>;
}

export const blockRegistry: Partial<Record<BlockType, Component<BlockProps>>> = {
  profile: ProfileBlock,
  about: AboutBlock,
  services: ServicesBlock,
  contact: ContactBlock,
  text: TextBlock,
};
