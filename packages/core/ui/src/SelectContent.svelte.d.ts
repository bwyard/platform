import type { Component, Snippet } from 'svelte';
interface Props {
  ref?: HTMLElement | null;
  sideOffset?: number;
  class?: string;
  children?: Snippet;
  [key: string]: unknown;
}
declare const SelectContent: Component<Props>;
export default SelectContent;
