import type { Component } from 'svelte';

interface Props {
  body: string;
  sent: boolean;
  senderLabel: string;
  timestamp: string;
}

declare const MessageBubble: Component<Props>;
export default MessageBubble;
