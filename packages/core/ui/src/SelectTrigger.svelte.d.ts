import type { Component, Snippet } from 'svelte';
interface Props {
  size?: 'sm' | 'md';
  disabled?: boolean;
  class?: string;
  ref?: HTMLButtonElement | null;
  children?: Snippet;
  [key: string]: unknown;
}
declare const SelectTrigger: Component<Props>;
export default SelectTrigger;
