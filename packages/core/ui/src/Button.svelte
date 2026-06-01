<script lang="ts" module>
  // ============================================================
  // Button — primary interactive element
  // Renders as <button> or <a> depending on href prop.
  // ============================================================
  import { tv, type VariantProps } from 'tailwind-variants';

  export const buttonVariants = tv({
    base: [
      'inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-transparent',
      'text-sm font-medium transition-all outline-none select-none',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
      'disabled:pointer-events-none disabled:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
    ],
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border-border bg-background hover:bg-muted hover:text-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted hover:text-foreground',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs',
        md: 'h-8 px-2.5',
        lg: 'h-9 px-4 text-base',
        icon: 'size-8',
        'icon-sm': 'size-7',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
  export type ButtonSize = VariantProps<typeof buttonVariants>['size'];
</script>

<script lang="ts">
  import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Props = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
    disabled?: boolean;
    type?: HTMLButtonAttributes['type'];
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
  } & Omit<HTMLButtonAttributes, 'class' | 'type' | 'disabled'> &
    Omit<HTMLAnchorAttributes, 'class' | 'href'>;

  let {
    variant,
    size,
    href,
    disabled,
    type = 'button',
    class: className,
    ref = $bindable(null),
    children,
    ...restProps
  }: Props = $props();
</script>

{#if href}
  <a
    bind:this={ref}
    data-slot="button"
    {href}
    aria-disabled={disabled}
    class={buttonVariants({ variant, size, class: className })}
    {...restProps}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    data-slot="button"
    {type}
    {disabled}
    class={buttonVariants({ variant, size, class: className })}
    {...restProps}
  >
    {@render children?.()}
  </button>
{/if}
