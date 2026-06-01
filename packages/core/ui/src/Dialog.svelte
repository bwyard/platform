<script lang="ts">
  // ============================================================
  // Dialog.Root — backed by bits-ui Dialog.Root
  // Compose with DialogTrigger, DialogContent, etc.
  // ============================================================
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: Snippet;
  };

  let { open = $bindable(false), onOpenChange, children }: Props = $props();
</script>

<DialogPrimitive.Root bind:open {onOpenChange}>
  {@render children?.()}
</DialogPrimitive.Root>
