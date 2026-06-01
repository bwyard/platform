import type { Component } from 'svelte';

interface Props {
	src?: string;
	alt?: string;
	class?: string;
	ref?: HTMLImageElement | null;
}

declare const AvatarImage: Component<Props>;
export default AvatarImage;
