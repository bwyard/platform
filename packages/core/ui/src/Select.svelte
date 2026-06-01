<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    value?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
    open?: boolean;
    children?: Snippet;
  };
  let {
    value = $bindable(''),
    onValueChange,
    open = $bindable(false),
    children,
    ...restProps
  }: Props = $props();
</script>

<SelectPrimitive.Root bind:value {onValueChange} bind:open {...restProps}>
  {@render children?.()}
</SelectPrimitive.Root>
