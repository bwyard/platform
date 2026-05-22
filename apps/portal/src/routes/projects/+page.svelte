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
</script>

<svelte:head>
  <title>Projects — Client Portal</title>
</svelte:head>

<div class="p-8">
  <h1 class="mb-6 text-2xl font-bold">Projects</h1>

  {#if data.projects.length === 0}
    <p class="text-sm text-gray-500">No projects yet. Reach out to get started.</p>
  {:else}
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.projects as project (project.id)}
        <div class="rounded-lg border bg-white p-5 shadow-sm">
          <div class="mb-3 flex items-start justify-between">
            <h3 class="font-semibold">{project.name}</h3>
            <span
              class="rounded-full px-2 py-0.5 text-xs font-medium {statusColors[project.status] ??
                ''}"
            >
              {project.status}
            </span>
          </div>
          {#if project.description}
            <p class="text-sm text-gray-500">{project.description}</p>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
