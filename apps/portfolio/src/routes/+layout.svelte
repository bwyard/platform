<script lang="ts">
  import '../app.css';
  import { env } from '$env/dynamic/public';

  const { children }: { children: import('svelte').Snippet } = $props();

  const portalUrl = env.PUBLIC_PORTAL_URL ?? '/portal';
</script>

<div class="flex min-h-screen flex-col">
  <header class="border-b border-gray-200 px-6 py-4">
    <div class="mx-auto flex max-w-4xl items-center justify-between">
      <a href="/" class="text-base font-semibold tracking-tight">Bree Yard</a>
      <nav class="flex items-center gap-6 text-sm text-gray-600">
        <a href="/work" class="hover:text-black">Work</a>
        <a href="/about" class="hover:text-black">About</a>
        <a href="/contact" class="hover:text-black">Contact</a>
        <a
          href={portalUrl}
          class="rounded border border-gray-300 px-3 py-1 text-gray-700 hover:border-black hover:text-black"
        >
          Client Login
        </a>
      </nav>
    </div>
  </header>

  <main class="flex-1">
    {@render children()}
  </main>

  <footer class="border-t border-gray-200 px-6 py-8 text-center text-sm text-gray-400">
    &copy; {new Date().getFullYear()} Bree Yard
  </footer>
</div>
