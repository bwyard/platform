<script lang="ts">
  import { authClient } from '$lib/auth';

  let email = $state('');
  let sent = $state(false);
  let error = $state('');
  let loading = $state(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    error = '';
    loading = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (await (authClient as any).requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    })) as { error?: { message?: string } } | null;
    loading = false;
    if (result?.error) {
      error = result.error.message ?? 'Something went wrong.';
      return;
    }
    sent = true;
  };
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
  <div class="w-full max-w-sm rounded-lg border bg-white p-8">
    <h1 class="mb-2 text-xl font-bold">Reset your password</h1>

    {#if sent}
      <p class="text-sm text-gray-600">Check your email — we sent a link to reset your password.</p>
      <a href="/login" class="mt-4 block text-center text-sm text-gray-500 hover:text-gray-700">
        Back to sign in
      </a>
    {:else}
      <p class="mb-6 text-sm text-gray-500">Enter your email and we'll send you a reset link.</p>
      <form onsubmit={handleSubmit} class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="email" class="text-sm font-medium">Email</label>
          <input
            id="email"
            data-testid="forgot-password-email"
            type="email"
            bind:value={email}
            required
            autocomplete="email"
            class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>
        {#if error}<p class="text-sm text-red-600">{error}</p>{/if}
        <button
          type="submit"
          data-testid="forgot-password-submit"
          disabled={loading}
          class="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
        <a href="/login" class="text-center text-xs text-gray-400 hover:text-gray-600">
          Back to sign in
        </a>
      </form>
    {/if}
  </div>
</div>
