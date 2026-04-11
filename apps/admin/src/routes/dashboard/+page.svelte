<script lang="ts">
  import type { LayoutData } from '../$types';
  import { page } from '$app/stores';

  const layoutData = $derived($page.data as LayoutData);
</script>

<div class="p-8">
  <h1 class="mb-2 text-2xl font-bold">Dashboard</h1>
  <p class="mb-8 text-sm text-gray-500">
    Welcome back, {layoutData.user?.name ?? layoutData.user?.email ?? '—'}
  </p>

  <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
    <div class="rounded-lg border p-6">
      <p class="mb-1 text-sm text-gray-500">Clients</p>
      <p class="text-2xl font-bold">—</p>
    </div>
    <div class="rounded-lg border p-6">
      <p class="mb-1 text-sm text-gray-500">Active projects</p>
      <p class="text-2xl font-bold">—</p>
    </div>
    <div class="rounded-lg border p-6">
      <p class="mb-1 text-sm text-gray-500">Open messages</p>
      <p class="text-2xl font-bold">—</p>
    </div>
  </div>
</div>
