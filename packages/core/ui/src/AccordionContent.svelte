<script lang="ts">
  import { Accordion as AccordionPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };
  let { class: className, ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<AccordionPrimitive.Content
  bind:ref
  data-slot="accordion-content"
  class="overflow-hidden text-sm"
  {...restProps}
>
  <div class={['pb-2.5', className].filter(Boolean).join(' ')}>
    {@render children?.()}
  </div>
</AccordionPrimitive.Content>
