import type { Component, Snippet } from 'svelte';

interface Props {
  ref?: HTMLElement | null;
  class?: string;
  children?: Snippet;
  [key: string]: unknown;
}
declare const DialogDescription: Component<Props>;
export default DialogDescription;
