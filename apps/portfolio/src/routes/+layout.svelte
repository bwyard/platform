<script lang="ts">
  import '../app.css';

  const { children }: { children: import('svelte').Snippet } = $props();
</script>

<header class="flex items-center justify-between border-b px-6 py-4">
  <a href="/" class="text-lg font-bold">Bree Yard</a>
  <nav class="flex gap-6 text-sm">
    <a href="/work" class="hover:underline">Work</a>
    <a href="/about" class="hover:underline">About</a>
    <a href="/contact" class="hover:underline">Contact</a>
  </nav>
</header>

<main>
  {@render children()}
</main>

<footer class="border-t px-6 py-8 text-center text-sm text-gray-500">
  &copy; {new Date().getFullYear()} Bree Yard
</footer>
