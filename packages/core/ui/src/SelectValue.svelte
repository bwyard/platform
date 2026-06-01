<script lang="ts">
  import { Select as SelectPrimitive } from 'bits-ui';

  type Props = { placeholder?: string; class?: string; [key: string]: unknown };
  let { placeholder, class: className, ...restProps }: Props = $props();
</script>

<SelectPrimitive.Value
  data-slot="select-value"
  {placeholder}
  class={['flex flex-1 items-center gap-1.5 text-left', className].filter(Boolean).join(' ')}
  {...restProps}
/>
