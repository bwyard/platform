import type { Component, Snippet } from 'svelte';
interface Props {
  value: string;
  class?: string;
  ref?: HTMLElement | null;
  children?: Snippet;
  [key: string]: unknown;
}
declare const TabsContent: Component<Props>;
export default TabsContent;
