<script lang="ts">
  // ============================================================
  // EmptyState — placeholder for empty lists/collections
  // ============================================================
  type Props = {
    message?: string;
    ctaLabel?: string;
    ctaHref?: string;
    class?: string;
  };

  let { message = 'Nothing here yet.', ctaLabel, ctaHref, class: className }: Props = $props();
</script>

<div
  data-slot="empty-state"
  class={['rounded-lg border border-dashed p-12 text-center', className].filter(Boolean).join(' ')}
>
  <p class="text-sm text-muted-foreground">{message}</p>
  {#if ctaLabel && ctaHref}
    <a
      href={ctaHref}
      class="mt-2 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
    >
      {ctaLabel}
    </a>
  {/if}
</div>
