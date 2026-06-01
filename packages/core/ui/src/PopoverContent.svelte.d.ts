import type { Component, Snippet } from 'svelte';
interface Props {
  ref?: HTMLElement | null;
  class?: string;
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
  children?: Snippet;
  [key: string]: unknown;
}
declare const PopoverContent: Component<Props>;
export default PopoverContent;
