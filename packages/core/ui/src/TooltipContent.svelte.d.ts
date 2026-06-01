import type { Component, Snippet } from 'svelte';
interface Props {
  ref?: HTMLElement | null;
  class?: string;
  sideOffset?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  children?: Snippet;
  [key: string]: unknown;
}
declare const TooltipContent: Component<Props>;
export default TooltipContent;
