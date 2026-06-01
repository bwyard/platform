<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    ref?: HTMLElement | null;
    sideOffset?: number;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  let {
    ref = $bindable(null),
    sideOffset = 4,
    class: className,
    children,
    ...restProps
  }: Props = $props();
</script>

<SelectPrimitive.Portal>
  <SelectPrimitive.Content
    bind:ref
    {sideOffset}
    data-slot="select-content"
    class={[
      'bg-popover text-popover-foreground ring-foreground/10',
      'relative isolate z-50 min-w-36 overflow-hidden rounded-lg shadow-md ring-1',
      'data-open:animate-in data-closed:animate-out',
      'data-closed:fade-out-0 data-open:fade-in-0',
      'data-closed:zoom-out-95 data-open:zoom-in-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
      'duration-100',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...restProps}
  >
    <SelectPrimitive.Viewport
      class="h-(--bits-select-anchor-height) w-full min-w-(--bits-select-anchor-width) p-1 scroll-my-1"
    >
      {@render children?.()}
    </SelectPrimitive.Viewport>
  </SelectPrimitive.Content>
</SelectPrimitive.Portal>
