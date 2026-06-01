<script lang="ts" module>
  // ============================================================
  // Badge — inline label/status chip
  // Renders as <a> when href provided, <span> otherwise.
  // ============================================================
  import { tv, type VariantProps } from 'tailwind-variants';

  export const badgeVariants = tv({
    base: [
      'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap',
      'h-5 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium transition-colors',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none',
      '[&>svg]:size-3 [&>svg]:pointer-events-none',
    ],
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
        destructive: 'bg-destructive/10 text-destructive',
        success: 'bg-success/10 text-success',
        warning: 'bg-warning/10 text-warning',
        info: 'bg-info/10 text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  });

  export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: BadgeVariant;
    href?: string;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { variant, href, class: className, children, ...restProps }: Props = $props();
</script>

<svelte:element
  this={href ? 'a' : 'span'}
  data-slot="badge"
  {href}
  class={badgeVariants({ variant, class: className })}
  {...restProps}
>
  {@render children?.()}
</svelte:element>
