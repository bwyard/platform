# m100 Audit — packages/ui + App Pattern Scan

**Date:** 2026-05-31 | **Status:** Complete — decisions needed before coding

---

## Critical Finding: bits-ui is NOT in packages/ui

`@breeyard/ui` does not declare bits-ui as a dependency at all. It has exactly **one component**:
`MessageBubble.svelte` — custom Tailwind, no primitives, no library.

Artist-platform has the same situation: bits-ui@2.18.1 is declared in their packages/ui package.json
but **zero components actually use it**. AP built semantic HTML wrappers with CSS tokens instead.

→ This affects t583 scope. See Decision 1 below.

---

## 1. packages/ui Inventory

| Component     | Exists? | bits-ui backed? | Notes                                    |
| ------------- | ------- | --------------- | ---------------------------------------- |
| Button        | No      | —               | Missing entirely                         |
| Input         | No      | —               | Missing entirely                         |
| Label         | No      | —               | Missing entirely                         |
| Textarea      | No      | —               | Missing entirely                         |
| Select        | No      | —               | Missing entirely                         |
| Badge         | No      | —               | Missing entirely                         |
| Card          | No      | —               | Missing entirely                         |
| Alert / Toast | No      | —               | Missing entirely                         |
| Spinner       | No      | —               | Missing entirely                         |
| Dialog        | No      | —               | Missing entirely                         |
| Sidebar / Nav | No      | —               | Missing entirely                         |
| DataTable     | No      | —               | Missing entirely                         |
| EmptyState    | No      | —               | Missing entirely                         |
| StatusBadge   | No      | —               | Missing entirely                         |
| MessageBubble | **Yes** | No              | Only existing component, custom Tailwind |

**Zero form primitives exist. This is a complete greenfield.**

### Existing packages that inform the UI layer

| Package              | Relevant to UI | What it provides                                                              |
| -------------------- | -------------- | ----------------------------------------------------------------------------- |
| @breeyard/validation | Yes            | emailSchema, passwordSchema (Zod v4) — use in server actions                  |
| @breeyard/shared     | Yes            | Typed DTOs: CreateClientInput, UpdateClientInput, ProjectStatus, ClientStatus |
| @breeyard/auth       | Yes            | better-auth client (signIn, signOut, useSession)                              |
| @breeyard/theme      | Stub           | Empty — no tokens defined yet                                                 |

---

## 2. App Component Scan — Repeated Patterns

### Pattern 1 — Login Form (CRITICAL, 3 apps)

Files:

- `apps/cms/src/routes/login/+page.svelte`
- `apps/crm/src/routes/login/+page.svelte`
- `apps/portal/src/routes/login/+page.svelte`

All three are currently client-side (`signIn.email()` from better-auth/svelte). CRM and Portal are
~95% identical. CMS is the simpler variant (no show/hide password toggle). All three need to be
replaced with server actions + @breeyard/components LoginForm.

→ Extract: `@breeyard/components` LoginForm.svelte (SvelteKit-coupled)

---

### Pattern 2 — Sidebar Layout (HIGH, 3 apps)

Files:

- `apps/cms/src/routes/+layout.svelte`
- `apps/crm/src/routes/+layout.svelte`
- `apps/portal/src/routes/+layout.svelte`

Structure is essentially identical:

```svelte
<aside class="flex w-56 flex-col border-r bg-gray-50 px-4 py-6">
  <span class="mb-8 text-sm font-bold">{appName}</span>
  <nav class="flex flex-col gap-1 text-sm">
    {#each navItems as item}
      <a href={item.href}>{item.label}</a>
    {/each}
  </nav>
  <div class="mt-auto text-xs text-gray-500">{data.user.email}</div>
</aside>
```

CMS and CRM are identical. Portal has minor styling differences (white bg, active link state).
Note: contains SvelteKit `<a href>` links — goes in @breeyard/components, not packages/ui.

→ Extract: `@breeyard/components` AppLayout.svelte or SidebarLayout.svelte

---

### Pattern 3 — Status Badge (HIGH, 2 apps, 5+ instances)

Files:

