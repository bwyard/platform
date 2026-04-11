<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';
  import { page } from '$app/stores';

  const { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

  const isLoginPage = $derived($page.url.pathname === '/login');
</script>

{#if isLoginPage || !data.user}
  {@render children()}
{:else}
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="flex w-56 flex-col border-r bg-gray-50 px-4 py-6">
      <span class="mb-8 text-sm font-bold">breeyard admin</span>
      <nav class="flex flex-col gap-1 text-sm">
        <a href="/dashboard" class="rounded px-3 py-2 hover:bg-gray-200">Dashboard</a>
        <a href="/clients" class="rounded px-3 py-2 hover:bg-gray-200">Clients</a>
        <a href="/content" class="rounded px-3 py-2 hover:bg-gray-200">Content</a>
        <a href="/settings" class="rounded px-3 py-2 hover:bg-gray-200">Settings</a>
      </nav>
      <div class="mt-auto text-xs text-gray-500">
        {data.user.email}
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 overflow-auto">
      {@render children()}
    </div>
  </div>
{/if}
