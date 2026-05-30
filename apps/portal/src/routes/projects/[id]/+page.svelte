<script lang="ts">
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const statusColors: Record<string, string> = {
    discovery: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
  };

  const statusLabels: Record<string, string> = {
    discovery: 'Discovery',
    active: 'In progress',
    paused: 'On hold',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
</script>

<svelte:head>
  <title>{data.project.name} — Client Portal</title>
</svelte:head>

<div class="p-8">
  <div class="mb-6">
    <a href="/projects" class="text-sm text-gray-400 hover:text-gray-700">← Projects</a>
  </div>

  <div class="mb-8 flex items-start justify-between">
    <h1 class="text-2xl font-bold" data-testid="project-name">{data.project.name}</h1>
    <span
      class="rounded-full px-3 py-1 text-sm font-medium {statusColors[data.project.status] ?? ''}"
    >
      {statusLabels[data.project.status] ?? data.project.status}
    </span>
  </div>

  <div class="grid gap-8 sm:grid-cols-3">
    <div class="space-y-4 sm:col-span-2">
      {#if data.project.description}
        <p class="text-sm leading-relaxed text-gray-700">{data.project.description}</p>
      {:else}
        <p class="text-sm text-gray-400">No description yet.</p>
      {/if}

      <a
        href="/messages"
        class="inline-block rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50"
      >
        Send a message about this project →
      </a>
    </div>

    <div class="space-y-4 rounded-lg border p-4 text-sm">
      <div>
        <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Status</p>
        <p class="mt-0.5 font-medium text-gray-900">
          {statusLabels[data.project.status] ?? data.project.status}
        </p>
      </div>
      {#if data.project.startedAt}
        <div>
          <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Started</p>
          <p class="mt-0.5 text-gray-800">
            {new Date(data.project.startedAt).toLocaleDateString()}
          </p>
        </div>
      {/if}
      {#if data.project.hoursPerMonth}
        <div>
          <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Hours/month</p>
          <p class="mt-0.5 text-gray-800">{data.project.hoursPerMonth}h</p>
        </div>
      {/if}
    </div>
  </div>
</div>
