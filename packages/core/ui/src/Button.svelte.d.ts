import type { Component, Snippet } from 'svelte';
import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
import { type ButtonVariant, type ButtonSize } from './Button.svelte';

export { buttonVariants, type ButtonVariant, type ButtonSize } from './Button.svelte';

interface Props
	extends Omit<HTMLButtonAttributes, 'class' | 'type' | 'disabled'>,
		Omit<HTMLAnchorAttributes, 'class' | 'href'> {
	variant?: ButtonVariant;
	size?: ButtonSize;
	href?: string;
	disabled?: boolean;
	type?: HTMLButtonAttributes['type'];
	class?: string;
	ref?: HTMLElement | null;
	children?: Snippet;
}

declare const Button: Component<Props>;
export default Button;
