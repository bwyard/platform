<script lang="ts">
  import { Tooltip as TooltipPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    ref?: HTMLElement | null;
    class?: string;
    sideOffset?: number;
    side?: 'top' | 'right' | 'bottom' | 'left';
    children?: Snippet;
    [key: string]: unknown;
  };

  let {
    ref = $bindable(null),
    class: className,
    sideOffset = 4,
    side = 'top',
    children,
    ...restProps
  }: Props = $props();
</script>

<TooltipPrimitive.Portal>
  <TooltipPrimitive.Content
    bind:ref
    data-slot="tooltip-content"
    {sideOffset}
    {side}
    class={[
      'bg-foreground text-background z-50 inline-flex w-fit max-w-xs items-center',
      'rounded-md px-3 py-1.5 text-xs',
      'data-open:animate-in data-closed:animate-out',
      'data-closed:fade-out-0 data-open:fade-in-0',
      'data-closed:zoom-out-95 data-open:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...restProps}
  >
    {@render children?.()}
  </TooltipPrimitive.Content>
</TooltipPrimitive.Portal>
