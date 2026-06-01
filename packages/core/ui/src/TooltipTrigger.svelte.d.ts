import type { Component, Snippet } from 'svelte';
interface Props {
  ref?: HTMLElement | null;
  children?: Snippet;
  [key: string]: unknown;
}
declare const TooltipTrigger: Component<Props>;
export default TooltipTrigger;
