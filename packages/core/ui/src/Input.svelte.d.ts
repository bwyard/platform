import type { Component } from 'svelte';
import type { HTMLInputAttributes } from 'svelte/elements';

interface Props extends HTMLInputAttributes {
  class?: string;
  ref?: HTMLInputElement | null;
}

declare const Input: Component<Props>;
export default Input;
