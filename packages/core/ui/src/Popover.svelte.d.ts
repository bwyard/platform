import type { Component, Snippet } from 'svelte';
interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: Snippet;
}
declare const Popover: Component<Props>;
export default Popover;
