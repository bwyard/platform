<script lang="ts">
  import { Tabs as TabsPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { class: className, ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<TabsPrimitive.List
  bind:ref
  data-slot="tabs-list"
  class={[
    'bg-muted text-muted-foreground inline-flex w-fit items-center justify-center',
    'rounded-lg p-[3px] group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
    className,
  ]
    .filter(Boolean)
    .join(' ')}
  {...restProps}
>
  {@render children?.()}
</TabsPrimitive.List>
