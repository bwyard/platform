import type { Component } from 'svelte';

interface Props {
  status: string;
  class?: string;
}

declare const StatusBadge: Component<Props>;
export default StatusBadge;
