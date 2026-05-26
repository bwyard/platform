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
  <title>Dashboard — Client Portal</title>
</svelte:head>

<div class="p-8">
  <h1 class="mb-6 text-2xl font-bold">
    {data.client ? `Welcome, ${data.client.name}` : 'Dashboard'}
  </h1>

  {#if !data.client}
    <p class="text-sm text-gray-500">
      Your account isn't linked to a client record yet. Contact
      <a href="mailto:hello@8ofwands.com" class="underline">hello@8ofwands.com</a> to get set up.
    </p>
  {:else}
    <!-- Projects -->
    <section>
      <h2 class="mb-4 text-sm font-semibold tracking-wide text-gray-400 uppercase">
        Your projects
      </h2>

      {#if data.projects.length === 0}
        <p class="text-sm text-gray-500">No projects yet.</p>
      {:else}
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each data.projects as project (project.id)}
            <div class="rounded-lg border p-5">
              <div class="mb-3 flex items-start justify-between">
                <h3 class="font-semibold">{project.name}</h3>
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium {statusColors[
                    project.status
                  ] ?? ''}"
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
    </section>

    <!-- Quick actions -->
    <section class="mt-10">
      <h2 class="mb-4 text-sm font-semibold tracking-wide text-gray-400 uppercase">
        Quick actions
      </h2>
      <div class="flex gap-3">
        <a href="/messages" class="rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50">
          Send a message →
        </a>
      </div>
    </section>
  {/if}
</div>
