<script lang="ts">
  // ============================================================
  // AvatarImage — bits-ui Avatar.Image wrapper
  // ============================================================
  import { Avatar as AvatarPrimitive } from 'bits-ui';

  type Props = {
    src?: string;
    alt?: string;
    class?: string;
    ref?: HTMLImageElement | null;
  };

  let { src, alt, class: className, ref = $bindable(null), ...restProps }: Props = $props();
</script>

<AvatarPrimitive.Image
  bind:ref
  data-slot="avatar-image"
  {src}
  {alt}
  class={['aspect-square size-full object-cover', className].filter(Boolean).join(' ')}
  {...restProps}
/>
