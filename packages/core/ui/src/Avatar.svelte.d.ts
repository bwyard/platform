import type { Component, Snippet } from 'svelte';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  ref?: HTMLElement | null;
  children?: Snippet;
}

declare const Avatar: Component<Props>;
export default Avatar;
