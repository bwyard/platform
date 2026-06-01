<script lang="ts">
  import { Combobox as ComboboxPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    value?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    children?: Snippet;
    [key: string]: unknown;
  };
  let {
    value = $bindable(''),
    onValueChange,
    open = $bindable(false),
    onOpenChange,
    children,
    ...restProps
  }: Props = $props();
</script>

<ComboboxPrimitive.Root bind:value {onValueChange} bind:open {onOpenChange} {...restProps}>
  {@render children?.()}
</ComboboxPrimitive.Root>
