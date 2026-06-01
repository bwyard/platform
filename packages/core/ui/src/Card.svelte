<script lang="ts">
  // ============================================================
  // Card — surface container with ring border
  // ============================================================
  import { tv } from 'tailwind-variants';
  import type { Snippet } from 'svelte';

  const cardStyles = tv({
    base: 'bg-card text-card-foreground ring-foreground/10 rounded-xl ring-1 overflow-hidden',
  });

  type Props = {
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { class: className, children, ...restProps }: Props = $props();
</script>

<div data-slot="card" class={cardStyles({ class: className })} {...restProps}>
  {@render children?.()}
</div>
