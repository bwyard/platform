<script lang="ts">
  import { Dialog as SheetPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    ref?: HTMLElement | null;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<SheetPrimitive.Title
  bind:ref
  data-slot="sheet-title"
  class={['text-foreground text-base font-medium', className].filter(Boolean).join(' ')}
  {...restProps}
>
  {@render children?.()}
</SheetPrimitive.Title>
