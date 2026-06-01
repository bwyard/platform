<script lang="ts" module>
  // ============================================================
  // Alert — inline status message (role=alert for a11y)
  // ============================================================
  import { tv, type VariantProps } from 'tailwind-variants';

  export const alertVariants = tv({
    base: 'relative grid w-full rounded-lg border px-3 py-2.5 text-sm',
    variants: {
      variant: {
        default: 'bg-card text-card-foreground border-border',
        destructive: 'border-destructive/30 bg-destructive/10 text-destructive',
        success: 'border-success/30 bg-success/10 text-success',
        warning: 'border-warning/30 bg-warning/10 text-warning',
        info: 'border-info/30 bg-info/10 text-info',
      },
    },
    defaultVariants: { variant: 'default' },
  });

  export type AlertVariant = VariantProps<typeof alertVariants>['variant'];
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: AlertVariant;
    class?: string;
    children?: Snippet;
    [key: string]: unknown;
  };

  let { variant, class: className, children, ...restProps }: Props = $props();
</script>

<div
  data-slot="alert"
  role="alert"
  class={alertVariants({ variant, class: className })}
  {...restProps}
>
  {@render children?.()}
</div>
