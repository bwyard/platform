<script lang="ts">
  // ============================================================
  // AvatarFallback — bits-ui Avatar.Fallback wrapper
  // Renders when image fails or hasn't loaded.
  // ============================================================
  import { Avatar as AvatarPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
  };

  let { class: className, ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<AvatarPrimitive.Fallback
  bind:ref
  data-slot="avatar-fallback"
  class={[
    'bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm font-medium',
    className,
  ]
    .filter(Boolean)
    .join(' ')}
  {...restProps}
>
  {@render children?.()}
</AvatarPrimitive.Fallback>
