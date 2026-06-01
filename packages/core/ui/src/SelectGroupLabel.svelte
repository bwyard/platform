<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };
  let { class: className, children, ...restProps }: Props = $props();
</script>

<SelectPrimitive.GroupHeading
  data-slot="select-group-label"
  class={['text-muted-foreground px-1.5 py-1 text-xs', className].filter(Boolean).join(' ')}
  {...restProps}
>
  {@render children?.()}
</SelectPrimitive.GroupHeading>
