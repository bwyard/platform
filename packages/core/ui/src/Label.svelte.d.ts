import type { Component, Snippet } from 'svelte';

interface Props {
  for?: string;
  class?: string;
  ref?: HTMLElement | null;
  children?: Snippet;
}

declare const Label: Component<Props>;
export default Label;
