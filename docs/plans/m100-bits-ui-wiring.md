# m100 — bits-ui Wiring + Component Extraction Plan

**Milestone:** m100
**Assigned sessions:** platform (implementation), artist-platform (downstream consumer)
**Tasks:** t583 → t582 → t571
**Status:** Decisions locked — ready to implement

---

## Context

`packages/ui` has no bits-ui wiring and no form primitives — one component exists (MessageBubble,
custom Tailwind). This is a complete greenfield. Before `@breeyard/components` can compose shared
components (LoginForm, SidebarLayout, etc.), every element in packages/ui must be backed by bits-ui.

Artist-platform did a partial pass — they added bits-ui as a dependency but did not wire it.
**Platform is doing the full pass.** AP pulls downstream once platform lands t583 + t582.

Additionally, repeated UI patterns exist across all 5 apps that must be extracted into packages
before higher-level composition. Audit complete — see `docs/plans/m100-audit.md`.

---

## Locked Decisions

| Decision            | Resolution                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| bits-ui scope       | **Everything** — every element wraps bits-ui, no exceptions                                       |
| Token naming        | `--color-*` prefix — Tailwind v4 auto-generates utilities (`bg-primary`, `text-foreground`, etc.) |
| Theme ownership     | `@breeyard/theme` exports `theme.css` baseline + TypeScript token types                           |
| Per-app theming     | Supported — each app can import baseline and override in its own @theme block                     |
| Shared theming      | Also supported — apps can share one theme with zero overrides                                     |
| Dark mode           | `.dark` CSS class scope (programmatically controllable, not just prefers-color-scheme)            |
| Variant management  | `tailwind-variants` (TV) — type-safe, Tailwind v4 native, compound variant support                |
| Future theme editor | System must support this — tokens are the editable surface, structure them accordingly            |

### On theming flexibility (important for future UI management)

The token system must support two modes simultaneously:

- **Unified:** All apps share one theme — import baseline, no overrides
- **Per-app:** Each app imports baseline and overrides brand tokens

When theme editing UI is built (future), it needs to be able to edit tokens for one app, all apps,
or define named themes that apps opt into. The CSS var + @theme architecture makes this possible
without changing component code — only the token values change.

---

## Strict Sequence

```
t583a — @breeyard/theme (token definitions, dark mode vars, CSS baseline)
  └─ t583b — packages/ui (bits-ui wiring for ALL elements + tailwind-variants)
       └─ t582 — @breeyard/components (LoginForm, SidebarLayout, other SK-coupled components)
            └─ app updates (login pages, layouts across all 5 apps)
                 └─ t571 — E2E auth (signInAs lands cookies, full suite green)
```

Do NOT start t583b until @breeyard/theme tokens are defined.
Do NOT start t582 until t583b is reviewed and green.

---

## Phase 0 — @breeyard/theme (prerequisite for everything)

**Token set — semantic names, @theme compatible:**

```css
@theme {
  /* Brand */
  --color-primary: oklch(...);
  --color-primary-foreground: oklch(...);

  /* Surfaces */
  --color-background: oklch(...);
  --color-foreground: oklch(...);
  --color-card: oklch(...);
  --color-card-foreground: oklch(...);
  --color-popover: oklch(...);
  --color-popover-foreground: oklch(...);

  /* Semantic */
  --color-secondary: oklch(...);
  --color-secondary-foreground: oklch(...);
  --color-muted: oklch(...);
  --color-muted-foreground: oklch(...);
  --color-accent: oklch(...);
  --color-accent-foreground: oklch(...);
  --color-destructive: oklch(...);
  --color-destructive-foreground: oklch(...);

  /* Structure */
  --color-border: oklch(...);
  --color-input: oklch(...);
  --color-ring: oklch(...); /* focus rings */

  /* Status (used in badges, tables) */
  --color-success: oklch(...);
  --color-success-foreground: oklch(...);
  --color-warning: oklch(...);
  --color-warning-foreground: oklch(...);
  --color-info: oklch(...);
  --color-info-foreground: oklch(...);

  /* Radius scale */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;
}

.dark {
  /* full override set for all tokens above */
}
```

**Deliverables:**

- [ ] `packages/core/theme/src/theme.css` — baseline @theme block
- [ ] `packages/core/theme/src/dark.css` — .dark overrides
- [ ] `packages/core/theme/src/index.ts` — TypeScript token name types (ensures type-safe refs in future theme editor)
- [ ] Each app's `app.css` imports `@breeyard/theme/theme.css`
- [ ] Build clean, typecheck clean

---

## Phase 1 — t583: packages/ui bits-ui wiring

**ALL elements wrap bits-ui. No exceptions. tailwind-variants for all variants.**

### Element list (from audit + bits-ui primitive map)

