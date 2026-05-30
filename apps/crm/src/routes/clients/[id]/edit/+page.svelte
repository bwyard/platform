<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData, ActionData } from './$types';

  const { data, form }: { data: PageData; form: ActionData } = $props();

  let archiveConfirm = $state(false);
</script>

<svelte:head>
  <title>Edit {data.client.name} — CRM</title>
</svelte:head>

<div class="p-8">
  <div class="mb-6">
    <a href="/clients/{data.client.id}" class="text-sm text-gray-400 hover:text-gray-700">
      ← {data.client.name}
    </a>
    <h1 class="mt-2 text-2xl font-bold">Edit client</h1>
  </div>

  <div class="max-w-lg space-y-8">
    <!-- Edit form -->
    <form method="POST" action="?/update" use:enhance class="space-y-4">
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
            value={data.client.name}
            required
            data-testid="edit-name"
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
            value={data.client.email}
            required
            data-testid="edit-email"
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
            value={data.client.company ?? ''}
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="phone" class="text-sm font-medium">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={data.client.phone ?? ''}
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label for="status" class="text-sm font-medium">Status</label>
          <select
            id="status"
            name="status"
            data-testid="edit-status"
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          >
            {#each ['prospect', 'active', 'inactive', 'churned'] as s (s)}
              <option value={s} selected={data.client.status === s}>{s}</option>
            {/each}
          </select>
        </div>
        <div class="flex flex-col gap-1">
          <label for="techLevel" class="text-sm font-medium">Tech level</label>
          <select
            id="techLevel"
            name="techLevel"
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          >
            <option value="low" selected={data.client.techLevel === 'low'}>Low</option>
            <option value="medium" selected={data.client.techLevel === 'medium'}>Medium</option>
            <option value="high" selected={data.client.techLevel === 'high'}>High</option>
          </select>
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label for="notes" class="text-sm font-medium">Notes</label>
        <textarea
          id="notes"
          name="notes"
          rows="4"
          class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          >{data.client.notes ?? ''}</textarea
        >
      </div>

      <div class="flex gap-3 pt-2">
        <button
          type="submit"
          data-testid="save-client"
          class="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Save changes
        </button>
        <a
          href="/clients/{data.client.id}"
          class="rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Cancel
        </a>
      </div>
    </form>

    <!-- Archive -->
    <div class="border-t pt-6">
      <h2 class="mb-3 text-sm font-semibold text-gray-900">Danger zone</h2>
      {#if !archiveConfirm}
        <button
          type="button"
          onclick={() => (archiveConfirm = true)}
          data-testid="archive-trigger"
          class="rounded border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Archive client
        </button>
      {:else}
        <form method="POST" action="?/archive" use:enhance class="flex items-center gap-3">
          <p class="text-sm text-gray-600">
            Archive <strong>{data.client.name}</strong>? This sets their status to churned.
          </p>
          <button
            type="submit"
            data-testid="archive-confirm"
            class="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Confirm archive
          </button>
          <button
            type="button"
            onclick={() => (archiveConfirm = false)}
            class="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </form>
      {/if}
    </div>
  </div>
</div>
