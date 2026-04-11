<script lang="ts">
  const { data }: { data: Record<string, unknown> } = $props();
</script>

<section class="mx-auto max-w-3xl px-6 py-16">
  {#if data.heading}
    <h2 class="mb-6 text-3xl font-bold">{data.heading}</h2>
  {/if}
  {#if data.body}
    <p class="leading-relaxed text-gray-700">{data.body}</p>
  {/if}
</section>
