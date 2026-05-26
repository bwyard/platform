<script lang="ts">
  import { goto } from '$app/navigation';
  import { signIn } from '$lib/auth';

  let email = $state('');
  let password = $state('');
  let error = $state('');
  let loading = $state(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    error = '';
    loading = true;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = (await signIn.email({ email, password })) as any;

    loading = false;

    if (result?.error) {
      error = (result.error as { message?: string }).message ?? 'Invalid credentials';
      return;
    }

    await goto('/dashboard');
  };
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
  <div class="w-full max-w-sm rounded-lg border bg-white p-8">
    <h1 class="mb-6 text-xl font-bold">breeyard admin</h1>

    <form onsubmit={handleSubmit} class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label for="email" class="text-sm font-medium">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          autocomplete="email"
          class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="password" class="text-sm font-medium">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          autocomplete="current-password"
          class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
        />
      </div>

      {#if error}
        <p class="text-sm text-red-600">{error}</p>
      {/if}

      <button
        type="submit"
        disabled={loading}
        class="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  </div>
</div>
