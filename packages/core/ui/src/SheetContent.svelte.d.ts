import type { Component, Snippet } from 'svelte';
export type { SheetSide } from './SheetContent.svelte';
interface Props { ref?: HTMLElement | null; side?: 'top' | 'right' | 'bottom' | 'left'; class?: string; children?: Snippet; [key: string]: unknown; }
declare const SheetContent: Component<Props>;
export default SheetContent;
