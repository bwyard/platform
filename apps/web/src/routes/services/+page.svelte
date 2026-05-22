<script lang="ts">
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();
</script>

<section class="mx-auto max-w-5xl px-6 py-20">
  <h1 class="text-4xl font-bold tracking-tight text-gray-900">Services</h1>
  <p class="mt-4 max-w-2xl text-lg text-gray-600">
    Senior technical leadership, available without the full-time overhead.
  </p>
</section>

<section class="border-t border-gray-100">
  <div class="mx-auto max-w-5xl px-6 py-12">
    <ul class="divide-y divide-gray-100">
      {#each data.services as service (service.title)}
        <li class="py-10">
          <article>
            <h2 class="text-xl font-semibold text-gray-900">{service.title}</h2>
            <p class="mt-3 max-w-3xl text-gray-600">{service.description}</p>
          </article>
        </li>
      {/each}
    </ul>
  </div>
</section>

<section class="border-t border-gray-100 bg-gray-50 py-16">
  <div class="mx-auto max-w-5xl px-6 text-center">
    <h2 class="text-2xl font-semibold text-gray-900">Ready to get started?</h2>
    <p class="mt-3 text-gray-600">Most engagements start with a short conversation.</p>
    <a
      href="/contact"
      class="mt-8 inline-block rounded-md bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
    >
      Get in touch
    </a>
  </div>
</section>
