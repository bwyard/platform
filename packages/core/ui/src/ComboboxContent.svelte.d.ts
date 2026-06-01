import type { Component, Snippet } from 'svelte';
interface Props {
  ref?: HTMLElement | null;
  sideOffset?: number;
  class?: string;
  children?: Snippet;
  [key: string]: unknown;
}
declare const ComboboxContent: Component<Props>;
export default ComboboxContent;
