<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    ref?: HTMLButtonElement | null;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<DialogPrimitive.Close bind:ref data-slot="dialog-close" class={className} {...restProps}>
  {@render children?.()}
</DialogPrimitive.Close>
