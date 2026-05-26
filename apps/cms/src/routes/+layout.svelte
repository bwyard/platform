<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';
  import { page } from '$app/stores';

  const { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

  const isLoginPage = $derived($page.url.pathname === '/login');

  const nav = [
    { href: '/blocks', label: 'Blocks' },
    { href: '/pages', label: 'Pages' },
    { href: '/nav', label: 'Navigation' },
    { href: '/media', label: 'Media' },
    { href: '/templates', label: 'Templates' },
    { href: '/gallery', label: 'Gallery' },
  ];
</script>

{#if isLoginPage || !data.user}
  {@render children()}
{:else}
  <div class="flex h-screen">
    <aside class="flex w-56 flex-col border-r bg-gray-50 px-4 py-6">
      <span class="mb-8 text-sm font-bold">CMS</span>
      <nav class="flex flex-col gap-1 text-sm">
        {#each nav as item (item.href)}
          <a href={item.href} class="rounded px-3 py-2 hover:bg-gray-200">{item.label}</a>
        {/each}
      </nav>
      <div class="mt-auto text-xs text-gray-500">
        {data.user.email}
      </div>
    </aside>
    <div class="flex-1 overflow-auto">
      {@render children()}
    </div>
  </div>
{/if}
