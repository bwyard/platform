import type { Component, Snippet } from 'svelte';
interface Props {
  value: string;
  label?: string;
  disabled?: boolean;
  class?: string;
  ref?: HTMLElement | null;
  children?: Snippet;
  [key: string]: unknown;
}
declare const SelectItem: Component<Props>;
export default SelectItem;
