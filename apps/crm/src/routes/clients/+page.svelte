<script lang="ts">
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const statusColors: Record<string, string> = {
    prospect: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-600',
    churned: 'bg-red-100 text-red-700',
  };
</script>

<svelte:head>
  <title>Clients — CRM</title>
</svelte:head>

<div class="p-8">
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Clients</h1>
      <p class="mt-1 text-sm text-gray-500">{data.clients.length} total</p>
    </div>
    <a
      href="/clients/new"
      class="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
    >
      Add client
    </a>
  </div>

  {#if data.clients.length === 0}
    <div class="rounded-lg border border-dashed p-12 text-center">
      <p class="text-sm text-gray-500">No clients yet.</p>
      <a href="/clients/new" class="mt-2 inline-block text-sm font-medium underline">
        Add your first client
      </a>
    </div>
  {:else}
    <div class="overflow-hidden rounded-lg border">
      <table class="w-full text-sm">
        <thead class="bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
          <tr>
            <th class="px-4 py-3 text-left">Name</th>
            <th class="px-4 py-3 text-left">Company</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Status</th>
            <th class="px-4 py-3 text-left">Added</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          {#each data.clients as client (client.id)}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3 font-medium">
                <a href="/clients/{client.id}" class="hover:underline">{client.name}</a>
              </td>
              <td class="px-4 py-3 text-gray-600">{client.company ?? '—'}</td>
              <td class="px-4 py-3 text-gray-600">{client.email}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium {statusColors[
                    client.status
                  ] ?? ''}"
                >
                  {client.status}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-500">
                {new Date(client.createdAt).toLocaleDateString()}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
