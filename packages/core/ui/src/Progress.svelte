<script lang="ts">
  // ============================================================
  // Progress — backed by bits-ui Progress.Root
  // value: 0-100 (or 0-max if max is set)
  // ============================================================
  import { Progress as ProgressPrimitive } from 'bits-ui';
  import { tv } from 'tailwind-variants';

  const progressStyles = tv({
    base: 'bg-muted relative flex h-1.5 w-full overflow-hidden rounded-full',
  });

  type Props = {
    value?: number;
    max?: number;
    class?: string;
    ref?: HTMLElement | null;
  };

  let { value = 0, max = 100, class: className, ref = $bindable(null) }: Props = $props();
</script>

<ProgressPrimitive.Root
  bind:ref
  data-slot="progress"
  {value}
  {max}
  class={progressStyles({ class: className })}
>
  <div
    data-slot="progress-indicator"
    class="bg-primary h-full w-full flex-1 transition-transform"
    style="transform: translateX(-{100 - (100 * value) / max}%)"
  ></div>
</ProgressPrimitive.Root>
