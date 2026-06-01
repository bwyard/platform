<script lang="ts">
  import { Tabs as TabsPrimitive } from 'bits-ui';
  import { tv } from 'tailwind-variants';
  import type { Snippet } from 'svelte';

  const tabsStyles = tv({ base: 'group/tabs flex gap-2 data-[orientation=horizontal]:flex-col' });

  type Props = {
    value?: string;
    orientation?: 'horizontal' | 'vertical';
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };

  let {
    value = $bindable(''),
    orientation = 'horizontal',
    class: className,
    ref = $bindable(null),
    children,
    ...restProps
  }: Props = $props();
</script>

<TabsPrimitive.Root
  bind:ref
  bind:value
  {orientation}
  data-slot="tabs"
  class={tabsStyles({ class: className })}
  {...restProps}
>
  {@render children?.()}
</TabsPrimitive.Root>
