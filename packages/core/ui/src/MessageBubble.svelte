<script lang="ts">
  // ============================================================
  // MessageBubble — shared message thread bubble
  //
  // sent=true  → right-aligned, dark bg  (current user sent it)
  // sent=false → left-aligned,  light bg (other party sent it)
  //
  // Theme note: bg/text colors use current Tailwind values.
  // Will migrate to CSS custom properties when @breeyard/theme
  // tokens are wired into apps.
  // ============================================================

  type Props = {
    body: string;
    sent: boolean;
    senderLabel: string;
    timestamp: string;
  };

  const { body, sent, senderLabel, timestamp }: Props = $props();

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
</script>

<div data-testid="message-item" class="flex {sent ? 'justify-end' : 'justify-start'}">
  <div class="max-w-lg space-y-1">
    <p class="text-xs text-muted-foreground {sent ? 'text-right' : 'text-left'}">
      {senderLabel} · {formatTime(timestamp)}
    </p>
    <div
      class="rounded-2xl px-4 py-3 text-sm leading-relaxed {sent
        ? 'rounded-tr-sm bg-foreground text-background'
        : 'rounded-tl-sm bg-muted text-foreground'}"
    >
      <p class="whitespace-pre-wrap">{body}</p>
    </div>
  </div>
</div>
