import type { Component, Snippet } from 'svelte';
interface Props {
  ref?: HTMLButtonElement | null;
  class?: string;
  children?: Snippet;
  [key: string]: unknown;
}
declare const SheetClose: Component<Props>;
export default SheetClose;
