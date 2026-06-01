import type { Component } from 'svelte';

interface Props {
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
  class?: string;
}

declare const EmptyState: Component<Props>;
export default EmptyState;
