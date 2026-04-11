<script lang="ts">
  const { data }: { data: Record<string, unknown> } = $props();
</script>

<section class="mx-auto max-w-xl px-6 py-16">
  {#if data.heading}
    <h2 class="mb-6 text-3xl font-bold">{data.heading}</h2>
  {/if}
  {#if data.email}
    <a href="mailto:{data.email}" class="text-blue-600 underline">{data.email}</a>
  {/if}
</section>
