import type { Component, Snippet } from 'svelte';

interface Props {
  class?: string;
  ref?: HTMLElement | null;
  children?: Snippet;
}

declare const AvatarFallback: Component<Props>;
export default AvatarFallback;
