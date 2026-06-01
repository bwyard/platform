<script lang="ts">
  import { Combobox as ComboboxPrimitive } from 'bits-ui';

  type Props = {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    class?: string;
    ref?: HTMLInputElement | null;
    [key: string]: unknown;
  };
  let {
    value = $bindable(''),
    class: className,
    ref = $bindable(null),
    ...restProps
  }: Props = $props();
</script>

<ComboboxPrimitive.Input
  bind:ref
  bind:value
  data-slot="combobox-input"
  class={[
    'border-input bg-background h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-sm',
    'placeholder:text-muted-foreground transition-colors outline-none',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
    'disabled:cursor-not-allowed disabled:opacity-50',
    className,
  ]
    .filter(Boolean)
    .join(' ')}
  {...restProps}
/>
