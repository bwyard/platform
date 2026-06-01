import type { Component, Snippet } from 'svelte';
interface Props {
  value?: string;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  required?: boolean;
  class?: string;
  ref?: HTMLElement | null;
  children?: Snippet;
  [key: string]: unknown;
}
declare const RadioGroup: Component<Props>;
export default RadioGroup;
