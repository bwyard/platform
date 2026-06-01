import type { Component } from 'svelte';

interface Props {
	orientation?: 'horizontal' | 'vertical';
	decorative?: boolean;
	class?: string;
	ref?: HTMLElement | null;
}

declare const Separator: Component<Props>;
export default Separator;
