import type { Component, Snippet } from 'svelte';

interface Props {
	variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info';
	class?: string;
	children?: Snippet;
	[key: string]: unknown;
}

declare const Alert: Component<Props>;
export default Alert;
