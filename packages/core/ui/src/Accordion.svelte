<script lang="ts">
  import { Accordion as AccordionPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    type?: 'single' | 'multiple';
    value?: string | string[];
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };
  let {
    type = 'single',
    value = $bindable(),
    class: className,
    ref = $bindable(null),
    children,
    ...restProps
  }: Props = $props();
</script>

<AccordionPrimitive.Root
  bind:ref
  bind:value={value as never}
  type={type as never}
  data-slot="accordion"
  class={['flex w-full flex-col', className].filter(Boolean).join(' ')}
  {...restProps}
>
  {@render children?.()}
</AccordionPrimitive.Root>
