import type { Component, Snippet } from 'svelte';
interface Props { type?: 'single' | 'multiple'; value?: string | string[]; class?: string; ref?: HTMLElement | null; children?: Snippet; [key: string]: unknown; }
declare const Accordion: Component<Props>;
export default Accordion;
