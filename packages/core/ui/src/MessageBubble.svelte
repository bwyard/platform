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

  interface Props {
    body: string;
    sent: boolean;
    senderLabel: string;
    timestamp: string;
  }

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
    <p class="text-xs text-gray-400 {sent ? 'text-right' : 'text-left'}">
      {senderLabel} · {formatTime(timestamp)}
    </p>
    <div
      class="rounded-2xl px-4 py-3 text-sm leading-relaxed {sent
        ? 'rounded-tr-sm bg-gray-900 text-white'
        : 'rounded-tl-sm bg-gray-100 text-gray-900'}"
    >
      <p class="whitespace-pre-wrap">{body}</p>
    </div>
  </div>
</div>
