<script lang="ts">
  import { Combobox as ComboboxPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    value: string;
    label?: string;
    disabled?: boolean;
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };
  let {
    value,
    label,
    disabled,
    class: className,
    ref = $bindable(null),
    children,
    ...restProps
  }: Props = $props();
</script>

<ComboboxPrimitive.Item
  bind:ref
  {value}
  {label}
  {disabled}
  data-slot="combobox-item"
  class={[
    'focus:bg-accent focus:text-accent-foreground',
    'relative flex w-full cursor-default select-none items-center gap-1.5',
    'rounded-md py-1 pr-8 pl-1.5 text-sm outline-none',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    className,
  ]
    .filter(Boolean)
    .join(' ')}
  {...restProps}
>
  {#snippet children({ isSelected })}
    {#if isSelected}
      <span class="absolute right-2 flex size-3.5 items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    {/if}
    <span>{label ?? value}</span>
  {/snippet}
</ComboboxPrimitive.Item>
