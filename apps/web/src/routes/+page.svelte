<script lang="ts">
  import type { PageData } from './$types';

  const { data: _data }: { data: PageData } = $props();
</script>

<section class="mx-auto max-w-5xl px-6 py-24 text-center">
  <h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
    Fractional CTO Services
  </h1>
  <p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
    Strategy, architecture, and execution for growing teams.
  </p>
  <div class="mt-10">
    <a
      href="/contact"
      class="inline-block rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
    >
      Let's talk
    </a>
  </div>
</section>

<section class="border-t border-gray-100 bg-gray-50 py-20">
  <div class="mx-auto max-w-5xl px-6">
    <h2 class="text-2xl font-semibold text-gray-900">What I do</h2>
    <p class="mt-4 max-w-2xl text-gray-600">
      I work with small-to-mid businesses that need senior technical leadership without the overhead
      of a full-time hire. Whether you're building from scratch, scaling a team, or untangling years
      of technical debt — I help you move with intention.
    </p>
    <a
      href="/services"
      class="mt-8 inline-block text-sm font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"
    >
      View all services
    </a>
  </div>
</section>
