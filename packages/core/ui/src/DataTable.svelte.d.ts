import type { Component, Snippet } from 'svelte';

interface Column<Row> {
  key: string;
  header: string;
  cell?: Snippet<[Row]>;
}

interface Props<T extends Record<string, unknown>> {
  columns: Column<T>[];
  rows: T[];
  class?: string;
  emptyMessage?: string;
}

declare const DataTable: Component<Props<Record<string, unknown>>>;
export default DataTable;
