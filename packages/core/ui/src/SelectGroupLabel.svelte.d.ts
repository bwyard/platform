import type { Component, Snippet } from 'svelte';
interface Props {
  class?: string;
  children?: Snippet;
  [key: string]: unknown;
}
declare const SelectGroupLabel: Component<Props>;
export default SelectGroupLabel;
