import type { Component } from 'svelte';
interface Props { value?: string; placeholder?: string; disabled?: boolean; class?: string; ref?: HTMLInputElement | null; [key: string]: unknown; }
declare const ComboboxInput: Component<Props>;
export default ComboboxInput;
