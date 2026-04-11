<script lang="ts">
  const { data, blockType }: { data: Record<string, unknown>; blockType: string } = $props();
</script>

<!-- Fallback for block types without a registered component -->
<section
  class="rounded border border-dashed border-gray-300 px-6 py-8 text-center text-sm text-gray-400"
>
  [{blockType}]
</section>