- `apps/crm/src/routes/clients/+page.svelte`
- `apps/crm/src/routes/clients/[id]/+page.svelte`
- `apps/crm/src/routes/clients/[id]/edit/+page.svelte`
- `apps/portal/src/routes/projects/+page.svelte`
- `apps/portal/src/routes/projects/[id]/+page.svelte`

Each file defines its own `statusColors: Record<string, string>`. Two color maps in use:

- CRM client status: prospect (yellow), active (green), inactive (gray), churned (red)
- Portal project status: discovery (blue), active (green), paused (yellow), completed (gray), cancelled (red)

→ Extract: `packages/ui` StatusBadge.svelte — props: `status: string`, configurable color map

---

### Pattern 4 — Form Field (HIGH, 2 pages)

Files:

- `apps/crm/src/routes/clients/new/+page.svelte`
- `apps/crm/src/routes/clients/[id]/edit/+page.svelte`

Identical HTML structure repeated for every field:

```svelte
<div class="flex flex-col gap-1">
  <label for="field" class="text-sm font-medium">Field Name</label>
  <input
    class="rounded border px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
  />
</div>
```

→ Extract: `packages/ui` Input.svelte + Label.svelte (primitives), compose in FormField pattern

---

### Pattern 5 — Detail Meta Sidebar (MEDIUM, 2 pages)

Files:

- `apps/crm/src/routes/clients/[id]/+page.svelte`
- `apps/portal/src/routes/projects/[id]/+page.svelte`

Repeated key-value metadata display:

```svelte
<div class="space-y-4 rounded-lg border p-4 text-sm">
  <div>
    <p class="text-xs font-medium tracking-wide text-gray-400 uppercase">Label</p>
    <p class="mt-0.5 text-gray-800">Value</p>
  </div>
</div>
```

→ Extract: `packages/ui` MetaCard.svelte — slot-based

---

### Pattern 6 — Empty State (MEDIUM, 2 pages)

Files:

- `apps/crm/src/routes/clients/+page.svelte`
- `apps/portal/src/routes/projects/+page.svelte`

```svelte
<div class="rounded-lg border border-dashed p-12 text-center">
  <p class="text-sm text-gray-500">No items yet.</p>
  <a href="/add" class="mt-2 inline-block text-sm font-medium underline">Add your first item</a>
</div>
```

→ Extract: `packages/ui` EmptyState.svelte — props: message, cta label+href

---

### Pattern 7 — Data Table (MEDIUM, 1 page but high reuse potential)

File:

- `apps/crm/src/routes/clients/+page.svelte`

Standard bordered table with hover states, status badges in cells. Will appear in more places as
CRM grows (projects table, messages table, etc.).

→ Extract: `packages/ui` DataTable.svelte — slot-based columns

---

### Pattern 8 — Header Nav (LOW, 2 marketing apps)

Files:

- `apps/web/src/routes/+layout.svelte`
- `apps/portfolio/src/routes/+layout.svelte`

Similar centered header with logo left, nav right, border-bottom. Low urgency — marketing sites
are relatively static.

→ Defer for now

---

### Pattern 9 — Password Reset Flow (LOW, portal only)

Files:

- `apps/portal/src/routes/forgot-password/+page.svelte`
- `apps/portal/src/routes/reset-password/+page.svelte`

Only in portal currently. Extract when other apps need auth.

→ Defer until other apps need it

---

## 3. Artist-Platform Reference Implementation

AP's actual implementation pattern (post-bits-ui-decision):

### Semantic Component Layer

AP built semantic HTML wrappers, not bits-ui wrappers. Components:

- Button.svelte — raw `<button>` + variant map + Tailwind + CSS token refs
- Input.svelte — bindable value, error state, aria-describedby
- Textarea.svelte, Select.svelte — same pattern
- Card.svelte, Alert.svelte, Badge.svelte, Spinner.svelte

All reference CSS tokens via `var(--color-primary)` etc., never raw Tailwind colors.

### Token System

Defined in each app's `app.css` via Tailwind v4 `@theme` block:

