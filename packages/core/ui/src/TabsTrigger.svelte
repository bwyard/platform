<script lang="ts">
  import { Tabs as TabsPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    value: string;
    disabled?: boolean;
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };

  let {
    value,
    disabled,
    class: className,
    ref = $bindable(null),
    children,
    ...restProps
  }: Props = $props();
</script>

<TabsPrimitive.Trigger
  bind:ref
  {value}
  {disabled}
  data-slot="tabs-trigger"
  class={[
    'text-foreground/60 hover:text-foreground relative inline-flex h-[calc(100%-2px)] flex-1 items-center justify-center',
    'gap-1.5 whitespace-nowrap rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium',
    'transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
    'data-active:bg-background data-active:text-foreground data-active:shadow-sm',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
    className,
  ]
    .filter(Boolean)
    .join(' ')}
  {...restProps}
>
  {@render children?.()}
</TabsPrimitive.Trigger>
