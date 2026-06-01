<script lang="ts" module>
  // ============================================================
  // Spinner — loading indicator (SVG animation, no external dep)
  // ============================================================
  import { tv, type VariantProps } from 'tailwind-variants';

  export const spinnerVariants = tv({
    base: 'animate-spin text-muted-foreground',
    variants: {
      size: {
        sm: 'size-4',
        md: 'size-5',
        lg: 'size-8',
      },
    },
    defaultVariants: { size: 'md' },
  });

  export type SpinnerSize = VariantProps<typeof spinnerVariants>['size'];
</script>

<script lang="ts">
  type Props = {
    size?: SpinnerSize;
    class?: string;
    label?: string;
  };

  let { size, class: className, label = 'Loading…' }: Props = $props();
</script>

<svg
  data-slot="spinner"
  class={spinnerVariants({ size, class: className })}
  xmlns="http://www.w3.org/2000/svg"
  fill="none"
  viewBox="0 0 24 24"
  aria-label={label}
  role="status"
>
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
  <path
    class="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  />
</svg>
