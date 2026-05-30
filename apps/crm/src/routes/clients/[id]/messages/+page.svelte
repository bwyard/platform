<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  const { data, form }: { data: PageData; form: ActionData } = $props();

  let body = $state('');
  let threadEl: HTMLDivElement | undefined;

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });

  $effect(() => {
    threadEl?.scrollTo({ top: threadEl.scrollHeight, behavior: 'smooth' });
  });

  $effect(() => {
    if (form?.sent) body = '';
  });

  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      (e.currentTarget as HTMLTextAreaElement).form?.requestSubmit();
    }
  };
</script>

<svelte:head>
  <title>Messages — {data.client.name}</title>
</svelte:head>

<div class="flex h-full flex-col">
  <!-- Header -->
  <div class="flex items-center gap-4 border-b px-6 py-4">
    <a href="/clients/{data.client.id}" class="text-sm text-gray-400 hover:text-gray-700">
      ← {data.client.name}
    </a>
    <h1 class="text-sm font-semibold">Messages</h1>
  </div>

  <!-- Thread -->
  <div
    bind:this={threadEl}
    data-testid="message-thread"
    class="flex-1 space-y-4 overflow-y-auto px-6 py-6"
  >
    {#if data.messages.length === 0}
      <div data-testid="messages-empty" class="flex h-full items-center justify-center">
        <p class="text-sm text-gray-400">No messages yet. Send the first one below.</p>
      </div>
    {:else}
      {#each data.messages as message (message.id)}
        <div
          data-testid="message-item"
          class="flex {message.fromClient ? 'justify-start' : 'justify-end'}"
        >
          <div class="max-w-lg space-y-1">
            <p class="text-xs text-gray-400 {message.fromClient ? 'text-left' : 'text-right'}">
              {message.fromClient ? data.client.name : 'You'} · {formatTime(message.createdAt)}
            </p>
            <div
              class="rounded-2xl px-4 py-3 text-sm leading-relaxed {message.fromClient
                ? 'rounded-tl-sm bg-gray-100 text-gray-900'
                : 'rounded-tr-sm bg-gray-900 text-white'}"
            >
              <p class="whitespace-pre-wrap">{message.body}</p>
            </div>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  <!-- Reply form -->
  <div class="border-t px-6 py-4">
    {#if form?.error}
      <p class="mb-2 text-xs text-red-600">{form.error}</p>
    {/if}
    <form method="POST" action="?/reply" use:enhance class="flex items-end gap-3">
      <textarea
        name="body"
        bind:value={body}
        data-testid="reply-input"
        rows="3"
        placeholder="Reply to {data.client.name}… (⌘↵ to send)"
        required
        onkeydown={handleKeydown}
        class="flex-1 resize-none rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
      ></textarea>
      <button
        type="submit"
        data-testid="reply-submit"
        disabled={!body.trim()}
        class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-40"
      >
        Send
      </button>
    </form>
  </div>
</div>
