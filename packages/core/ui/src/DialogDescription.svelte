<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    ref?: HTMLElement | null;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { ref = $bindable(null), class: className, children, ...restProps }: Props = $props();
</script>

<DialogPrimitive.Description
  bind:ref
  data-slot="dialog-description"
  class={['text-muted-foreground text-sm', className].filter(Boolean).join(' ')}
  {...restProps}
>
  {@render children?.()}
</DialogPrimitive.Description>
