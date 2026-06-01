<script lang="ts">
  import { Popover as PopoverPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    ref?: HTMLButtonElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };
  let { ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<PopoverPrimitive.Trigger bind:ref data-slot="popover-trigger" {...restProps}>
  {@render children?.()}
</PopoverPrimitive.Trigger>