| Element        | bits-ui Primitive                 | Variants needed                                        |
| -------------- | --------------------------------- | ------------------------------------------------------ |
| Button         | bits-ui/button (or native + aria) | default, outline, ghost, destructive, link, sm/md/lg   |
| Input          | bits-ui/input                     | default, error state, disabled                         |
| Label          | bits-ui/label                     | default, required marker                               |
| Textarea       | bits-ui/textarea                  | default, error state                                   |
| Checkbox       | bits-ui/checkbox                  | default, indeterminate                                 |
| RadioGroup     | bits-ui/radio-group               | default                                                |
| Switch         | bits-ui/switch                    | default                                                |
| Select         | bits-ui/select                    | default, error state (dropdown, not native)            |
| Combobox       | bits-ui/combobox                  | default, multi-select                                  |
| Badge          | bits-ui/badge (or span)           | default, success, warning, destructive, info, outline  |
| StatusBadge    | Badge composite                   | maps status string → variant (client/project statuses) |
| Avatar         | bits-ui/avatar                    | default with fallback                                  |
| Card           | bits-ui/card                      | default, interactive (hover)                           |
| StatCard       | native (Card composite)           | metric value + label + optional link                   |
| Separator      | bits-ui/separator                 | horizontal, vertical                                   |
| Tooltip        | bits-ui/tooltip                   | default                                                |
| Dialog         | bits-ui/dialog                    | default, destructive (confirm)                         |
| Sheet          | bits-ui/sheet                     | left, right side panels                                |
| Popover        | bits-ui/popover                   | default                                                |
| Tabs           | bits-ui/tabs                      | default, pills                                         |
| Accordion      | bits-ui/accordion                 | default                                                |
| Progress       | bits-ui/progress                  | default                                                |
| DatePicker     | bits-ui/date-picker               | single date, range                                     |
| Calendar       | bits-ui/calendar                  | month view, week view, event slots                     |
| Breadcrumb     | bits-ui/breadcrumb                | default with separator                                 |
| Pagination     | native                            | prev/next + page numbers                               |
| FileUpload     | native                            | single file, multiple, drag-drop                       |
| ImageGrid      | native                            | grid of images with aspect ratio                       |
| RichTextEditor | Tiptap                            | heading, bold, italic, lists, links                    |
| Spinner        | native                            | sm/md/lg                                               |
| Alert          | native (role=alert)               | default, success, warning, destructive, info, form     |
| EmptyState     | native                            | default (message + optional CTA)                       |
| MetaCard       | native                            | key-value metadata display                             |
| DataTable      | @tanstack/svelte-table            | headless — col defs, sort, filter, pagination, select  |
| PageHeader     | native                            | title slot + action slot, flex justify-between         |
| SectionHeader  | native                            | small-caps uppercase label                             |
| BackLink       | native                            | ← href + label                                         |
| MessageBubble  | native (update existing)          | sent, received                                         |

### Form field composition (from primitives)

```
FormField = Label + Input/Textarea/Select + FieldError (message)
```

FormField is a convenience wrapper — not an independent component, but a pattern composed from
Label, Input, FieldError that apps use together.

### Deliverables

- [ ] bits-ui added to packages/ui package.json
- [ ] tailwind-variants added to packages/ui package.json
- [ ] All elements implemented with bits-ui primitives + TV variants
- [ ] All elements exported from packages/ui index.ts
- [ ] MessageBubble updated to use new primitives
- [ ] `pnpm --filter @breeyard/ui run build` clean
- [ ] `pnpm -r --if-present run typecheck` clean
- [ ] Signal coord for review

---

## Phase 2 — t582: @breeyard/components

**SvelteKit-coupled layer. Composes packages/ui elements. Svelte + SvelteKit imports allowed.**

### Components (from audit + s015 re-scan)

| Component          | What it is                                             | Notes                                |
| ------------------ | ------------------------------------------------------ | ------------------------------------ |
| LoginForm          | use:enhance + method=post form, onSuccess escape hatch | Replaces 3 duplicate login pages     |
| SidebarLayout      | Sidebar + main layout shell with nav, user display     | CMS + CRM + Portal                   |
| HeaderLayout       | Centered header + nav + footer                         | Web + Portfolio (lower priority)     |
| MessageThread      | Scrollable thread of MessageBubble + empty state       | CRM messages + Portal messages       |
| MessageComposer    | Textarea + send + use:enhance reply form               | Composes with MessageThread          |
| ContactForm        | Email + message form, use:enhance + server action      | Web + Portfolio contact pages        |
| ForgotPasswordForm | Email input + success confirmation                     | Portal (extract when others need it) |
| ResetPasswordForm  | New/confirm password fields                            | Portal (extract when others need it) |

