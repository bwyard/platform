<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  const { data, form }: { data: PageData; form: ActionData } = $props();

  const statusColors: Record<string, string> = {
    prospect: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-600',
    churned: 'bg-red-100 text-red-700',
  };

  const projectStatusColors: Record<string, string> = {
    discovery: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
  };
</script>

<svelte:head>
  <title>{data.client.name} — CRM</title>
</svelte:head>

<div class="p-8">
  <div class="mb-6">
    <a href="/clients" class="text-sm text-gray-500 hover:underline">← Clients</a>
  </div>

  <div class="grid grid-cols-3 gap-8">
    <!-- Left: client info -->
    <div class="col-span-2 space-y-6">
      <div class="flex items-start justify-between">
        <div>
          <h1 class="text-2xl font-bold">{data.client.name}</h1>
          {#if data.client.company}
            <p class="mt-1 text-gray-500">{data.client.company}</p>
          {/if}
        </div>
        <div class="flex items-center gap-2">
          <a
            href="/clients/{data.client.id}/edit"
            data-testid="edit-client-link"
            class="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-50"
          >
            Edit
          </a>
          <span
            class="rounded-full px-3 py-1 text-sm font-medium {statusColors[data.client.status] ??
              ''}"
          >
            {data.client.status}
          </span>
        </div>
      </div>

      <!-- Projects -->
      <div>
        <div class="mb-3 flex items-center justify-between">
          <h2 class="font-semibold">Projects</h2>
          <a
            href="/projects/new?clientId={data.client.id}"
            class="text-sm text-gray-500 hover:underline"
          >
            + Add project
          </a>
        </div>

        {#if data.projects.length === 0}
          <p class="text-sm text-gray-400">No projects yet.</p>
        {:else}
          <div class="space-y-2">
            {#each data.projects as project (project.id)}
              <div class="flex items-center justify-between rounded-lg border px-4 py-3">
                <div>
                  <p class="text-sm font-medium">{project.name}</p>
                  {#if project.description}
                    <p class="mt-0.5 text-xs text-gray-500">{project.description}</p>
                  {/if}
                </div>
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium {projectStatusColors[
                    project.status
                  ] ?? ''}"
                >
                  {project.status}
                </span>
              </div>
            {/each}
          </div>
        {/if}
      </div>

      <!-- Notes -->
      {#if data.client.notes}
        <div>
          <h2 class="mb-2 font-semibold">Notes</h2>
          <p class="rounded-lg bg-gray-50 px-4 py-3 text-sm whitespace-pre-wrap text-gray-700">
            {data.client.notes}
          </p>
        </div>
      {/if}
    </div>

    <!-- Right: meta -->
    <div class="space-y-4">
      <div class="space-y-3 rounded-lg border p-4 text-sm">
        <div>
          <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Email</p>
          <a href="mailto:{data.client.email}" class="text-gray-800 hover:underline"
            >{data.client.email}</a
          >
        </div>
        {#if data.client.phone}
          <div>
            <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Phone</p>
            <p class="text-gray-800">{data.client.phone}</p>
          </div>
        {/if}
        <div>
          <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Tech level</p>
          <p class="text-gray-800 capitalize">{data.client.techLevel}</p>
        </div>
        <div>
          <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Client since</p>
          <p class="text-gray-800">{new Date(data.client.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <!-- Messages -->
      <a
        href="/clients/{data.client.id}/messages"
        data-testid="messages-link"
        class="flex items-center justify-between rounded-lg border p-4 text-sm hover:bg-gray-50"
      >
        <span class="font-medium">Messages</span>
        {#if data.unreadCount > 0}
          <span class="rounded-full bg-black px-2 py-0.5 text-xs font-semibold text-white">
            {data.unreadCount}
          </span>
        {:else}
          <span class="text-gray-400">→</span>
        {/if}
      </a>

      <!-- Portal access -->
      <div class="space-y-3 rounded-lg border p-4 text-sm">
        <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Portal access</p>

        {#if data.client.userId}
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-green-500"></span>
            <span class="text-gray-700">Account active</span>
          </div>
        {:else if form?.invited}
          <div class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full bg-blue-500"></span>
            <span class="text-gray-700">Invite sent</span>
          </div>
        {:else}
          <p class="text-gray-500">No portal account yet.</p>
          <form method="POST" action="?/invite" use:enhance>
            {#if form?.error}
              <p class="mb-2 text-xs text-red-600">{form.error}</p>
            {/if}
            <button
              type="submit"
              class="w-full rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-black hover:text-black"
            >
              Send invite
            </button>
          </form>
        {/if}
      </div>
    </div>
  </div>
</div>
