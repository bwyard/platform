<script lang="ts">
  // ============================================================
  // DialogOverlay — bits-ui Dialog.Overlay with backdrop styling
  // ============================================================
  import { Dialog as DialogPrimitive } from 'bits-ui';

  type Props = {
    ref?: HTMLElement | null;
    class?: string;
  };

  let { ref = $bindable(null), class: className }: Props = $props();
</script>

<DialogPrimitive.Overlay
  bind:ref
  data-slot="dialog-overlay"
  class={[
    'fixed inset-0 isolate z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs',
    'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 duration-100',
    className,
  ]
    .filter(Boolean)
    .join(' ')}
/>
