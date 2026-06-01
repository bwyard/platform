<script lang="ts">
  import { Accordion as AccordionPrimitive } from 'bits-ui';
  import type { Snippet } from 'svelte';

  type Props = {
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    class?: string;
    ref?: HTMLElement | null;
    children?: Snippet;
    [key: string]: unknown;
  };
  let {
    level = 3,
    class: className,
    ref = $bindable(null),
    children,
    ...restProps
  }: Props = $props();
</script>

<AccordionPrimitive.Header {level} class="flex">
  <AccordionPrimitive.Trigger
    bind:ref
    data-slot="accordion-trigger"
    class={[
      'group/accordion-trigger relative flex flex-1 items-start justify-between',
      'rounded-lg py-2.5 text-left text-sm font-medium transition-all outline-none',
      'hover:underline focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
      'disabled:pointer-events-none disabled:opacity-50',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...restProps}
  >
    {@render children?.()}
    <!-- Chevron down (collapsed) -->
    <svg
      class="text-muted-foreground ml-auto size-4 shrink-0 group-aria-expanded/accordion-trigger:hidden"
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
      <polyline points="6 9 12 15 18 9" />
    </svg>
    <!-- Chevron up (expanded) -->
    <svg
      class="text-muted-foreground ml-auto size-4 shrink-0 hidden group-aria-expanded/accordion-trigger:inline"
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
      <polyline points="18 15 12 9 6 15" />
    </svg>
  </AccordionPrimitive.Trigger>
</AccordionPrimitive.Header>