```css
@theme {
  --color-primary: oklch(0.45 0.2 240);
  --color-background: oklch(0.98 0.005 240);
  --color-surface: oklch(0.95 0.005 240);
  --color-text-primary: oklch(0.2 0.01 240);
  --color-border: oklch(0.87 0.008 240);
  --color-error: oklch(0.6 0.25 25);
  /* etc. */
}
```

### LoginForm.svelte (exact pattern)

```svelte
<script lang="ts">
  import { enhance, applyAction } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';

  type Props = {
    serverError?: string;
    onSuccess?: () => void;
    compact?: boolean;
  };

  const { serverError = '', onSuccess, compact = false }: Props = $props();

  let loading = $state(false);
  let clientError = $state('');
  const errorMessage = $derived(clientError || serverError || '');

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    clientError = '';
    return async ({ result, update }) => {
      if (result.type === 'redirect' || result.type === 'success') {
        if (onSuccess) {
          onSuccess(); // escape hatch for modal/inline
        } else {
          await applyAction(result); // default: follow redirect
        }
      } else if (result.type === 'failure') {
        clientError = (result.data?.error as string | undefined) ?? 'Invalid email or password.';
        loading = false;
        await update({ reset: false });
      } else {
        clientError = 'Something went wrong. Please try again.';
        loading = false;
        await update({ reset: false });
      }
    };
  };
</script>

<form method="post" use:enhance={handleSubmit}>
  <!-- uses packages/ui Input, Button, Label primitives -->
</form>
```

### Server Action Pattern (confirmed)

