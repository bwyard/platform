<script lang="ts">
  import { Tooltip as TooltipPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = { ref?: HTMLElement | null; children?: Snippet; [key: string]: unknown };
  let { ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<TooltipPrimitive.Trigger bind:ref data-slot="tooltip-trigger" {...restProps}>
  {@render children?.()}
</TooltipPrimitive.Trigger>
