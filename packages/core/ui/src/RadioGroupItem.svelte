<script lang="ts">
  import { RadioGroup as RadioGroupPrimitive } from 'bits-ui';

  type Props = {
    value: string;
    disabled?: boolean;
    class?: string;
    ref?: HTMLButtonElement | null;
    [key: string]: unknown;
  };
  let { value, class: className, ref = $bindable(null), ...restProps }: Props = $props();
</script>

<RadioGroupPrimitive.Item
  bind:ref
  {value}
  data-slot="radio-group-item"
  class={[
    'border-input data-checked:bg-primary data-checked:text-primary-foreground data-checked:border-primary',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
    'peer relative flex size-4 shrink-0 rounded-full border outline-none transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    className,
  ]
    .filter(Boolean)
    .join(' ')}
  {...restProps}
>
  {#snippet children({ checked })}
    <div data-slot="radio-group-indicator" class="flex size-4 items-center justify-center">
      {#if checked}
        <div
          class="bg-primary-foreground absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        ></div>
      {/if}
    </div>
  {/snippet}
</RadioGroupPrimitive.Item>
