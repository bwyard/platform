<script lang="ts">
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const { counts, unreadMessages, recentClients } = $derived(data.dashboard);

  const statusColors: Record<string, string> = {
    prospect: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-600',
    churned: 'bg-red-100 text-red-700',
  };

  const statCards = $derived([
    { label: 'Total clients', value: counts.total, href: '/clients' },
    { label: 'Active', value: counts.active, href: '/clients?status=active' },
    { label: 'Prospects', value: counts.prospect, href: '/clients?status=prospect' },
    { label: 'Unread messages', value: unreadMessages, href: null },
  ]);
</script>

<svelte:head>
  <title>Dashboard — CRM</title>
</svelte:head>

<div class="p-8">
  <h1 class="mb-6 text-2xl font-bold">Dashboard</h1>

  <div class="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
    {#each statCards as card (card.label)}
      <div class="rounded-lg border bg-white p-5">
        {#if card.href}
          <a href={card.href} class="block">
            <p class="text-sm text-gray-500">{card.label}</p>
            <p
              class="mt-1 text-3xl font-bold"
              data-testid="stat-{card.label.toLowerCase().replace(/\s+/g, '-')}"
            >
              {card.value}
            </p>
          </a>
        {:else}
          <p class="text-sm text-gray-500">{card.label}</p>
          <p
            class="mt-1 text-3xl font-bold"
            data-testid="stat-{card.label.toLowerCase().replace(/\s+/g, '-')}"
          >
            {card.value}
          </p>
        {/if}
      </div>
    {/each}
  </div>

  <div>
    <div class="mb-3 flex items-center justify-between">
      <h2 class="text-sm font-semibold tracking-wide text-gray-500 uppercase">Recent activity</h2>
      <a href="/clients" class="text-sm underline">View all</a>
    </div>

    {#if recentClients.length === 0}
      <p class="text-sm text-gray-500">No clients yet.</p>
    {:else}
      <div class="overflow-hidden rounded-lg border">
        <table class="w-full text-sm" data-testid="recent-clients">
          <thead class="bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
            <tr>
              <th class="px-4 py-3 text-left">Name</th>
              <th class="px-4 py-3 text-left">Company</th>
              <th class="px-4 py-3 text-left">Status</th>
              <th class="px-4 py-3 text-left">Updated</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            {#each recentClients as client (client.id)}
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium">
                  <a href="/clients/{client.id}" class="hover:underline">{client.name}</a>
                </td>
                <td class="px-4 py-3 text-gray-600">{client.company ?? '—'}</td>
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
                  {new Date(client.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
