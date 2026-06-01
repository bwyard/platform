import type { Component } from 'svelte';

interface Props {
  value?: number;
  max?: number;
  class?: string;
  ref?: HTMLElement | null;
}

declare const Progress: Component<Props>;
export default Progress;
