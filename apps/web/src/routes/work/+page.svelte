<script lang="ts">
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();
</script>

<section class="mx-auto max-w-5xl px-6 py-20">
  <h1 class="text-4xl font-bold tracking-tight text-gray-900">Work</h1>
  <p class="mt-4 max-w-2xl text-lg text-gray-600">
    A selection of engagements — the kinds of problems I've been brought in to solve.
  </p>
</section>

<section class="border-t border-gray-100">
  <div class="mx-auto max-w-5xl px-6 py-12">
    <ul class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {#each data.caseStudies as study (study.title)}
        <li>
          <article class="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6">
            <h2 class="text-lg font-semibold text-gray-900">{study.title}</h2>
            <p class="mt-3 flex-1 text-sm text-gray-600">{study.description}</p>
            <ul class="mt-5 flex flex-wrap gap-2" aria-label="Tags">
              {#each study.tags as tag (tag)}
                <li class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {tag}
                </li>
              {/each}
            </ul>
          </article>
        </li>
      {/each}
    </ul>
  </div>
</section>

<section class="border-t border-gray-100 py-12">
  <div class="mx-auto max-w-5xl px-6">
    <p class="text-sm text-gray-500">
      Full portfolio at
      <a
        href="https://breeyard.com"
        class="font-medium text-gray-900 underline underline-offset-4 hover:text-gray-600"
        target="_blank"
        rel="noopener noreferrer"
      >
        breeyard.com
      </a>
    </p>
  </div>
</section>
