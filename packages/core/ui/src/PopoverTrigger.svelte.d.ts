import type { Component, Snippet } from 'svelte';
interface Props {
  ref?: HTMLButtonElement | null;
  children?: Snippet;
  [key: string]: unknown;
}
declare const PopoverTrigger: Component<Props>;
export default PopoverTrigger;
