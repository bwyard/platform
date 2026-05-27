<script lang="ts">
  import '../app.css';
  import { env } from '$env/dynamic/public';

  const { children }: { children: import('svelte').Snippet } = $props();

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'Contact', href: '/contact' },
  ] as const;

  const portalUrl = env.PUBLIC_PORTAL_URL ?? '/portal';
</script>

<header class="border-b border-gray-200 bg-white">
  <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
    <a href="/" class="text-lg font-semibold tracking-tight text-gray-900">8 of Wands</a>
    <nav aria-label="Main navigation" class="flex items-center gap-6">
      <ul class="flex gap-6 text-sm font-medium text-gray-600">
        {#each navItems as item (item.href)}
          <li>
            <a href={item.href} class="transition-colors hover:text-gray-900">{item.label}</a>
          </li>
        {/each}
      </ul>
      <a
        href={portalUrl}
        class="rounded border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
      >
        Client Login
      </a>
    </nav>
  </div>
</header>

<main class="min-h-screen">
  {@render children()}
</main>

<footer class="border-t border-gray-200 bg-white">
  <div class="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-gray-500">
    <p>&copy; {new Date().getFullYear()} 8 of Wands</p>
  </div>
</footer>
