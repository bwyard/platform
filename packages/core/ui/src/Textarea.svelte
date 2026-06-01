<script lang="ts">
  // ============================================================
  // Textarea — multiline text input
  // Uses aria-invalid for error state (CSS handles ring/border).
  // ============================================================
  import { tv } from 'tailwind-variants';
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  const textareaStyles = tv({
    base: [
      'border-input bg-background w-full min-w-0 rounded-lg border px-2.5 py-2 text-sm',
      'placeholder:text-muted-foreground min-h-16 field-sizing-content transition-colors outline-none',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ],
  });

  type Props = HTMLTextareaAttributes & {
    class?: string;
    ref?: HTMLTextAreaElement | null;
  };

  let {
    ref = $bindable(null),
    value = $bindable(),
    class: className,
    ...restProps
  }: Props = $props();
</script>

<textarea
  bind:this={ref}
  data-slot="textarea"
  class={textareaStyles({ class: className })}
  bind:value
  {...restProps}
></textarea>
