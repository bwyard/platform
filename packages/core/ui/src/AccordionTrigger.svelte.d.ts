import type { Component, Snippet } from 'svelte';
interface Props {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  class?: string;
  ref?: HTMLElement | null;
  children?: Snippet;
  [key: string]: unknown;
}
declare const AccordionTrigger: Component<Props>;
export default AccordionTrigger;
