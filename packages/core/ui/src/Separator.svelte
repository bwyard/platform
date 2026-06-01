<script lang="ts">
  // ============================================================
  // Separator — visual divider backed by bits-ui Separator.Root
  // orientation="horizontal" (default) | "vertical"
  // ============================================================
  import { Separator as SeparatorPrimitive } from 'bits-ui';
  import { tv } from 'tailwind-variants';

  const separatorStyles = tv({
    base: 'bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px',
  });

  type Props = {
    orientation?: 'horizontal' | 'vertical';
    decorative?: boolean;
    class?: string;
    ref?: HTMLElement | null;
  };

  let {
    orientation = 'horizontal',
    decorative = true,
    class: className,
    ref = $bindable(null),
    ...restProps
  }: Props = $props();
</script>

<SeparatorPrimitive.Root
  bind:ref
  data-slot="separator"
  {orientation}
  {decorative}
  class={separatorStyles({ class: className })}
  {...restProps}
/>
