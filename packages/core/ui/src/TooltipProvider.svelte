<script lang="ts">
  import { Tooltip as TooltipPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = { delayDuration?: number; children?: Snippet };
  let { delayDuration = 700, children }: Props = $props();
</script>

<TooltipPrimitive.Provider {delayDuration}>
  {@render children?.()}
</TooltipPrimitive.Provider>
