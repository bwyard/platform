<script lang="ts">
  import { Dialog as SheetPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    ref?: HTMLButtonElement | null;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<SheetPrimitive.Close bind:ref data-slot="sheet-close" class={className} {...restProps}>
  {@render children?.()}
</SheetPrimitive.Close>
