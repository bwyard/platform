<script lang="ts">
  // ============================================================
  // Checkbox — backed by bits-ui Checkbox.Root
  // Uses data-checked/data-unchecked state attributes from bits-ui.
  // ============================================================
  import { Checkbox as CheckboxPrimitive } from 'bits-ui';
  import { tv } from 'tailwind-variants';

  const checkboxStyles = tv({
    base: [
      'border-input data-checked:bg-primary data-checked:text-primary-foreground data-checked:border-primary',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
      'peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ],
  });

  type Props = {
    checked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    required?: boolean;
    class?: string;
    ref?: HTMLButtonElement | null;
    onCheckedChange?: (checked: boolean) => void;
  };

  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    class: className,
    ref = $bindable(null),
    ...restProps
  }: Props = $props();
</script>

<CheckboxPrimitive.Root
  bind:ref
  bind:checked
  bind:indeterminate
  data-slot="checkbox"
  class={checkboxStyles({ class: className })}
  {...restProps}
>
  {#snippet children({ checked: isChecked, indeterminate: isIndeterminate })}
    <div
      data-slot="checkbox-indicator"
      class="grid place-content-center text-current [&>svg]:size-3.5"
    >
      {#if isChecked}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      {:else if isIndeterminate}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      {/if}
    </div>
  {/snippet}
</CheckboxPrimitive.Root>
