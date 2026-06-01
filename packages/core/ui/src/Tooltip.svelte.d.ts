import type { Component, Snippet } from 'svelte';
interface Props { open?: boolean; onOpenChange?: (open: boolean) => void; children?: Snippet; }
declare const Tooltip: Component<Props>;
export default Tooltip;
