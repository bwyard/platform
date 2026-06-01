<script lang="ts">
  import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    value?: string;
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    required?: boolean;
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };
  let {
    value = $bindable(''),
    class: className,
    ref = $bindable(null),
    children,
    ...restProps
  }: Props = $props();
</script>

<RadioGroupPrimitive.Root
  bind:ref
  bind:value
  data-slot="radio-group"
  class={['grid gap-2 w-full', className].filter(Boolean).join(' ')}
  {...restProps}
>
  {@render children?.()}
</RadioGroupPrimitive.Root>
