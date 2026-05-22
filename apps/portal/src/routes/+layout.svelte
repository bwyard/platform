<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';
  import { page } from '$app/stores';

  const { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

  const isPublicPage = $derived(
    ['/login', '/register', '/forgot-password'].some((p) => $page.url.pathname.startsWith(p)),
  );

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/messages', label: 'Messages' },
  ];
</script>

{#if isPublicPage || !data.user}
  {@render children()}
{:else}
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="flex w-56 flex-shrink-0 flex-col border-r bg-white">
      <div class="border-b px-5 py-5">
        <p class="text-xs font-semibold tracking-widest text-gray-400 uppercase">8 of Wands</p>
        <p class="mt-0.5 text-sm font-semibold text-gray-900">Client Portal</p>
      </div>

      <nav class="flex-1 space-y-0.5 px-3 py-4">
        {#each navLinks as link (link.href)}
          {@const active = $page.url.pathname.startsWith(link.href)}
          <a
            href={link.href}
            class="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
              {active
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
          >
            {link.label}
          </a>
        {/each}
      </nav>

      <div class="border-t px-5 py-4">
        <p class="truncate text-xs text-gray-400">{data.user.email}</p>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 overflow-auto">
      {@render children()}
    </main>
  </div>
{/if}