### LoginForm pattern (from AP reference + coord signal #2238)

```svelte
<script lang="ts">
  import { enhance, applyAction } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { Button, Input, Label } from '@breeyard/ui';

  type Props = {
    serverError?: string;
    onSuccess?: () => void;
  };
  const { serverError = '', onSuccess }: Props = $props();

  let loading = $state(false);
  let clientError = $state('');
  const errorMessage = $derived(clientError || serverError || '');

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
</script>

<form method="post" use:enhance={handleSubmit}>
  <!-- Label + Input + error + Button from @breeyard/ui -->
</form>
```

### Server action pattern (all apps, from coord signal #2238)

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

`event.fetch` propagates Set-Cookie automatically. No cookie handling code needed.

---

## Phase 3 — App updates

### Login pages (all apps with login)

- [ ] apps/crm — add +page.server.ts server action, update +page.svelte to use LoginForm
- [ ] apps/cms — same
- [ ] apps/portal — same + keep forgot-password / reset-password routes
- [ ] apps/web — check if login exists
- [ ] apps/portfolio — check if login exists

### Layouts (sidebar apps)

- [ ] apps/crm +layout.svelte → use SidebarLayout from @breeyard/components
- [ ] apps/cms +layout.svelte → use SidebarLayout
- [ ] apps/portal +layout.svelte → use SidebarLayout

### Inline patterns (StatusBadge, EmptyState, MetaCard, DataTable)

- [ ] Update CRM client list → use StatusBadge + DataTable + EmptyState
- [ ] Update CRM client detail → use StatusBadge + MetaCard
- [ ] Update Portal project list → use StatusBadge + EmptyState
- [ ] Update Portal project detail → use StatusBadge + MetaCard
- [ ] Update CRM client new/edit forms → use FormField (Label + Input + error)

---

## Phase 4 — t571: E2E auth

- [ ] Re-run E2E locally: `pnpm test:e2e:local`
- [ ] `.auth/admin-1.json` must be > 36 bytes (cookies present)
- [ ] Navigate to /clients after setup — must NOT redirect to /login
- [ ] Full suite green locally
- [ ] Push → CI E2E green
- [ ] Signal coord/devops — PR #45 ready to merge

---

## TanStack Ecosystem (locked — coord ruling 2026-06-01)

@breeyard/\* packages are thin wrappers over TanStack standards. Generated client code is
any-dev-maintainable — no proprietary implementations.

| Package                    | Role                                                           | Wired in               |
| -------------------------- | -------------------------------------------------------------- | ---------------------- |
| @tanstack/svelte-form      | Form state, field validation, array fields, multi-step         | @breeyard/components   |
| @tanstack/zod-form-adapter | Zod schema → TanStack field validators                         | @breeyard/components   |
| @tanstack/svelte-query v5  | Data fetching, caching, mutations, optimistic updates          | @breeyard/hooks        |
| @tanstack/svelte-table     | Headless table: col defs, sort, filter, pagination, row select | @breeyard/ui DataTable |
| @tanstack/svelte-virtual   | Virtualized lists for large datasets (galleries, CRM feeds)    | @breeyard/ui           |

**@breeyard/hooks wrapper pattern:**
TanStack Query returns `{ data, error }` → convert to `Result<T,E>` from @breeyard/shared.
Wire @breeyard/reporter into QueryClient global error handler.

**Watch (not ready):**

- @tanstack/svelte-hotkeys (alpha) — keyboard shortcuts for admin/CRM power users
- @tanstack/svelte-db (beta) — live queries, PWA offline
- @tanstack/svelte-ai (alpha) — unified AI SDK

---

## Architecture rules (permanent)

- `packages/ui` — zero SvelteKit coupling. Svelte OK, no +page, no server, no enhance, no goto.
- `@breeyard/components` — SvelteKit-coupled, composes packages/ui. No raw HTML form logic.
- `@breeyard/theme` — CSS and TypeScript only. No Svelte.
- AP pulls packages/ui and @breeyard/components downstream after platform review.

---

## Progress Log

| Date       | Phase        | Status   | Notes                                                       |
| ---------- | ------------ | -------- | ----------------------------------------------------------- |
| 2026-05-31 | Audit        | Complete | m100-audit.md written (partial — 3 of 5 apps scanned)       |
| 2026-05-31 | Decisions    | Locked   | bits-ui everything, TV variants, per-app tokens             |
| 2026-06-01 | t583a        | Done     | @breeyard/theme token baseline                              |
| 2026-06-01 | t583b        | Done     | 44 packages/ui components, lint + typecheck green           |
| 2026-06-01 | Full re-scan | Complete | All 5 apps, all files — 6 new patterns + forward components |
| 2026-06-01 | t582         | Starting | @breeyard/components — coord ACKed                          |
