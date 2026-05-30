<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  const { data, form }: { data: PageData; form: ActionData } = $props();

  const statusColors: Record<string, string> = {
    discovery: 'bg-blue-100 text-blue-800',
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
  };

  const toDateInput = (d: Date | string | null) =>
    d ? new Date(d).toISOString().slice(0, 10) : '';

  let editing = $state(false);
</script>

<svelte:head>
  <title>{data.project.name} — CRM</title>
</svelte:head>

<div class="p-8">
  <div class="mb-6">
    {#if data.project.client}
      <a href="/clients/{data.project.client.id}" class="text-sm text-gray-400 hover:text-gray-700">
        ← {data.project.client.name}
      </a>
    {:else}
      <a href="/projects" class="text-sm text-gray-400 hover:text-gray-700">← Projects</a>
    {/if}
  </div>

  <div class="mb-6 flex items-start justify-between">
    <div>
      <h1 class="text-2xl font-bold" data-testid="project-name">{data.project.name}</h1>
      {#if data.project.client}
        <p class="mt-1 text-sm text-gray-500">{data.project.client.name}</p>
      {/if}
    </div>
    <div class="flex items-center gap-2">
      <button
        type="button"
        onclick={() => (editing = !editing)}
        data-testid="edit-project-toggle"
        class="rounded border px-3 py-1 text-sm font-medium hover:bg-gray-50"
      >
        {editing ? 'Cancel' : 'Edit'}
      </button>
      <span
        class="rounded-full px-3 py-1 text-sm font-medium {statusColors[data.project.status] ?? ''}"
      >
        {data.project.status}
      </span>
    </div>
  </div>

  {#if editing}
    <!-- Edit form -->
    <form
      method="POST"
      action="?/update"
      use:enhance
      class="mb-8 max-w-lg space-y-4 rounded-lg border p-6"
    >
      <h2 class="font-semibold">Edit project</h2>

      {#if form?.error}
        <p class="rounded bg-red-50 px-4 py-2 text-sm text-red-700">{form.error}</p>
      {/if}
      {#if form?.updated}
        <p class="rounded bg-green-50 px-4 py-2 text-sm text-green-700">Saved.</p>
      {/if}

      <div class="flex flex-col gap-1">
        <label for="name" class="text-sm font-medium">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={data.project.name}
          required
          data-testid="project-name-input"
          class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="description" class="text-sm font-medium">Description</label>
        <textarea
          id="description"
          name="description"
          rows="3"
          class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          >{data.project.description ?? ''}</textarea
        >
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label for="status" class="text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
            data-testid="project-status-select"
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          >
            {#each ['discovery', 'active', 'paused', 'completed', 'cancelled'] as s (s)}
              <option value={s} selected={data.project.status === s}>{s}</option>
            {/each}
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label for="hoursPerMonth" class="text-sm font-medium">Hours/month</label>
          <input
            id="hoursPerMonth"
            name="hoursPerMonth"
            type="number"
            min="0"
            value={data.project.hoursPerMonth ?? ''}
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label for="startedAt" class="text-sm font-medium">Start date</label>
          <input
            id="startedAt"
            name="startedAt"
            type="date"
            value={toDateInput(data.project.startedAt)}
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="completedAt" class="text-sm font-medium">Completed date</label>
          <input
            id="completedAt"
            name="completedAt"
            type="date"
            value={toDateInput(data.project.completedAt)}
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        data-testid="save-project"
        class="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Save changes
      </button>
    </form>
  {/if}

  <!-- Project info -->
  <div class="grid grid-cols-3 gap-8">
    <div class="col-span-2 space-y-4">
      {#if data.project.description}
        <p class="text-sm text-gray-700">{data.project.description}</p>
      {/if}
    </div>

    <div class="space-y-3 rounded-lg border p-4 text-sm">
      {#if data.project.hoursPerMonth}
        <div>
          <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Hours/month</p>
          <p class="text-gray-800">{data.project.hoursPerMonth}h</p>
        </div>
      {/if}
      {#if data.project.startedAt}
        <div>
          <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Started</p>
          <p class="text-gray-800">{new Date(data.project.startedAt).toLocaleDateString()}</p>
        </div>
      {/if}
      {#if data.project.completedAt}
        <div>
          <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Completed</p>
          <p class="text-gray-800">{new Date(data.project.completedAt).toLocaleDateString()}</p>
        </div>
      {/if}
      <div>
        <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Created</p>
        <p class="text-gray-800">{new Date(data.project.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  </div>
</div>
