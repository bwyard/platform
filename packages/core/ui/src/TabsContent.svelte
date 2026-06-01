<script lang="ts">
  import { Tabs as TabsPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    value: string;
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };
  let { value, class: className, ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<TabsPrimitive.Content
  bind:ref
  {value}
  data-slot="tabs-content"
  class={['flex-1 text-sm outline-none', className].filter(Boolean).join(' ')}
  {...restProps}
>
  {@render children?.()}
</TabsPrimitive.Content>
