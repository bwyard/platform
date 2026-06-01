<script lang="ts">
  // ============================================================
  // StatusBadge — maps a status string to a Badge variant
  // Covers ClientStatus and ProjectStatus from @breeyard/shared.
  // ============================================================
  import Badge, { type BadgeVariant } from './Badge.svelte';

  const STATUS_VARIANT_MAP: Record<string, BadgeVariant> = {
    // ClientStatus
    prospect: 'warning',
    active: 'success',
    inactive: 'secondary',
    churned: 'destructive',
    // ProjectStatus
    discovery: 'info',
    paused: 'warning',
    completed: 'secondary',
    cancelled: 'destructive',
    // Generic fallbacks
    pending: 'warning',
    draft: 'secondary',
    archived: 'secondary',
    error: 'destructive',
  };

  type Props = {
    status: string;
    class?: string;
  };

  let { status, class: className }: Props = $props();

  const variant = $derived(STATUS_VARIANT_MAP[status.toLowerCase()] ?? 'secondary');
  const label = $derived(status.charAt(0).toUpperCase() + status.slice(1));
</script>

<Badge {variant} class={className}>
  {label}
</Badge>
