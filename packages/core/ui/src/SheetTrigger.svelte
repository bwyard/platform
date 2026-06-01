<script lang="ts">
  import { Dialog as SheetPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = { ref?: HTMLButtonElement | null; children?: Snippet; [key: string]: unknown };
  let { ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<SheetPrimitive.Trigger bind:ref data-slot="sheet-trigger" {...restProps}>
  {@render children?.()}
</SheetPrimitive.Trigger>
