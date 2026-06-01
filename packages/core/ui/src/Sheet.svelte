<script lang="ts">
  // ============================================================
  // Sheet.Root — side panel backed by bits-ui Dialog
  // Compose with SheetTrigger, SheetContent, etc.
  // ============================================================
  import { Dialog as SheetPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = { open?: boolean; onOpenChange?: (open: boolean) => void; children?: Snippet };
  let { open = $bindable(false), onOpenChange, children }: Props = $props();
</script>

<SheetPrimitive.Root bind:open {onOpenChange}>
  {@render children?.()}
</SheetPrimitive.Root>
