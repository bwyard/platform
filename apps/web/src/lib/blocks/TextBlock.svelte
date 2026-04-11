<script lang="ts">
  const { data }: { data: Record<string, unknown> } = $props();
</script>

<section class="prose mx-auto max-w-3xl px-6 py-12">
  {#if data.content}
    <p>{data.content}</p>
  {/if}
</section>
