import type { Component, Snippet } from 'svelte';
export { badgeVariants, type BadgeVariant } from './Badge.svelte';

interface Props {
	variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
	href?: string;
	class?: string;
	children?: Snippet;
	[key: string]: unknown;
}

declare const Badge: Component<Props>;
export default Badge;
