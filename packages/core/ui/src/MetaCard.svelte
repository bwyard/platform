<script lang="ts">
  // ============================================================
  // MetaCard — key-value metadata display panel
  // items: [{ label, value }] — renders a labeled metadata grid
  // ============================================================
  type MetaItem = {
    label: string;
    value: string | null | undefined;
  };

  type Props = {
    items: MetaItem[];
    class?: string;
  };

  let { items, class: className }: Props = $props();
</script>

<div
  data-slot="meta-card"
  class={['space-y-4 rounded-lg border p-4 text-sm', className].filter(Boolean).join(' ')}
>
  {#each items as item (item.label)}
    <div>
      <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">{item.label}</p>
      <p class="mt-0.5 text-foreground">{item.value ?? '—'}</p>
    </div>
  {/each}
</div>
