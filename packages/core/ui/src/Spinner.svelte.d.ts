import type { Component } from 'svelte';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  label?: string;
}

declare const Spinner: Component<Props>;
export default Spinner;
