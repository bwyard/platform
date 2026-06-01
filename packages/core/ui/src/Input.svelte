<script lang="ts">
  // ============================================================
  // Input — text input field
  // Uses aria-invalid for error state (CSS handles ring/border).
  // ============================================================
  import { tv } from 'tailwind-variants';
  import type { HTMLInputAttributes } from 'svelte/elements';

  const inputStyles = tv({
    base: [
      'border-input bg-background h-8 w-full min-w-0 rounded-lg border px-2.5 py-1 text-sm',
      'placeholder:text-muted-foreground transition-colors outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    ],
  });

  type Props = HTMLInputAttributes & {
    class?: string;
    ref?: HTMLInputElement | null;
  };

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...restProps
  }: Props = $props();
</script>

<input
  bind:this={ref}
  data-slot="input"
  class={inputStyles({ class: className })}
  bind:value
  {...restProps}
/>
