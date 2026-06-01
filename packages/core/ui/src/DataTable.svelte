<script lang="ts" generics="T extends Record<string, unknown>">
  // ============================================================
  // DataTable — generic slot-based data table
  // columns: [{ key, header, render? }]
  // rows: T[]
  // ============================================================
  import type { Snippet } from 'svelte';

  interface Column<Row> {
    key: string;
    header: string;
    cell?: Snippet<[Row]>;
  }

  interface Props<Row extends Record<string, unknown>> {
    columns: Column<Row>[];
    rows: Row[];
    class?: string;
    emptyMessage?: string;
  }

  let { columns, rows, class: className, emptyMessage = 'No data.' }: Props<T> = $props();
</script>

<div
  data-slot="data-table"
  class={['w-full overflow-x-auto rounded-lg border', className].filter(Boolean).join(' ')}
>
  <table class="w-full text-sm">
    <thead>
      <tr class="border-b bg-muted/50">
        {#each columns as col}
          <th
            class="px-4 py-2.5 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase"
          >
            {col.header}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if rows.length === 0}
        <tr>
          <td colspan={columns.length} class="px-4 py-8 text-center text-muted-foreground">
            {emptyMessage}
          </td>
        </tr>
      {:else}
        {#each rows as row}
          <tr class="border-b last:border-0 hover:bg-muted/30 transition-colors">
            {#each columns as col}
              <td class="px-4 py-3">
                {#if col.cell}
                  {@render col.cell(row)}
                {:else}
                  {row[col.key] ?? '—'}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>
