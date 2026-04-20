---
id: NNNN
title: "{{TITLE}}"
status: draft          # draft | proposed | accepted | in-progress | shipped | deprecated | superseded | rejected
owner: "@{{OWNER}}"
created: {{DATE}}
updated: {{DATE}}
shipped_at:
appetite: 2w           # Shape-Up time budget; delete if not using
target_release:
tags: []               # e.g. [auth, billing, api, ui]
issues: []             # e.g. [GH-123, LIN-456]
prs: []
related: []            # supersedes / depends-on / related spec IDs
---

# {{TITLE}}

## TL;DR
One short paragraph (≤3 sentences). Write this last; it forces you to distill.

## Problem
Who hurts, how, and what evidence do we have? Resist jumping to solutions.

## Goals
- …

## Non-goals
Things that could reasonably be goals but are explicitly out of scope for this feature. **Mandatory section — this is the single most valuable scope guardrail.**
- …

## User stories / UX
- As a **[user]**, I want **[X]** so that **[Y]**.
- Link to Figma / Loom / screenshot rather than embedding. URL:

## Solution overview
Guide-level: how a user experiences this feature end-to-end. Fat-marker sketches are fine. Keep implementation detail out of this section.

## Tech details
*Every subsection below is optional. Delete any that are N/A for this feature.*

### Routes & files
- New/modified paths under `app/` (include dynamic segments `[id]`, catch-all `[...slug]`, route groups `(marketing)`):
- Parallel slots (`@slot`) and required `default.tsx`:
- Intercepting routes (`(.)`, `(..)`, `(...)`) — e.g. modal-over-page:
- Files per segment: `layout.tsx` / `template.tsx` / `loading.tsx` / `error.tsx` / `not-found.tsx` / `default.tsx`:
- Route handlers (`app/api/.../route.ts`) — path + verbs, and *why* a handler rather than a Server Action (webhook, OAuth callback, public GET, RSS/sitemap, file upload from non-browser client):
- Route segment config: `dynamic`, `revalidate`, `runtime: 'nodejs' | 'edge'`, `fetchCache`, `experimental_ppr` / `cacheComponents`:

### Rendering strategy
- Per segment: static / ISR / dynamic / PPR with streamed Suspense holes — one line each, with reason:
- `<Suspense>` boundaries — where, what fallback, which uncached read makes the hole dynamic (`cookies()`, `headers()`, `searchParams`, `fetch({ cache: 'no-store' })`):
- `'use cache'` scopes (Next 16+) and their `cacheLife` profile:

### Components
- New server components — path, responsibility, what data it fetches directly:
- New client components (`'use client'`) — path, and the *specific* reason (hooks, events, browser API, context, third-party client lib):
- Props crossing the server→client boundary — confirm serializable; no server-only secrets leak:
- Shared primitives (e.g. `components/ui/*` shadcn) reused or added:
- Form choice — `<form action={serverAction}>`, `next/form`, or client-controlled with `useActionState`/`useFormStatus`:

### Data fetching
- Read sources — DB (Prisma/Drizzle table), internal service, third-party API:
- Pattern — direct DB in RSC, `fetch()` with tags, or shared loader in `lib/data/*`:
- Request deduping — `React.cache(...)` wrappers:
- Cache opt-in — `fetch(url, { cache: 'force-cache', next: { revalidate, tags } })` / `unstable_cache` / `'use cache'` + `cacheTag` + `cacheLife`:
- Parallelization — `Promise.all` vs sequential; any preload pattern:

### Mutations
- Decision: Server Action for UI-triggered writes; Route Handler for webhooks, OAuth callbacks, external/machine callers, public APIs.
- Server Actions — file (`app/.../actions.ts` with `'use server'`), signature, zod schema, authz check, return shape:
- Revalidation after mutation — exact `revalidatePath('/x')` and/or `revalidateTag('y')` / `updateTag('y')`:
- Route Handlers — path, verbs, validation, auth (bearer / webhook signature), cache headers, runtime:
- Background work — `after(() => …)` for logging/analytics that must not block the response:
- Idempotency — dedupe key, DB constraint, optimistic concurrency:

### Caching & invalidation
- Tag taxonomy owned by this feature (e.g. `user:{id}`, `project:{id}:members`) and which mutations invalidate which tags:
- Router cache — explicit `router.refresh()` calls; `<Link prefetch={false}>` where appropriate:

### Auth, authz, middleware/proxy
- Who can access this feature (role / plan / tenant):
- Checks run at (mark all that apply; **DAL is mandatory for non-public**):
  - `middleware.ts` / `proxy.ts` (16+) — edge redirect; matcher:
  - **Data Access Layer** — `verifySession()` inside every DB-touching function:
  - Server Component / Server Action / Route Handler entry:
- Unauthorized UX — redirect target or `unauthorized()`/`forbidden()` + matching page:
- Rate limiting — store (Upstash/Redis) and layer:
- New cookie/session touch points and flags:

### Metadata & SEO
- `metadata` / `generateMetadata` — async (`params` is a Promise in 15+):
- `metadataBase`, canonical, noindex for drafts/previews:
- OG/Twitter image — static file or dynamic `opengraph-image.tsx` via `ImageResponse`:
- `sitemap.ts` / `robots.ts` entries to add:
- JSON-LD structured data:

### Styling (Tailwind)
- New tokens / theme extensions (v4 `@theme` in CSS, or v3 config):
- shadcn/ui components to add (`npx shadcn add <name>`):
- Responsive breakpoints exercised:
- Dark mode / motion / a11y notes:

### Testing
- Vitest unit — validators, formatters, client components, sync server components:
- Server Action logic — extract to plain async fn and unit-test; keep `'use server'` wrapper thin:
- Route Handler — call `GET`/`POST` with `new Request(...)` and assert on `Response`:
- Playwright E2E — critical journey; async RSCs covered here since Vitest can't render them:
- Zod round-trip schema tests:
- `@axe-core/playwright` a11y pass on new pages:

### Environment & config
- New env vars — name, server-only vs `NEXT_PUBLIC_`, secret store location:
- Feature flag — name, provider, default, rollout plan:
- Third-party SDKs added — package, server/client, bundle impact, `serverExternalPackages`:
- `next.config.ts` changes — `images.remotePatterns`, `experimental.*`, rewrites/redirects/headers, CSP:
- Observability — `instrumentation.ts` / `onRequestError` wiring:

### Database / ORM
- Schema diff — new tables/columns/indexes/enums:
- Migration plan — forward/backward compat, backfill, deploy order, flag gate:
- Row-level access — where tenant/user scoping is enforced (DAL, RLS, Prisma extension):
- Transactions required across which writes:
- Seed / fixtures:

## Risks & rabbit holes
Known hazards with a mitigation plan. Call out any tracer-bullet prototype that should happen first.

## Alternatives considered
Short. What other designs did you consider, and why did this win? Preserves institutional memory.

## Open questions
- [ ] Question — **owner**: @who — **needed by**: YYYY-MM-DD

## Rollout & success metrics
- Feature flag? Gradual rollout plan:
- The metric that tells us this worked:
- Dashboards / alerts / log tags to add:

## Changelog
Append-only once `status: accepted`. Don't rewrite history above; add entries here.
- {{DATE}} — created in `draft`.
