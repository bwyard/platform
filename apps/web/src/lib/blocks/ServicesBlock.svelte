<script lang="ts">
  import type { Service } from './types';

  const { data }: { data: Record<string, unknown> } = $props();

  const services = (): Service[] => (Array.isArray(data.items) ? (data.items as Service[]) : []);
</script>

<section class="px-6 py-16">
  {#if data.heading}
    <h2 class="mb-10 text-center text-3xl font-bold">{data.heading}</h2>
  {/if}
  <div class="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
    {#each services() as service (service.title)}
      <div class="rounded-lg border p-6">
        <h3 class="mb-2 text-xl font-semibold">{service.title}</h3>
        <p class="text-gray-600">{service.description}</p>
      </div>
    {/each}
  </div>
</section>
