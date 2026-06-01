import type { Component, Snippet } from 'svelte';
interface Props {
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  class?: string;
  ref?: HTMLElement | null;
  children?: Snippet;
  [key: string]: unknown;
}
declare const Tabs: Component<Props>;
export default Tabs;
