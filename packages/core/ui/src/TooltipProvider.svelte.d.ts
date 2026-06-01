import type { Component, Snippet } from 'svelte';
interface Props { delayDuration?: number; children?: Snippet; }
declare const TooltipProvider: Component<Props>;
export default TooltipProvider;
