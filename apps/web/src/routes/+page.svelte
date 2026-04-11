<script lang="ts">
  import type { PageData } from './$types';
  import { blockRegistry } from '$lib/blocks/registry';
  import DefaultBlock from '$lib/blocks/DefaultBlock.svelte';

  const { data }: { data: PageData } = $props();
</script>

{#each data.blocks as block (block.id)}
  {@const Comp = blockRegistry[block.type]}
  {#if Comp}
    <Comp data={block.data} />
  {:else}
    <DefaultBlock data={block.data} blockType={block.type} />
  {/if}
{/each}

{#if data.blocks.length === 0}
  <section class="px-6 py-20 text-center text-gray-400">
    <p>No content blocks configured yet.</p>
  </section>
{/if}
