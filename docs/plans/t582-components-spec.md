# t582 — @breeyard/components Full Specification

**Task:** t582
**Package:** `@breeyard/components` → `packages/core/components/`
**Status:** Spec complete — ready to implement
**Date:** 2026-06-01

---

## 1. Package Setup

### Location

```
packages/core/components/
  src/
    LoginForm.svelte
    SidebarLayout.svelte
    HeaderLayout.svelte
    MessageThread.svelte
    MessageComposer.svelte
    ContactForm.svelte
    ForgotPasswordForm.svelte
    ResetPasswordForm.svelte
    index.ts
  package.json
  tsconfig.json
```

`packages/core/*` is already in `pnpm-workspace.yaml` — no workspace change needed.

### package.json

```json
{
  "name": "@breeyard/components",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src",
    "test": "vitest"
  },
  "dependencies": {
    "@breeyard/ui": "workspace:*"
  },
  "devDependencies": {
    "@sveltejs/kit": "^2.0.0",
    "svelte": "^5.0.0",
    "typescript": "6.0.3"
  },
  "peerDependencies": {
    "@sveltejs/kit": ">=2.0.0",
    "svelte": ">=5.0.0"
  }
}
```

### tsconfig.json

```json
{
  "extends": "../../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["**/*.test.ts"]
}
```

### index.ts (export surface)

```ts
// @breeyard/components — SvelteKit-coupled component layer
// Composes @breeyard/ui primitives. Never import from bits-ui directly.

// ── Auth forms ───────────────────────────────────────────────────────────────
export { default as LoginForm } from './LoginForm.svelte';
export { default as ForgotPasswordForm } from './ForgotPasswordForm.svelte';
export { default as ResetPasswordForm } from './ResetPasswordForm.svelte';

// ── Layouts ──────────────────────────────────────────────────────────────────
export { default as SidebarLayout } from './SidebarLayout.svelte';
export { default as HeaderLayout } from './HeaderLayout.svelte';

// ── Messaging ────────────────────────────────────────────────────────────────
export { default as MessageThread } from './MessageThread.svelte';
export { default as MessageComposer } from './MessageComposer.svelte';

// ── Marketing ────────────────────────────────────────────────────────────────
export { default as ContactForm } from './ContactForm.svelte';
```

---

## 2. Boundary Rules (permanent)

| Rule                                | Detail                                                          |
| ----------------------------------- | --------------------------------------------------------------- |
| SvelteKit imports allowed           | `$app/forms`, `$app/stores`, `$app/navigation`, `@sveltejs/kit` |
| @breeyard/ui — YES                  | All UI primitives come from here                                |
| bits-ui — NEVER                     | Apps and components never import bits-ui directly               |
| @breeyard/hooks — when available    | useMediaQuery for responsive layouts                            |
| No raw HTML form logic              | All forms use use:enhance + server action pattern               |
| .svelte files distributed as source | Same as @breeyard/ui — tsc handles .ts only                     |
| No circular imports                 | @breeyard/ui must not import from @breeyard/components          |

---

## 3. Component Specifications

---

### 3.1 — LoginForm

**Purpose:** Replaces the duplicate login page forms in CMS, CRM, and Portal.
Server action pattern only — no client-side signIn.email().

**Props:**

```ts
type Props = {
  serverError?: string; // from +page.svelte form?.error
  onSuccess?: () => void; // escape hatch: overrides applyAction redirect (modal/inline use)
  class?: string;
};
```

**SvelteKit imports:**

```ts
import { enhance, applyAction } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
```

**@breeyard/ui imports:**

```ts
import { Button, Input, Label, Alert } from '@breeyard/ui';
```

**State:**

```ts
let loading = $state(false);
let clientError = $state('');
const errorMessage = $derived(clientError || serverError || '');
```

**Submit handler:**

```ts
const handleSubmit: SubmitFunction = () => {
  loading = true;
  clientError = '';
  return async ({ result, update }) => {
    if (result.type === 'redirect' || result.type === 'success') {
      onSuccess ? onSuccess() : await applyAction(result);
    } else if (result.type === 'failure') {
      clientError = (result.data?.error as string) ?? 'Invalid email or password.';
      loading = false;
      await update({ reset: false });
    } else {
      clientError = 'Something went wrong. Please try again.';
      loading = false;
      await update({ reset: false });
    }
  };
};
```

