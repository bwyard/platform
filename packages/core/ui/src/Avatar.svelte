<script lang="ts">
  // ============================================================
  // Avatar.Root — backed by bits-ui Avatar.Root
  // Compose with AvatarImage + AvatarFallback.
  // ============================================================
  import { Avatar as AvatarPrimitive } from 'bits-ui';
  import { tv, type VariantProps } from 'tailwind-variants';
  import type { Snippet } from 'svelte';

  const avatarStyles = tv({
    base: 'relative flex shrink-0 select-none overflow-hidden rounded-full',
    variants: {
      size: {
        sm: 'size-6',
        md: 'size-8',
        lg: 'size-10',
      },
    },
    defaultVariants: { size: 'md' },
  });

  type AvatarSize = VariantProps<typeof avatarStyles>['size'];

  type Props = {
    size?: AvatarSize;
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
  };

  let { size, class: className, ref = $bindable(null), children, ...restProps }: Props = $props();
</script>

<AvatarPrimitive.Root
  bind:ref
  data-slot="avatar"
  class={avatarStyles({ size, class: className })}
  {...restProps}
>
  {@render children?.()}
</AvatarPrimitive.Root>
