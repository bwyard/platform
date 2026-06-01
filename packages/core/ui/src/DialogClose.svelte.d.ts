import type { Component, Snippet } from 'svelte';

interface Props { ref?: HTMLButtonElement | null; class?: string; children?: Snippet; [key: string]: unknown; }
declare const DialogClose: Component<Props>;
export default DialogClose;
