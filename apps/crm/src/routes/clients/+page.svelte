<script lang="ts">
  import type { PageData } from './$types';
  import type { ClientStatus } from '@breeyard/shared';

  const { data }: { data: PageData } = $props();

  let search = $state('');
  let statusFilter = $state<ClientStatus | 'all'>('all');

  const statuses: (ClientStatus | 'all')[] = ['all', 'prospect', 'active', 'inactive', 'churned'];

  const filtered = $derived(
    data.clients.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company ?? '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    }),
  );

  const statusColors: Record<string, string> = {
    prospect: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-600',
    churned: 'bg-red-100 text-red-700',
  };

  const statusCounts = $derived(
    Object.fromEntries(
      statuses.map((s) => [
        s,
        s === 'all' ? data.clients.length : data.clients.filter((c) => c.status === s).length,
      ]),
    ),
  );
</script>

<svelte:head>
  <title>Clients — CRM</title>
</svelte:head>

<div class="p-8">
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold">Clients</h1>
      <p class="mt-1 text-sm text-gray-500">{filtered.length} of {data.clients.length}</p>
    </div>
    <a
      href="/clients/new"
      class="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
    >
      Add client
    </a>
  </div>

  <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
    <input
      type="search"
      placeholder="Search by name, email or company…"
      bind:value={search}
      data-testid="client-search"
      class="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none sm:max-w-xs"
    />
    <div class="flex flex-wrap gap-1" data-testid="status-filters">
      {#each statuses as s (s)}
        <button
          type="button"
          onclick={() => (statusFilter = s)}
          data-testid="filter-{s}"
          class="rounded-full px-3 py-1 text-xs font-medium transition-colors
            {statusFilter === s
            ? 'bg-black text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}"
        >
          {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
          <span class="ml-1 opacity-70">({statusCounts[s]})</span>
        </button>
      {/each}
    </div>
  </div>

  {#if data.clients.length === 0}
    <div class="rounded-lg border border-dashed p-12 text-center">
      <p class="text-sm text-gray-500">No clients yet.</p>
      <a href="/clients/new" class="mt-2 inline-block text-sm font-medium underline">
        Add your first client
      </a>
    </div>
  {:else if filtered.length === 0}
    <div class="rounded-lg border border-dashed p-12 text-center">
      <p class="text-sm text-gray-500">No clients match your filter.</p>
      <button
        type="button"
        onclick={() => {
          search = '';
          statusFilter = 'all';
        }}
        class="mt-2 text-sm font-medium underline"
      >
        Clear filters
      </button>
    </div>
  {:else}
    <div class="overflow-hidden rounded-lg border" data-testid="clients-table">
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
          {#each filtered as client (client.id)}
            <tr class="hover:bg-gray-50" data-testid="client-row">
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
