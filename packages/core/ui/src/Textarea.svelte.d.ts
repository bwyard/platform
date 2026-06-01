import type { Component } from 'svelte';
import type { HTMLTextareaAttributes } from 'svelte/elements';

interface Props extends HTMLTextareaAttributes {
  class?: string;
  ref?: HTMLTextAreaElement | null;
}

declare const Textarea: Component<Props>;
export default Textarea;
