<script lang="ts">
  import { enhance } from '$app/forms';
  import { MessageBubble } from '@breeyard/ui';
  import type { PageData, ActionData } from './$types';

  const { data, form }: { data: PageData; form: ActionData } = $props();

  let body = $state('');
</script>

<svelte:head>
  <title>Messages — Client Portal</title>
</svelte:head>

<div class="flex h-full flex-col p-8">
  <h1 class="mb-6 text-2xl font-bold">Messages</h1>

  <!-- Thread -->
  <div data-testid="message-thread" class="mb-6 flex-1 space-y-4 overflow-auto">
    {#if data.messages.length === 0}
      <p data-testid="messages-empty" class="text-sm text-gray-400">
        No messages yet. Send one below.
      </p>
    {:else}
      {#each data.messages as message (message.id)}
        <MessageBubble
          body={message.body}
          sent={message.fromClient}
          senderLabel={message.fromClient ? 'You' : '8 of Wands'}
          timestamp={message.createdAt}
        />
      {/each}
    {/if}
  </div>

  <!-- Send form -->
  <form
    method="POST"
    action="?/send"
    use:enhance={() => {
      return ({ update }) => {
        body = '';
        update();
      };
    }}
    class="flex gap-3"
  >
    {#if form?.error}
      <p class="mb-2 text-sm text-red-600">{form.error}</p>
    {/if}
    <textarea
      name="body"
      bind:value={body}
      data-testid="message-input"
      rows="2"
      placeholder="Write a message…"
      class="flex-1 rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
    ></textarea>
    <button
      type="submit"
      data-testid="message-submit"
      disabled={!body.trim()}
      class="self-end rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-40"
    >
      Send
    </button>
  </form>
</div>
