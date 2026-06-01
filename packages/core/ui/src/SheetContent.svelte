<script lang="ts" module>
  export type SheetSide = 'top' | 'right' | 'bottom' | 'left';
</script>

<script lang="ts">
  // ============================================================
  // SheetContent — slide-in panel (bits-ui Dialog.Content with side positioning)
  // ============================================================
  import { Dialog as SheetPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    ref?: HTMLElement | null;
    side?: SheetSide;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };

  let {
    ref = $bindable(null),
    side = 'right',
    class: className,
    children,
    ...restProps
  }: Props = $props();
</script>

<SheetPrimitive.Portal>
  <SheetPrimitive.Overlay
    class="fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 duration-200"
  />
  <SheetPrimitive.Content
    bind:ref
    data-slot="sheet-content"
    data-side={side}
    class={[
      'bg-popover text-popover-foreground fixed z-50 flex flex-col gap-4 bg-clip-padding text-sm shadow-lg',
      'transition duration-200 ease-in-out outline-none',
      'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
      'data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:sm:max-w-sm',
      'data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:sm:max-w-sm',
      'data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b',
      'data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t',
      'data-[side=right]:data-open:slide-in-from-right-10 data-[side=left]:data-open:slide-in-from-left-10',
      'data-[side=top]:data-open:slide-in-from-top-10 data-[side=bottom]:data-open:slide-in-from-bottom-10',
      'data-[side=right]:data-closed:slide-out-to-right-10 data-[side=left]:data-closed:slide-out-to-left-10',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...restProps}
  >
    {@render children?.()}
  </SheetPrimitive.Content>
</SheetPrimitive.Portal>
