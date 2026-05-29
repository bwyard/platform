<script lang="ts">
  import { goto } from '$app/navigation';
  import { signIn } from '$lib/auth';

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
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
    await goto('/clients');
  };
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
  <div class="w-full max-w-sm rounded-lg border bg-white p-8">
    <h1 class="mb-6 text-xl font-bold">Sign in</h1>
    <form onsubmit={handleSubmit} class="flex flex-col gap-4">
      <div class="flex flex-col gap-1">
        <label for="email" class="text-sm font-medium">Email</label>
        <input
          id="email"
          data-testid="login-email"
          type="email"
          bind:value={email}
          required
          autocomplete="email"
          class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
        />
      </div>
      <div class="flex flex-col gap-1">
        <label for="password" class="text-sm font-medium">Password</label>
        <div class="relative">
          <input
            id="password"
            data-testid="login-password"
            type={showPassword ? 'text' : 'password'}
            bind:value={password}
            required
            autocomplete="current-password"
            class="w-full rounded border px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-black focus:outline-none"
          />
          <button
            type="button"
            onclick={() => (showPassword = !showPassword)}
            class="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {#if showPassword}
              <!-- eye-off -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            {:else}
              <!-- eye -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            {/if}
          </button>
        </div>
      </div>
      {#if error}<p class="text-sm text-red-600">{error}</p>{/if}
      <button
        type="submit"
        data-testid="login-submit"
        disabled={loading}
        class="rounded bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  </div>
</div>
