<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';
  import { page } from '$app/stores';

  const { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

  const isPublicPage = $derived(
    ['/login', '/register', '/forgot-password'].some((p) => $page.url.pathname.startsWith(p)),
  );
</script>

{#if isPublicPage || !data.user}
  {@render children()}
{:else}
  <div class="flex h-screen flex-col">
    <header class="flex items-center justify-between border-b px-6 py-4">
      <span class="text-sm font-bold">Client Portal</span>
      <nav class="flex gap-4 text-sm">
        <a href="/dashboard" class="hover:underline">Dashboard</a>
        <a href="/projects" class="hover:underline">Projects</a>
        <a href="/messages" class="hover:underline">Messages</a>
      </nav>
      <span class="text-xs text-gray-500">{data.user.email}</span>
    </header>
    <main class="flex-1 overflow-auto">
      {@render children()}
    </main>
  </div>
{/if}
