import type { Component, Snippet } from 'svelte';

interface Props {
  ref?: HTMLElement | null;
  class?: string;
  children?: Snippet;
  [key: string]: unknown;
}
declare const DialogTitle: Component<Props>;
export default DialogTitle;
