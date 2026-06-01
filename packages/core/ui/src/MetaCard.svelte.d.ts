import type { Component } from 'svelte';

interface MetaItem {
  label: string;
  value: string | null | undefined;
}

interface Props {
  items: MetaItem[];
  class?: string;
}

declare const MetaCard: Component<Props>;
export default MetaCard;
