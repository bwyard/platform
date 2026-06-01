<script lang="ts">
  import { Accordion as AccordionPrimitive } from 'bits-ui';
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

<AccordionPrimitive.Item
  bind:ref
  {value}
  {disabled}
  data-slot="accordion-item"
  class={['not-last:border-b', className].filter(Boolean).join(' ')}
  {...restProps}
>
  {@render children?.()}
</AccordionPrimitive.Item>
