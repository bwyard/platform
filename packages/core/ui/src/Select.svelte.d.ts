import type { Component, Snippet } from 'svelte';
interface Props {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  open?: boolean;
  children?: Snippet;
}
declare const Select: Component<Props>;
export default Select;
