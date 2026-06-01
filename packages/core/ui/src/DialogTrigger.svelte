<script lang="ts">
  // ============================================================
  // DialogTrigger — bits-ui Dialog.Trigger wrapper
  // ============================================================
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    ref?: HTMLButtonElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {...restProps}>
  {@render children?.()}
</DialogPrimitive.Trigger>
