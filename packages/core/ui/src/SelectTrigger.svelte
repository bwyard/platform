<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    size?: 'sm' | 'md';
    disabled?: boolean;
    class?: string;
    ref?: HTMLButtonElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };
  let {
    size = 'md',
    class: className,
    ref = $bindable(null),
    children,
    ...restProps
  }: Props = $props();
</script>

<SelectPrimitive.Trigger
  bind:ref
  data-slot="select-trigger"
  data-size={size}
  class={[
    'border-input data-placeholder:text-muted-foreground',
    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
    'flex w-full items-center justify-between gap-1.5 rounded-lg border bg-transparent',
    'py-2 pr-2 pl-2.5 text-sm transition-colors select-none outline-none',
    'disabled:cursor-not-allowed disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
    size === 'sm' ? 'h-7' : 'h-8',
    className,
  ]
    .filter(Boolean)
    .join(' ')}
  {...restProps}
>
  {@render children?.()}
  <!-- Chevron icon -->
  <svg
    class="text-muted-foreground size-4 shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" />
  </svg>
</SelectPrimitive.Trigger>