**Template structure:**

```svelte
<form method="post" use:enhance={handleSubmit} class={...}>
  {#if errorMessage}
    <Alert variant="destructive">{errorMessage}</Alert>
  {/if}
  <div class="space-y-4">
    <div>
      <Label for="email">Email</Label>
      <Input id="email" name="email" type="email" required autocomplete="email" />
    </div>
    <div>
      <Label for="password">Password</Label>
      <Input id="password" name="password" type="password" required autocomplete="current-password" />
    </div>
    <Button type="submit" class="w-full" disabled={loading}>
      {loading ? 'Signing in…' : 'Sign in'}
    </Button>
  </div>
</form>
```

**Server action pattern (each app's +page.server.ts):**

```ts
import { fail, redirect } from '@sveltejs/kit';
import { loginSchema } from '@breeyard/validation';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    const data = await request.formData();
    const parsed = loginSchema.safeParse({
      email: data.get('email'),
      password: data.get('password'),
    });
    if (!parsed.success) return fail(400, { error: parsed.error.issues[0]?.message });
    const response = await fetch('/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });
    if (!response.ok) return fail(401, { error: 'Invalid email or password.' });
    redirect(302, '/');
  },
};
```

**Consumer pattern (+page.svelte):**

```svelte
<script lang="ts">
  import { LoginForm } from '@breeyard/components';
  import type { PageData, ActionData } from './$types';
  const { form }: { form: ActionData } = $props();
</script>

<LoginForm serverError={form?.error} />
```

**Escape hatch (modal use):**

```svelte
<LoginForm onSuccess={() => (modalOpen = false)} />
```

**Apps to migrate:** apps/crm/login, apps/cms/login, apps/portal/login

---

### 3.2 — SidebarLayout

**Purpose:** Shared shell for CRM, CMS, Portal. Handles sidebar nav, active link state,
user display, public page passthrough. Replaces 3 near-identical +layout.svelte files.

**Props:**

```ts
type NavItem = {
  href: string;
  label: string;
};

type BrandConfig = {
  name: string; // e.g. 'CRM', 'CMS', '8 of Wands'
  subName?: string; // e.g. 'Client Portal' (portal has two-line header)
};

type Props = {
  brand: BrandConfig;
  navItems: NavItem[];
  userEmail: string;
  publicPaths?: string[]; // paths that bypass sidebar (default: ['/login'])
  children: import('svelte').Snippet;
  class?: string;
};
```

**SvelteKit imports:**

```ts
import { page } from '$app/stores';
```

**State:**

```ts
// No $state needed — everything derived from page store and props
const isPublicPage = $derived(
  (publicPaths ?? ['/login']).some((p) => $page.url.pathname.startsWith(p)),
);
const isAuthenticated = $derived(!!userEmail);
```

**Active link logic:**

```ts
// startsWith for section matching, exact for root /
const isActive = (href: string) =>
  href === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(href);
```

**Template structure:**

```svelte
{#if isPublicPage || !isAuthenticated}
  {@render children()}
{:else}
  <div class="flex h-screen">
    <aside class="flex w-56 flex-shrink-0 flex-col border-r bg-white">
      <!-- Brand header -->
      <div class="border-b px-5 py-5">
        {#if brand.subName}
          <p class="text-xs font-semibold tracking-widest text-gray-400 uppercase">{brand.name}</p>
          <p class="mt-0.5 text-sm font-semibold text-gray-900">{brand.subName}</p>
        {:else}
          <p class="text-sm font-bold">{brand.name}</p>
        {/if}
      </div>
      <!-- Nav -->
      <nav class="flex-1 space-y-0.5 px-3 py-4">
        {#each navItems as item (item.href)}
          {@const active = isActive(item.href)}
          <a
            href={item.href}
            class="flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
              {active
              ? 'bg-gray-100 text-gray-900'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}"
          >
            {item.label}
          </a>
        {/each}
      </nav>
      <!-- User footer -->
      <div class="border-t px-5 py-4">
        <p class="truncate text-xs text-gray-400">{userEmail}</p>
      </div>
    </aside>
    <main class="flex-1 overflow-auto">
      {@render children()}
    </main>
  </div>
{/if}
```

**Consumer pattern (each app's +layout.svelte):**

```svelte
<script lang="ts">
  import '../app.css';
  import { SidebarLayout } from '@breeyard/components';
  import type { LayoutData } from './$types';

  const { children, data }: { children: import('svelte').Snippet; data: LayoutData } = $props();

  const nav = [
    { href: '/', label: 'Dashboard' },
    { href: '/clients', label: 'Clients' },
    { href: '/projects', label: 'Projects' },
    { href: '/invoices', label: 'Invoices' },
  ];
</script>

<SidebarLayout brand={{ name: 'CRM' }} navItems={nav} userEmail={data.user?.email ?? ''}>
  {@render children()}
</SidebarLayout>
```

**Portal variant (two-line brand, multiple public paths):**

```svelte
<SidebarLayout
  brand={{ name: '8 of Wands', subName: 'Client Portal' }}
  navItems={nav}
  userEmail={data.user?.email ?? ''}
  publicPaths={['/login', '/register', '/forgot-password', '/reset-password']}
>
  {@render children()}
</SidebarLayout>
```

**Apps to migrate:** apps/crm/+layout.svelte, apps/cms/+layout.svelte, apps/portal/+layout.svelte

---

### 3.3 — HeaderLayout

**Purpose:** Marketing app shell for apps/web and apps/portfolio. Centered header with
logo left, nav right, optional portal/CTA link, footer. Lower priority than SidebarLayout.

**Props:**

```ts
type NavItem = {
  href: string;
  label: string;
};

type Props = {
  brand: string; // e.g. '8 of Wands', 'Bree Yard'
  navItems: NavItem[];
  ctaHref?: string; // e.g. portalUrl — renders bordered button on right
  ctaLabel?: string; // e.g. 'Client Login'
  footerText?: string; // defaults to '© {year} {brand}'
  children: import('svelte').Snippet;
  class?: string;
};
```

**SvelteKit imports:**

```ts
import { page } from '$app/stores';
```

**Template structure:**

```svelte
<div class="flex min-h-screen flex-col">
  <header class="border-b border-gray-200 bg-white">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
      <a href="/" class="text-lg font-semibold tracking-tight text-gray-900">{brand}</a>
      <nav aria-label="Main navigation" class="flex items-center gap-6">
        <ul class="flex gap-6 text-sm font-medium text-gray-600">
          {#each navItems as item (item.href)}
            <li>
              <a href={item.href} class="transition-colors hover:text-gray-900">{item.label}</a>
            </li>
          {/each}
        </ul>
        {#if ctaHref}
          <a
            href={ctaHref}
            class="rounded border border-gray-300 px-3 py-1 text-sm font-medium ..."
          >
            {ctaLabel ?? 'Portal'}
          </a>
        {/if}
      </nav>
    </div>
  </header>
  <main class="flex-1">
    {@render children()}
  </main>
  <footer class="border-t border-gray-200 bg-white">
    <div class="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-gray-500">
      <p>{footerText ?? `© ${new Date().getFullYear()} ${brand}`}</p>
    </div>
  </footer>
</div>
```

**Apps to migrate:** apps/web/+layout.svelte, apps/portfolio/+layout.svelte

---

### 3.4 — MessageThread

**Purpose:** Scrollable list of messages using MessageBubble from @breeyard/ui.
Auto-scrolls to bottom when new messages arrive. Display-only — no form logic.

**Props:**

```ts
type Message = {
  id: string;
  body: string;
  fromClient: boolean;
  createdAt: string | Date;
  senderLabel: string;
};

type Props = {
  messages: Message[];
  emptyMessage?: string; // defaults to 'No messages yet.'
  class?: string;
};
```

**@breeyard/ui imports:**

```ts
import { MessageBubble, EmptyState } from '@breeyard/ui';
```

**State:**

```ts
let threadEl: HTMLDivElement | undefined;

$effect(() => {
  // re-runs whenever messages changes — scrolls to bottom
  void messages;
  threadEl?.scrollTo({ top: threadEl.scrollHeight, behavior: 'smooth' });
});
```

**Template structure:**

```svelte
<div bind:this={threadEl} class="flex-1 space-y-4 overflow-y-auto px-6 py-6 {className}">
  {#if messages.length === 0}
    <div class="flex h-full items-center justify-center">
      <EmptyState message={emptyMessage ?? 'No messages yet.'} />
    </div>
  {:else}
    {#each messages as message (message.id)}
      <MessageBubble
        body={message.body}
        sent={!message.fromClient}
        senderLabel={message.senderLabel}
        timestamp={String(message.createdAt)}
      />
    {/each}
  {/if}
</div>
```

**Note:** MessageThread is display-only. Pair with MessageComposer for send functionality.

---

### 3.5 — MessageComposer

**Purpose:** Textarea + send button with use:enhance. Handles Cmd+Enter / Ctrl+Enter.
Clears body on successful send. Pairs with MessageThread.

**Props:**

```ts
type Props = {
  action: string; // form action e.g. '?/reply', '?/send'
  recipientName?: string; // used in placeholder text
  submitLabel?: string; // defaults to 'Send'
  disabled?: boolean;
  class?: string;
};
```

**SvelteKit imports:**

```ts
import { enhance } from '$app/forms';
```

**@breeyard/ui imports:**

```ts
import { Textarea, Button } from '@breeyard/ui';
```

**State:**

```ts
let body = $state('');
let sending = $state(false);
```

**Submit handler:**

```ts
const handleSubmit: SubmitFunction = () => {
  sending = true;
  return async ({ update, result }) => {
    if (result.type === 'success' || result.type === 'redirect') {
      body = '';
    }
    sending = false;
    await update({ reset: false });
  };
};
```

**Keyboard handler:**

```ts
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    (e.currentTarget as HTMLTextAreaElement).form?.requestSubmit();
  }
};
```

**Template structure:**

```svelte
<div class="border-t px-6 py-4 {className}">
  <form method="POST" {action} use:enhance={handleSubmit} class="flex items-end gap-3">
    <Textarea
      name="body"
      bind:value={body}
      rows={3}
      placeholder={recipientName ? `Message ${recipientName}… (⌘↵ to send)` : 'Write a message…'}
      required
      onkeydown={handleKeydown}
      class="flex-1 resize-none"
    />
    <Button type="submit" disabled={!body.trim() || sending || disabled}>
      {sending ? 'Sending…' : (submitLabel ?? 'Send')}
    </Button>
  </form>
</div>
```

**Consumer pattern (CRM messages page):**

```svelte
<div class="flex h-full flex-col">
  <MessageThread messages={data.messages} />
  <MessageComposer action="?/reply" recipientName={data.client.name} />
</div>
```

**Apps to migrate:**

- apps/crm/clients/[id]/messages/+page.svelte
- apps/portal/messages/+page.svelte

---

### 3.6 — ContactForm

**Purpose:** Name + email + message form for web and portfolio contact pages.
Same escape hatch pattern as LoginForm.

**Props:**

```ts
type Props = {
  serverError?: string;
  successMessage?: string; // shown after successful send (default: 'Message sent.')
  onSuccess?: () => void; // escape hatch for modal use
  class?: string;
};
```

**SvelteKit imports:**

```ts
import { enhance, applyAction } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
```

**@breeyard/ui imports:**

```ts
import { Button, Input, Label, Textarea, Alert } from '@breeyard/ui';
```

**State:**

```ts
let loading = $state(false);
let clientError = $state('');
let sent = $state(false);
const errorMessage = $derived(clientError || serverError || '');
```

**Submit handler:**

```ts
const handleSubmit: SubmitFunction = () => {
  loading = true;
  clientError = '';
  return async ({ result, update }) => {
    if (result.type === 'success') {
      sent = true;
      onSuccess ? onSuccess() : null;
    } else if (result.type === 'failure') {
      clientError = (result.data?.error as string) ?? 'Something went wrong.';
    }
    loading = false;
    await update({ reset: !sent });
  };
};
```

**Template structure:**

```svelte
{#if sent}
  <Alert variant="success">{successMessage ?? 'Message sent. We\'ll be in touch.'}</Alert>
{:else}
  <form method="post" use:enhance={handleSubmit} class={...}>
    {#if errorMessage}
      <Alert variant="destructive">{errorMessage}</Alert>
    {/if}
    <div class="space-y-4">
      <div>
        <Label for="name">Name</Label>
        <Input id="name" name="name" type="text" required autocomplete="name" />
      </div>
      <div>
        <Label for="email">Email</Label>
        <Input id="email" name="email" type="email" required autocomplete="email" />
      </div>
      <div>
        <Label for="message">Message</Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send message'}
      </Button>
    </div>
  </form>
{/if}
```

**Server action needed in:** apps/web/contact/+page.server.ts, apps/portfolio/contact/+page.server.ts

---

### 3.7 — ForgotPasswordForm

**Purpose:** Email input form for password reset flow. Shows success message in-place
after submit (no redirect — user stays on page to check email).

**Props:**

```ts
type Props = {
  serverError?: string;
  successMessage?: string; // default: 'Check your email for a reset link.'
  onSuccess?: () => void;
  class?: string;
};
```

**SvelteKit imports:**

```ts
import { enhance } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
```

**@breeyard/ui imports:**

```ts
import { Button, Input, Label, Alert } from '@breeyard/ui';
```

**State:**

```ts
let loading = $state(false);
let sent = $state(false);
let clientError = $state('');
const errorMessage = $derived(clientError || serverError || '');
```

**Submit handler:** Similar to ContactForm — success shows message in-place, no redirect.

**Apps to migrate:** apps/portal/forgot-password/+page.svelte

---

### 3.8 — ResetPasswordForm

**Purpose:** New password + confirm password fields. Token passed as hidden input
(pulled from URL search params in the page load). Redirects to login on success.

**Props:**

```ts
type Props = {
  token: string; // required — from URL ?token= param via +page.server.ts
  serverError?: string;
  onSuccess?: () => void; // default: redirect to /login
  class?: string;
};
```

**SvelteKit imports:**

```ts
import { enhance, applyAction } from '$app/forms';
import type { SubmitFunction } from '@sveltejs/kit';
```

**@breeyard/ui imports:**

```ts
import { Button, Input, Label, Alert } from '@breeyard/ui';
```

**State:**

```ts
let loading = $state(false);
let clientError = $state('');
let password = $state('');
let confirmPassword = $state('');
const mismatch = $derived(!!confirmPassword && password !== confirmPassword);
const errorMessage = $derived(clientError || serverError || '');
```

**Validation:** Password mismatch checked client-side before submit. Server validates token validity.

**Template:** hidden input for token, two password inputs, mismatch error, submit button.

**Apps to migrate:** apps/portal/reset-password/+page.svelte

---

## 4. Build Deliverables

- [ ] `packages/core/components/` directory created
- [ ] `package.json` with correct deps + peerDeps
- [ ] `tsconfig.json` extending tsconfig.base.json
- [ ] All 8 components implemented
- [ ] `src/index.ts` exports all components
- [ ] `pnpm --filter @breeyard/components run build` clean
- [ ] `pnpm --filter @breeyard/components run typecheck` clean
- [ ] `pnpm --filter @breeyard/components run lint` clean
- [ ] Signal coord for review before app migration begins

## 5. App Migration Checklist (Phase 3 — after t582 reviewed)

### Login pages

- [ ] apps/crm — add +page.server.ts, update +page.svelte → LoginForm
- [ ] apps/cms — same
- [ ] apps/portal — same (keeps forgot-password / reset-password routes)

### Layouts

- [ ] apps/crm +layout.svelte → SidebarLayout
- [ ] apps/cms +layout.svelte → SidebarLayout
- [ ] apps/portal +layout.svelte → SidebarLayout (publicPaths variant)
- [ ] apps/web +layout.svelte → HeaderLayout
- [ ] apps/portfolio +layout.svelte → HeaderLayout

### Message pages

- [ ] apps/crm/clients/[id]/messages → MessageThread + MessageComposer
- [ ] apps/portal/messages → MessageThread + MessageComposer

### Contact pages (after ContactForm ships)

- [ ] apps/web/contact → ContactForm + server action
- [ ] apps/portfolio/contact → ContactForm + server action (lower priority)

## 6. Implementation Order Within t582

```
1. Package scaffold (package.json, tsconfig, index.ts stub)
2. LoginForm — highest priority, 3 apps migrate immediately
3. SidebarLayout — high priority, 3 apps migrate immediately
4. MessageThread + MessageComposer — together, 2 apps migrate
5. HeaderLayout — medium, 2 apps migrate
6. ContactForm — medium, 2 apps migrate
7. ForgotPasswordForm + ResetPasswordForm — portal only, lower priority
```

Build + lint + typecheck after each component. Signal coord when all components are done,
before app migration starts.
