import type { Component, Snippet } from 'svelte';

interface Props {
	ref?: HTMLElement | null;
	class?: string;
	children?: Snippet;
	[key: string]: unknown;
}

declare const DialogContent: Component<Props>;
export default DialogContent;
