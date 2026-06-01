<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    class?: string;
    children?: Snippet;
  };

  let { class: className, children }: Props = $props();
</script>

<div
  data-slot="dialog-footer"
  class={[
    'bg-muted/50 -mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end',
    className,
  ]
    .filter(Boolean)
    .join(' ')}
>
  {@render children?.()}
</div>
