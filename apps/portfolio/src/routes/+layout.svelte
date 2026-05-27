<script lang="ts">
  import '../app.css';

  const { children }: { children: import('svelte').Snippet } = $props();
</script>

<div class="flex min-h-screen flex-col">
  <header class="border-b border-gray-200 px-6 py-4">
    <div class="mx-auto flex max-w-4xl items-center justify-between">
      <a href="/" class="text-base font-semibold tracking-tight">Bree Yard</a>
      <nav class="flex gap-6 text-sm text-gray-600">
        <a href="/work" class="hover:text-black">Work</a>
        <a href="/about" class="hover:text-black">About</a>
        <a href="/contact" class="hover:text-black">Contact</a>
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
