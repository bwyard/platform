import type { Component } from 'svelte';
interface Props {
  value: string;
  disabled?: boolean;
  class?: string;
  ref?: HTMLButtonElement | null;
  [key: string]: unknown;
}
declare const RadioGroupItem: Component<Props>;
export default RadioGroupItem;
