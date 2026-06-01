import type { Component, Snippet } from 'svelte';
interface Props {
  ref?: HTMLButtonElement | null;
  children?: Snippet;
  [key: string]: unknown;
}
declare const SheetTrigger: Component<Props>;
export default SheetTrigger;
