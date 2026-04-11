<script lang="ts">
  import '../app.css';
  import type { LayoutData } from './$types';

  const { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

  const visibleNav = () => data.nav.filter((item) => item.visible && item.parentId === null);
</script>

<header class="flex items-center justify-between border-b px-6 py-4">
  <a href="/" class="text-lg font-bold">breeyard</a>
  <nav class="flex gap-6 text-sm">
    {#each visibleNav() as item (item.id)}
      <a href={item.href} target={item.target} class="hover:underline">{item.label}</a>
    {/each}
  </nav>
</header>

<main>
  {@render children()}
</main>

<footer class="border-t px-6 py-8 text-center text-sm text-gray-500">
  &copy; {new Date().getFullYear()} breeyard
</footer>
