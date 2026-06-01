<script lang="ts">
  import type { Snippet } from 'svelte';

  type Props = {
    class?: string;
    children?: Snippet;
  };

  let { class: className, children }: Props = $props();
</script>

<div data-slot="dialog-header" class={['flex flex-col gap-2', className].filter(Boolean).join(' ')}>
  {@render children?.()}
</div>
