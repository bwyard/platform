import type { Component, Snippet } from 'svelte';
interface Props {
  class?: string;
  children?: Snippet;
  [key: string]: unknown;
}
declare const SelectGroup: Component<Props>;
export default SelectGroup;
