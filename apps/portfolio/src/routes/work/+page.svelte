<script lang="ts">
  import type { PageData } from './$types';

  const { data }: { data: PageData } = $props();

  const statusLabel: Record<string, string> = {
    active: 'active',
    paused: 'paused',
    shipped: 'shipped',
  };

  const statusColor: Record<string, string> = {
    active: 'text-green-600',
    paused: 'text-amber-500',
    shipped: 'text-blue-500',
  };
</script>

<svelte:head>
  <title>Work — Bree Yard</title>
  <meta
    name="description"
    content="Thesis projects and commercial work by Bree Yard — Score, Form, Prime, Stage, and 8 of Wands."
  />
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-20">
  <h1 class="mb-3 text-3xl font-bold tracking-tight">Work</h1>
  <p class="mb-16 text-gray-500">
    thesis tools and commercial projects. the thesis work is the part i can&rsquo;t stop building.
  </p>

  <!-- Thesis projects -->
  <section class="mb-20">
    <h2 class="mb-2 text-xs font-semibold tracking-widest text-gray-400 uppercase">
      Thesis projects
    </h2>
    <p class="mb-10 max-w-xl text-sm text-gray-500">
      four primitives: time, causality, information, context. each tool proves one or more of them
      in a different domain.
    </p>

    <ul class="space-y-8">
      {#each data.thesis as project (project.id)}
        <li id={project.id} class="border-b border-gray-100 pb-8 last:border-0">
          <div class="mb-2 flex items-baseline gap-3">
            <h3 class="text-lg font-semibold">{project.name}</h3>
            <span class="text-sm text-gray-400">{project.tagline}</span>
            <span class="ml-auto text-xs {statusColor[project.status]}">
              {statusLabel[project.status]}
            </span>
          </div>
          <p class="mb-2 max-w-2xl text-sm leading-relaxed text-gray-600">
            {project.description}
          </p>
          <p class="text-xs text-gray-400">{project.tech}</p>
        </li>
      {/each}
    </ul>
  </section>

  <!-- Commercial projects -->
  <section>
    <h2 class="mb-2 text-xs font-semibold tracking-widest text-gray-400 uppercase">Commercial</h2>
    <p class="mb-10 max-w-xl text-sm text-gray-500">
      work that pays for the thesis work. also genuinely good work, done properly.
    </p>

    <ul class="space-y-8">
      {#each data.commercial as project (project.id)}
        <li class="border-b border-gray-100 pb-8 last:border-0">
          <h3 class="mb-2 text-lg font-semibold">{project.name}</h3>
          <p class="max-w-2xl text-sm leading-relaxed text-gray-600">{project.description}</p>
        </li>
      {/each}
    </ul>
  </section>
</div>
