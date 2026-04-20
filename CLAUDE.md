# Worboo

Web app for language teachers to generate interactive student workbooks in under 90 seconds. A teacher describes what they need in plain text (e.g. _"English past simple, A2 level"_), AI fills in the parameters, and the system outputs a self-contained HTML file students can complete offline in any browser.

## Stack

- **Framework:** TanStack Start (Vite, React 19, SSR)
- **Routing:** TanStack Router — file-based, routes live under `src/app/routes/`, tree auto-generated at `src/app/routes/routeTree.gen.ts` (do not edit)
- **Data / forms:** TanStack Query, TanStack Form
- **UI:** Catalyst (Tailwind Labs' React UI kit, primary) + Tailwind CSS v4. Catalyst is built on Headless UI and ships as source files under `src/presentation/components/catalyst/`. Shadcn/Radix components are allowed *as a secondary kit* for patterns Catalyst doesn't cover cleanly (e.g. submenus) and live under `src/presentation/components/shadcn/`. Prefer Catalyst first; reach for shadcn only when needed.
- **Animation:** Tailwind CSS utilities only — `transition-*`, `animate-*`, `hover:*`, `focus:*`, `active:*`, `data-[state=*]:*`. No JS animation library (no `motion`, no `framer-motion`). Static content does not animate.
- **Icons:** `lucide-react`.
- **Tooling:** Biome (format + lint), Vitest, pnpm
- **Analytics:** PostHog
- **Backend:** Supabase — Postgres, Auth, Storage, Realtime. Client lives in `src/infrastructure/supabase/`; uses `@supabase/ssr` (`createBrowserClient`) so cookie-based auth works correctly under TanStack Start SSR. Add a `createServerClient` factory the first time server-side auth is needed.
- **Env / validation:** `@t3-oss/env-core` + Zod. Required client vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (see `.env.example`).

## Commands

- `pnpm dev` — start dev server on port 3000
- `pnpm build` — production build
- `pnpm preview` — preview production build
- `pnpm test` — run Vitest
- `pnpm check` — Biome format + lint (run before committing)

## Conventions

- **Package manager:** pnpm only. Never use `npm` or `yarn`.
- **Imports:** use the `#/*` alias for `src/*` — e.g. `import { Button } from "#/presentation/components/catalyst/button"`.
- **Styling:** Tailwind v4 utilities + Catalyst components only. No custom CSS classes or CSS variables outside the theme tokens in `src/styles.css`.
- **Catalyst is vendored and read-only.** Files under `src/presentation/components/catalyst/` are treated as third-party source. **Do not edit them — ever.** Not for styling tweaks, not for behaviour changes, not for bug fixes. The only sanctioned exception is `catalyst/link.tsx`, which Catalyst itself ships with a TODO instructing you to wire it to the app's router.
- **Shadcn is also vendored and read-only.** Files under `src/presentation/components/shadcn/` are treated the same as Catalyst — **do not edit them.** To adjust styling on a shadcn component, pass `className` at the call site; `cn()` + `tailwind-merge` ensures consumer classes win over shadcn defaults. To add a new shadcn primitive, copy the official source in unmodified.
- **Extending Catalyst/shadcn:** compose wrappers in `src/presentation/components/` that import from the vendored folders. If a primitive is missing, copy its official source in unmodified — never hand-roll the internals, and never "simplify" what you paste in.
- **Animation scope:** only add `transition-*` or `animate-*` classes to **interactive elements** (buttons, links, form controls, modals, toasts, dropdowns) or elements that **explicitly change state** (loading skeletons, status indicators). Never add animation classes to static containers, text nodes, or layout wrappers. There is no escape hatch for static-content reveals — if it's static, it doesn't animate.
- **Patterns:**
  - Hover/focus/active — `transition-colors hover:… focus-visible:… active:…` on the interactive element.
  - Conditional UI (Headless UI panels, Catalyst Dialog/Dropdown) — animate via Headless UI's `data-[state=open]`/`data-[closed]` attributes with Tailwind utilities. If you need richer keyframes (`animate-in`/`fade-in`/`slide-in-from-*`), add `tw-animate-css`; otherwise use plain `transition-*` + `opacity`/`translate`/`scale` utilities.
  - Loading/status — Tailwind's built-in `animate-pulse`, `animate-spin`, `animate-bounce`, etc.
- **Reduced motion:** use Tailwind's `motion-reduce:` variant to disable transforms/animations when the user prefers reduced motion (`motion-reduce:transition-none motion-reduce:animate-none`).
- **Routes:** drop files under `src/routes/`. The route tree regenerates on dev/build.
- **Components:** PascalCase files in `src/presentation/components/`. Catalyst primitives live in `src/presentation/components/catalyst/`.
- **Icons:** `lucide-react`.

## Architecture

Four layers, separated by responsibility. Dependency flow is linear: `presentation → domain → infrastructure`. Presentation only imports from `domain`; domain uses clients from `infrastructure`; infrastructure only initialises external SDKs.

- **`src/app/` — app shell.** Holds `routes/` (file-based TanStack Router tree, with `routesDirectory` configured in `vite.config.ts`) and `providers/` (root-level React providers mounted once in `__root.tsx`, e.g. PostHog, TanStack Query). Route files must stay trivial: `createFileRoute(...)({ component: <ScreenView> })` importing the view from `#/presentation/<screen>/view`. No UI, no state, no data fetching inside route files. Providers handle third-party SDK *wiring* (context, lifecycle), not data access — data access belongs in `domain/`.
- **`src/presentation/` — presentation layer.** Screens (`presentation/<screen>/` with `view` + `hooks` + screen-local `components`) plus shared UI (`presentation/components/`). The `use<Screen>()` hook is the screen's viewmodel — it imports repository functions from `#/domain/<name>`, never from `infrastructure/` directly, and is never called from inside `view.tsx` of another screen.
- **`src/domain/` — business logic.** Organised per bounded context: `domain/<name>/` with `models/`, `repositories/`, and an `index.ts` public surface. Repository files are **implementations** (not interfaces) — plain async functions that call clients from `infrastructure/` and return domain models. Mapping from wire formats (snake_case, nullable columns) to the domain model happens inside the repository. See `src/domain/README.md`.
- **`src/infrastructure/` — external-client initialisation only.** One file per vendor (`supabase/index.ts`, future `anthropic/client.ts`) that constructs and exports the SDK singleton, reading config through `#/env`. **No queries, no mappers, no business logic, no React.** Its only job is to hand the rest of the codebase a ready-to-use client. See `src/infrastructure/README.md`.

### Screen folders (`src/presentation/<screen>/`)

Each screen gets its own folder under `src/presentation/`, named semantically (e.g. `home/`, `post-detail/`), not after the URL segment.

```
src/
  app/
    routes/
      __root.tsx
      index.tsx          ← thin: createFileRoute("/")({ component: MarketingView })
                           — imports MarketingView from "#/presentation/marketing/view".
      routeTree.gen.ts   ← generated, do not edit.
    providers/           ← root-level React providers (mounted once in __root.tsx).
      posthog/
      tanstack-query/
  presentation/
    components/          ← shared UI reused across screens (PascalCase).
      catalyst/          ← vendored third-party primitives (read-only).
    home/
      view.tsx           ← JSX + layout. Calls use<Screen>() and renders from its return.
      hooks/             ← screen's hooks live here.
        use-home.ts      ← the VM hook — state, handlers, derived values, data calls.
                           Export: export function useHome() { ... }
        index.ts         ← re-exports useHome (and any other screen-local hooks).
      components/        ← components used only by this screen (PascalCase).
  domain/
    <name>/              ← one folder per bounded context (e.g. workbook, user).
      models/            ← entity types and value objects (e.g. Workbook.ts).
      repositories/      ← one file per data-access function.
                           Uses clients from `infrastructure/`. Returns domain models.
                           e.g. get-workbook.ts, get-workbooks.ts.
      index.ts           ← public surface. Re-exports models + repository functions.
  infrastructure/
    <vendor>/            ← one folder per external SDK.
      index.ts           ← constructs and exports the client singleton.
                           e.g. supabase/index.ts exports `supabase`.
```

Rules:

- **`view.tsx`** holds JSX and layout only. No `useState`, no data fetching, no business logic. Calls `use<Screen>()` and reads everything it needs from the return.
- **`hooks/`** holds the screen's hooks. The main one is `use-<screen>.ts` exporting `use<Screen>()` — this is the viewmodel (state, handlers, derived values, repository calls). Additional hooks can sit alongside (e.g. `use-<feature>.ts` for a sub-concern). `hooks/index.ts` re-exports the public API; the view imports from `./hooks`. Internal hooks used only by other hooks in the folder don't need to be re-exported.
- **`components/`** holds components used by exactly one screen. If a component ends up reused, promote it to `src/presentation/components/`.
- **Cross-screen imports are forbidden.** A screen under `src/presentation/<a>/` must not import from `src/presentation/<b>/` (where `<a>` and `<b>` are screen folders — not `components/`, which is the shared-UI sibling). Shared UI lives in `src/presentation/components/`; shared logic in `src/domain/<name>/`.
- **Route files are thin.** A route file only wires a URL to a view component from `#/presentation/<screen>/view`. If you find yourself adding state or logic in `src/app/routes/`, it belongs in the screen's `use<Screen>()` hook instead.

### Domain and infrastructure

- **One folder per bounded context.** `src/domain/<name>/` (e.g. `workbook/`, `user/`) groups the models and repository functions for that concept. Infrastructure is organised by vendor, not by domain — a single `supabase/index.ts` serves every domain.
- **Repositories are concrete functions, not interfaces.** No `WorkbookRepository` interface — just `get-workbook.ts` exporting an async `getWorkbook(id)` that queries Supabase and returns a `Workbook`. We trade swap/mock ease for less ceremony; this is fine as long as the backend stays Supabase.
- **One function per file, kebab-case file, camelCase export.** `repositories/get-workbook.ts` exports `getWorkbook`. Re-exported from `domain/<name>/index.ts` so callers write `import { getWorkbook } from "#/domain/workbook"`.
- **Wire-format mapping happens inside the repository.** Supabase returns `created_at`; the repository maps to `createdAt` before the function returns. The rest of the app never sees DB column shapes.
- **Errors are thrown, not returned.** Supabase errors bubble to the hook, which surfaces them via TanStack Query state or an error boundary. No `Result<T, E>` type unless a specific feature genuinely needs discriminated failure modes.
- **Import domains through `index.ts`.** Outside code (`presentation/`) imports from `#/domain/<name>`, not `#/domain/<name>/repositories/...`. `index.ts` is the compiled public surface.
- **Dependency direction is linear.** `presentation → domain → infrastructure`. Presentation never imports `infrastructure/` directly — it goes through the domain. Infrastructure never imports domain or presentation.

## Product notes

- **Output format:** workbooks are single, self-contained HTML files. Students must be able to open and complete them offline in any modern browser — no runtime network calls, no external asset dependencies.
- **Latency target:** under 90 seconds from prompt to delivered HTML.
- **Primary user:** language teachers. Copy, defaults, and UX should assume that audience (CEFR levels, grammar topics, classroom-friendly phrasing).