```typescript
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

`event.fetch` auto-propagates Set-Cookie. No manual cookie handling.

---

## 4. Decisions Needed Before Coding

### Decision 1 — bits-ui usage scope

AP declared bits-ui@2.18.1 but uses zero primitives. They built semantic HTML wrappers instead.

Options:
A. **Match AP** — semantic HTML + CSS tokens for simple elements; use bits-ui only for complex
accessibility-heavy primitives (Dialog, Popover, Select with search, Combobox, Tooltip)
B. **Full bits-ui** — wrap every element in bits-ui primitives regardless of complexity

Recommendation: Option A. bits-ui shines for accessibility-heavy composites. For Button/Input/Label
the overhead is not worth it. Aligns with AP's pattern, means fewer cross-repo divergences.

### Decision 2 — Token system location

AP defines tokens per-app in `app.css @theme`. Platform has `@breeyard/theme` stub.

Options:
A. **Match AP** — define tokens in each app's `app.css`, @breeyard/theme exports types/helpers only
B. **Centralize** — @breeyard/theme exports a CSS file or token map that apps import

Recommendation: Option A for now. @breeyard/theme can export TypeScript types for token names
(ensures consistency) without owning the CSS. Easier to theme per-app later.

### Decision 3 — SidebarLayout placement

SidebarLayout contains SvelteKit `<a>` links and reads session data — it's SvelteKit-coupled.

→ Goes in @breeyard/components, not packages/ui. Confirmed by architecture rules.

---

## 5. Missed Patterns (s015 re-scan — full app coverage)

The original audit only scanned the files listed in each pattern. s015 read every .svelte file
across all 5 apps and found the following additional patterns:

### Pattern 10 — StatCard (HIGH, 2 apps)

Files:
- `apps/crm/src/routes/+page.svelte` — 4 stat cards (total, active, prospects, unread)
- `apps/portal/src/routes/dashboard/+page.svelte` — project cards with status badge

Stat grid: value + label + optional link wrapper. Repeats as CRM grows (invoices count, projects count, etc.).

→ Extract: `packages/ui` StatCard.svelte — props: label, value, href?

### Pattern 11 — MessageThread + MessageComposer (HIGH, 2 apps)

Files:
- `apps/crm/src/routes/clients/[id]/messages/+page.svelte`
- `apps/portal/src/routes/messages/+page.svelte`

Nearly identical: scrollable thread of MessageBubble + textarea compose box + send button + use:enhance.
SvelteKit-coupled (use:enhance, $app/forms).

→ Extract: `@breeyard/components` MessageThread.svelte + MessageComposer.svelte

### Pattern 12 — statusColors defined a 3rd time (BLOCKER)

`apps/crm/src/routes/+page.svelte` (dashboard) redefines the same statusColors map as:
- `apps/crm/src/routes/clients/+page.svelte`
- `apps/crm/src/routes/clients/[id]/+page.svelte`
- `apps/crm/src/routes/projects/[id]/+page.svelte`
- `apps/portal/src/routes/dashboard/+page.svelte`

5 files defining the same inline map. StatusBadge in packages/ui is the fix — all 5 migrate to it.

### Pattern 13 — FormAlert (MEDIUM, 3+ files)

Files:
- `apps/crm/src/routes/projects/[id]/+page.svelte`
- `apps/crm/src/routes/clients/[id]/edit/+page.svelte`
- `apps/crm/src/routes/clients/new/+page.svelte`

Pattern: `{#if form?.error}<p class="rounded bg-red-50 ...">{form.error}</p>{/if}` and green variant for success.
Can be the Alert component from packages/ui with a `form` variant.

### Pattern 14 — SectionHeader (LOW, multiple files)

Files: CRM dashboard, portal dashboard, clients list
Pattern: `<h2 class="text-sm font-semibold tracking-wide text-gray-400 uppercase">Label</h2>`

→ Extract: `packages/ui` SectionHeader.svelte — or just a documented class pattern (low priority)

### Pattern 15 — PageHeader (LOW, multiple files)

Files: CRM clients list (h1 + Add client button), will repeat on every list page
Pattern: `<div class="mb-6 flex items-center justify-between"><h1>...</h1><a>Action</a></div>`

→ Extract: `packages/ui` PageHeader.svelte — slots: title, action

### Pattern 16 — BackLink (LOW, 2 files)

Files: CRM messages page, CRM project detail
Pattern: `<a href="...">← Parent Name</a>`

→ Extract: `packages/ui` BackLink.svelte — props: href, label

---

## 6. Forward-Looking Components (all confirmed — build now)

These don't exist in code yet but are confirmed needed based on known roadmap:

### packages/ui

| Component       | Why needed                                                        | bits-ui?             |
| --------------- | ----------------------------------------------------------------- | -------------------- |
| Pagination      | CRM client list will hit hundreds of rows                         | No — semantic        |
| DatePicker      | CRM project start/complete dates, Calypso scheduling              | **Yes — bits-ui**    |
| Calendar        | Calypso scheduling view, full month/week grid                     | **Yes — bits-ui**    |
| FileUpload      | CMS media page (currently stub)                                   | No — semantic        |
| ImageGrid       | CMS gallery page (currently stub)                                 | No — semantic        |
| RichTextEditor  | CMS blocks/pages (Tiptap integration)                             | No — Tiptap directly |
| Breadcrumb      | CMS nested nav, CRM client→project→messages depth                 | **Yes — bits-ui**    |
| Tabs            | CRM client detail (Overview/Projects/Messages/Invoices)           | **Yes — bits-ui**    |

### @breeyard/components

| Component    | Why needed                                          |
| ------------ | --------------------------------------------------- |
| ContactForm  | apps/web + apps/portfolio — use:enhance + action    |

---

## 7. Full Component Extraction List (updated — ordered by priority)

### packages/ui (zero SvelteKit coupling, Svelte OK)

| Component       | Reason                                         | bits-ui?             |
| --------------- | ---------------------------------------------- | -------------------- |
| Button          | Used everywhere                                | Yes — bits-ui        |
| Input           | Form fields in 3+ apps                         | Yes — bits-ui        |
| Label           | Paired with Input                              | Yes — bits-ui        |
| Textarea        | Client/project forms                           | Yes — bits-ui        |
| Select          | Status selects, dropdowns                      | Yes — bits-ui        |
| Checkbox        | Form toggles                                   | Yes — bits-ui        |
| RadioGroup      | Option selection                               | Yes — bits-ui        |
| Switch          | Toggle settings                                | Yes — bits-ui        |
| Combobox        | Searchable selects                             | Yes — bits-ui        |
| Badge           | Status display                                 | No — semantic        |
| StatusBadge     | Repeated status color maps (5 inline instances)| No — semantic        |
| Avatar          | User display                                   | Yes — bits-ui        |
| Card            | Project cards, stat cards, detail cards        | Yes — bits-ui        |
| StatCard        | Dashboard metric cards                         | No — semantic        |
| Separator       | Visual dividers                                | Yes — bits-ui        |
| Tooltip         | Hover context                                  | Yes — bits-ui        |
| Dialog          | Modals                                         | Yes — bits-ui        |
| Sheet           | Side panels                                    | Yes — bits-ui        |
| Popover         | Dropdowns, context menus                       | Yes — bits-ui        |
| Tabs            | CRM client detail sections                     | Yes — bits-ui        |
| Accordion       | Collapsible content                            | Yes — bits-ui        |
| Progress        | Loading bars                                   | Yes — bits-ui        |
| DatePicker      | CRM project dates, Calypso                     | Yes — bits-ui        |
| Calendar        | Calypso scheduling view                        | Yes — bits-ui        |
| Breadcrumb      | CMS + CRM deep navigation                      | Yes — bits-ui        |
| Pagination      | List views with many rows                      | No — semantic        |
| FileUpload      | CMS media                                      | No — semantic        |
| ImageGrid       | CMS gallery                                    | No — semantic        |
| RichTextEditor  | CMS blocks/pages                               | No — Tiptap          |
| Spinner         | Loading states                                 | No — semantic        |
| Alert           | Error/success messages + FormAlert pattern     | No — semantic        |
| EmptyState      | CRM + Portal lists                             | No — semantic        |
| MetaCard        | Detail meta sidebar                            | No — semantic        |
| DataTable       | CRM clients table                              | No — semantic        |
| PageHeader      | List page headers with action button           | No — semantic        |
| SectionHeader   | Small-caps section labels                      | No — semantic        |
| BackLink        | ← Parent navigation                            | No — semantic        |
| MessageBubble   | Chat messages (update existing)                | No — semantic        |

### @breeyard/components (SvelteKit-coupled, composes packages/ui)

| Component          | Reason                                                               |
| ------------------ | -------------------------------------------------------------------- |
| LoginForm          | CMS + CRM + Portal login — server action + use:enhance + onSuccess   |
| SidebarLayout      | CMS + CRM + Portal shared layout shell                               |
| HeaderLayout       | Web + Portfolio header + nav + footer                                |
| MessageThread      | Scrollable message thread — uses MessageBubble + use:enhance         |
| MessageComposer    | Textarea + send button — use:enhance, composes MessageThread         |
| ContactForm        | apps/web + apps/portfolio — use:enhance + server action              |
| ForgotPasswordForm | Portal (extract when other apps need it)                             |
| ResetPasswordForm  | Portal (extract when other apps need it)                             |

---

## 8. Updated Sequence (post-s015 re-scan)

```
1. Decisions confirmed (bits-ui scope, token approach)       ✅ DONE
2. @breeyard/theme — token baseline, dark mode vars          ✅ DONE (t583a)
3. packages/ui — all primitives + composites, bits-ui wired  ✅ DONE (t583b, 44 components)
4. @breeyard/components — SvelteKit-coupled layer            🔵 NEXT (t582)
5. App updates — login, layouts, inline patterns              ⬜
6. t571 — E2E auth                                           ⬜
```

Note: packages/ui built 44 components in t583b. Forward-looking components (DatePicker, Calendar,
Pagination, FileUpload, ImageGrid, RichTextEditor, Breadcrumb, StatCard, PageHeader, SectionHeader,
BackLink) are scoped and confirmed — build as each app needs them, not all upfront.

---

## Progress Log

| Date       | Item                                    | Status    |
| ---------- | --------------------------------------- | --------- |
| 2026-05-31 | packages/ui audit                       | Complete  |
| 2026-05-31 | App pattern scan (partial — 3 of 5)    | Complete  |
| 2026-05-31 | AP reference implementation             | Complete  |
| 2026-05-31 | Decisions documented + locked           | Complete  |
| 2026-06-01 | Full app re-scan (all 5 apps, all files)| Complete  |
| 2026-06-01 | Forward-looking components confirmed    | Complete  |
