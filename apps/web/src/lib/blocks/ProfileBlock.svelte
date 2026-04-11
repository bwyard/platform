<script lang="ts">
  const { data }: { data: Record<string, unknown> } = $props();
</script>

<section class="px-6 py-20 text-center">
  {#if data.headline}
    <h1 class="mb-4 text-4xl font-bold">{data.headline}</h1>
  {/if}
  {#if data.subheadline}
    <p class="mb-6 text-xl text-gray-600">{data.subheadline}</p>
  {/if}
  {#if data.cta_label && data.cta_href}
    <a href={String(data.cta_href)} class="inline-block rounded-lg bg-black px-6 py-3 text-white">
      {data.cta_label}
    </a>
  {/if}
</section>
