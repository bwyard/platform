import type { Component, Snippet } from 'svelte';
interface Props { value: string; disabled?: boolean; class?: string; ref?: HTMLElement | null; children?: Snippet; [key: string]: unknown; }
declare const TabsTrigger: Component<Props>;
export default TabsTrigger;
