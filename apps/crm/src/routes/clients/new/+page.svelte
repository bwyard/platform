<script lang="ts">
  import type { ActionData } from './$types';

  const { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Add Client — CRM</title>
</svelte:head>

<div class="p-8">
  <div class="mb-6">
    <a href="/clients" class="text-sm text-gray-500 hover:underline">← Clients</a>
    <h1 class="mt-2 text-2xl font-bold">Add client</h1>
  </div>

  <form method="POST" class="max-w-lg space-y-4">
    {#if form?.error}
      <p class="rounded bg-red-50 px-4 py-3 text-sm text-red-700">{form.error}</p>
    {/if}

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <label for="name" class="text-sm font-medium"
          >Name <span class="text-red-500">*</span></label
        >
        <input
          id="name"
          name="name"
          type="text"
          required
          class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="email" class="text-sm font-medium"
          >Email <span class="text-red-500">*</span></label
        >
        <input
          id="email"
          name="email"
          type="email"
          required
          class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="flex flex-col gap-1">
        <label for="company" class="text-sm font-medium">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="phone" class="text-sm font-medium">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
        />
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <label for="techLevel" class="text-sm font-medium">Tech level</label>
      <select
        id="techLevel"
        name="techLevel"
        class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
      >
        <option value="low">Low — needs hand-holding</option>
        <option value="medium" selected>Medium — comfortable with basics</option>
        <option value="high">High — technical, self-sufficient</option>
      </select>
    </div>

    <div class="flex flex-col gap-1">
      <label for="notes" class="text-sm font-medium">Notes</label>
      <textarea
        id="notes"
        name="notes"
        rows="4"
        placeholder="Context, source, first conversation notes…"
        class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
      ></textarea>
    </div>

    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        class="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Add client
      </button>
      <a href="/clients" class="rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50">
        Cancel
      </a>
    </div>
  </form>
</div>
