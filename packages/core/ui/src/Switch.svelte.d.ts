import type { Component } from 'svelte';

interface Props {
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  class?: string;
  ref?: HTMLButtonElement | null;
  onCheckedChange?: (checked: boolean) => void;
}

declare const Switch: Component<Props>;
export default Switch;
