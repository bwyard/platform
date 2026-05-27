<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { authClient } from '$lib/auth';

  let password = $state('');
  let confirm = $state('');
  let error = $state('');
  let loading = $state(false);

  const token = $derived($page.url.searchParams.get('token') ?? '');

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    error = '';

    if (password !== confirm) {
      error = 'Passwords do not match.';
      return;
    }

    if (password.length < 8) {
      error = 'Password must be at least 8 characters.';
      return;
    }

    loading = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (await (authClient as any).resetPassword({
      newPassword: password,
      token,
    })) as { error?: { message?: string } } | null;
    loading = false;

    if (result?.error) {
      error = result.error.message ?? 'Reset failed. The link may have expired.';
      return;
    }

    await goto('/login');
  };
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
  <div class="w-full max-w-sm rounded-lg border bg-white p-8">
    <h1 class="mb-6 text-xl font-bold">Set your password</h1>

    {#if !token}
      <p class="text-sm text-red-600">Invalid or missing reset token.</p>
      <a
        href="/forgot-password"
        class="mt-4 block text-center text-sm text-gray-500 hover:text-gray-700"
      >
        Request a new link
      </a>
    {:else}
      <form onsubmit={handleSubmit} class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="password" class="text-sm font-medium">New password</label>
          <input
            id="password"
            type="password"
            bind:value={password}
            required
            autocomplete="new-password"
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label for="confirm" class="text-sm font-medium">Confirm password</label>
          <input
            id="confirm"
            type="password"
            bind:value={confirm}
            required
            autocomplete="new-password"
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
        {#if error}<p class="text-sm text-red-600">{error}</p>{/if}
        <button
          type="submit"
          disabled={loading}
          class="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Set password'}
        </button>
      </form>
    {/if}
  </div>
</div>
