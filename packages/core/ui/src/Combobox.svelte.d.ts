import type { Component, Snippet } from 'svelte';
interface Props {
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  children?: Snippet;
  [key: string]: unknown;
}
declare const Combobox: Component<Props>;
export default Combobox;
