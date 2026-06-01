<script lang="ts">
  import { Tooltip as TooltipPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = { open?: boolean; onOpenChange?: (open: boolean) => void; children?: Snippet };
  let { open = $bindable(false), onOpenChange, children }: Props = $props();
</script>

<TooltipPrimitive.Root bind:open {onOpenChange}>
  {@render children?.()}
</TooltipPrimitive.Root>
