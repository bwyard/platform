<script lang="ts">
  // ============================================================
  // Label — form label backed by bits-ui Label.Root
  // Wires htmlFor via bits-ui for proper ARIA association.
  // ============================================================
  import { tv } from 'tailwind-variants';
  import { Label as LabelPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  const labelStyles = tv({
    base: 'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
  });

  type Props = {
    for?: string;
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
  };

  let {
    for: htmlFor,
    class: className,
    ref = $bindable(null),
    children,
    ...restProps
  }: Props = $props();
</script>

<LabelPrimitive.Root
  bind:ref
  data-slot="label"
  for={htmlFor}
  class={labelStyles({ class: className })}
  {...restProps}
>
  {@render children?.()}
</LabelPrimitive.Root>
