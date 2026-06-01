<script lang="ts">
  // ============================================================
  // DialogContent — bits-ui Dialog.Content wrapper
  // Renders portal + overlay + content automatically.
  // Compose children with DialogTitle, DialogDescription, DialogClose.
  // ============================================================
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import DialogOverlay from './DialogOverlay.svelte';
  import type { Snippet } from 'svelte';

  type Props = {
    ref?: HTMLElement | null;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<DialogPrimitive.Portal>
  <DialogOverlay />
  <DialogPrimitive.Content
    bind:ref
    data-slot="dialog-content"
    class={[
      'bg-popover text-popover-foreground ring-foreground/10',
      'fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2',
      'max-w-[calc(100%-2rem)] gap-4 rounded-xl p-4 text-sm ring-1 outline-none sm:max-w-sm',
      'data-open:animate-in data-closed:animate-out',
      'data-closed:fade-out-0 data-open:fade-in-0',
      'data-closed:zoom-out-95 data-open:zoom-in-95',
      'duration-100',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...restProps}
  >
    {@render children?.()}
  </DialogPrimitive.Content>
</DialogPrimitive.Portal>
