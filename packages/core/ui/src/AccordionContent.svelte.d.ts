import type { Component, Snippet } from 'svelte';
interface Props {
  class?: string;
  ref?: HTMLElement | null;
  children?: Snippet;
  [key: string]: unknown;
}
declare const AccordionContent: Component<Props>;
export default AccordionContent;
