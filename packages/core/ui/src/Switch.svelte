<script lang="ts">
  // ============================================================
  // Switch — toggle backed by bits-ui Switch.Root + Thumb
  // Uses data-checked/data-unchecked state attributes from bits-ui.
  // ============================================================
  import { Switch as SwitchPrimitive } from 'bits-ui';
  import { tv } from 'tailwind-variants';

  const switchStyles = tv({
    base: [
      'peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none',
      'data-checked:bg-primary data-unchecked:bg-input',
      'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3',
      'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3',
      'data-disabled:cursor-not-allowed data-disabled:opacity-50',
      'h-[18px] w-[32px]',
    ],
  });

  const thumbStyles =
    'bg-background pointer-events-none block rounded-full ring-0 transition-transform size-4 data-checked:translate-x-[calc(100%-2px)] data-unchecked:translate-x-0';

  type Props = {
    checked?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    required?: boolean;
    class?: string;
    ref?: HTMLButtonElement | null;
    onCheckedChange?: (checked: boolean) => void;
  };

  let {
    checked = $bindable(false),
    class: className,
    ref = $bindable(null),
    ...restProps
  }: Props = $props();
</script>

<SwitchPrimitive.Root
  bind:ref
  bind:checked
  data-slot="switch"
  class={switchStyles({ class: className })}
  {...restProps}
>
  <SwitchPrimitive.Thumb data-slot="switch-thumb" class={thumbStyles} />
</SwitchPrimitive.Root>
