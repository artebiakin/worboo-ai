# CLAUDE.md

> **Critical rule:** This project uses Catalyst UI Kit exclusively. Never suggest or install alternative UI libraries. See [UI Components](#ui-components--catalyst-only).
> Project rules and conventions for AI assistants working on this codebase.

## Project Overview

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Package Manager**: npm

## Architecture Rules

### Folder Structure

```
src/
├── app/           → Routes only. Pages are thin orchestrators (<50 lines).
├── components/
│   ├── catalyst/  → Vendored Catalyst UI Kit. Do not edit (see UI Components rule).
│   ├── ui/        → Reserved for custom primitives only when Catalyst can't cover it. Empty by default.
│   ├── layout/    → Shell components (Sidebar, Topbar, Footer).
│   ├── features/  → Composed domain components (UserCard, StatsGrid).
│   └── providers/ → Client-side context providers.
├── lib/           → Pure utilities, constants, configs. No React imports.
├── hooks/         → Custom React hooks. Must start with "use".
├── services/      → Data fetching, API calls, external integrations.
├── types/         → TypeScript interfaces and type definitions.
└── styles/        → Global CSS, Tailwind customizations.
```

### Component Rules

1. **Server Components by default.** Only add `'use client'` when the component needs `useState`, `useEffect`, `onClick`, or browser APIs.
2. **Push `'use client'` as low as possible.** If only a button needs interactivity, make only the button a client component, not the entire page.
3. **One component per file.** File name matches component name in PascalCase.
4. **No business logic in components.** Components render UI. Logic lives in `services/` or `hooks/`.
5. **Props must be typed.** Use `interface` for component props, not `type`.

### Data Flow

```
page.tsx → services/ → database/API
              ↓
         components/ (receive data as props)
```

- Pages fetch data via services. Components receive data as props.
- Components never import from `services/` directly.
- Services never return JSX.

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Component files | PascalCase | `StatsCard.tsx` |
| Hook files | camelCase with "use" | `useMediaQuery.ts` |
| Utility files | camelCase | `formatDate.ts` |
| Service files | camelCase | `userService.ts` |
| Type files | camelCase | `dashboard.ts` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Boolean variables | is/has/can prefix | `isLoading`, `hasAccess` |
| Fetch functions | get/create/update/delete | `getUsers()` |
| Event handlers | handle prefix | `handleSubmit` |

### File Size Limits

- **Components**: Max 150 lines. Split if larger.
- **Pages**: Max 50 lines. Pages are orchestrators, not implementations.
- **Services**: Max 200 lines. Split by domain if larger.
- **Hooks**: Max 100 lines.

## Code Patterns

### Server Component (default)

```tsx
// app/dashboard/page.tsx
import { getStats } from '@/services/stats';
import { StatsGrid } from './_components/StatsGrid';

export default async function DashboardPage() {
  const stats = await getStats();
  return <StatsGrid stats={stats} />;
}
```

### Client Component (only when needed)

```tsx
'use client';
import { useState } from 'react';

interface SearchProps {
  onSearch: (query: string) => void;
}

export function Search({ onSearch }: SearchProps) {
  const [query, setQuery] = useState('');
  // ...
}
```

### Service Layer

```tsx
// services/stats.ts
import { StatsData } from '@/types';

export async function getStats(): Promise<StatsData[]> {
  // fetch from DB or API
}
```

### Validation with Zod

```tsx
import { z } from 'zod';

export const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

// Always validate at boundaries: Server Actions, API routes, external data
```

## Error Handling

- Every route folder should have `loading.tsx` and `error.tsx`.
- Use `error.tsx` for runtime errors (must be `'use client'`).
- Use `not-found.tsx` for 404 states.
- Wrap external API calls in try/catch in services.
- Never silently swallow errors — log or surface them.

## Styling Rules

- Use Tailwind utility classes only. No inline `style={}`, no CSS modules, no styled-components, no emotion.
- Use `clsx` for conditional classes (Catalyst's standard). Do not reintroduce a custom `cn()` helper.
- Dark mode: use `dark:` prefix. Every custom component must work in dark mode.

### Color rules (strict)

This project uses a **Material 3-style semantic color scheme** defined in [src/styles/globals.css](src/styles/globals.css). All app code must reference semantic tokens — never raw palette colors.

#### The token system

Every surface has an `on-*` counterpart for foreground content. Use them in pairs.

| Layer | Background token | Foreground token |
|---|---|---|
| Brand | `bg-primary` | `text-on-primary` |
| Brand (soft) | `bg-primary-container` | `text-on-primary-container` |
| Page canvas | `bg-background` | `text-on-background` |
| Cards / dialogs / navbar | `bg-surface` | `text-on-surface`, muted: `text-on-surface-variant` |
| Surface depth (low → high) | `bg-surface-container-lowest`, `bg-surface-container-low`, `bg-surface-container`, `bg-surface-container-high`, `bg-surface-container-highest` | (use `text-on-surface` / `text-on-surface-variant`) |
| Borders | `border-outline`, `border-outline-variant` | — |
| Error / Success / Warning / Info | `bg-error`, `bg-success`, `bg-warning`, `bg-info` (and `-container` variants) | matching `text-on-error`, `text-on-success`, etc. |
| Inverse (tooltips, snackbars) | `bg-inverse-surface` | `text-on-inverse-surface`, accent: `text-inverse-primary` |
| Overlay | `bg-scrim/50` | — |

All tokens have dark-mode values defined in the same file — `dark:` overrides are usually unnecessary because the token itself flips.

#### Rules

- **Never hardcode colors.** No hex (`#2563eb`), no `rgb()`/`rgba()`, no `hsl()`, no arbitrary-value classes like `bg-[#fff]`. The only place raw hex is allowed is [src/styles/globals.css](src/styles/globals.css) inside the `@theme { ... }` and `.dark { ... }` blocks.
- **Use semantic tokens, not the raw palette.** In our own code, prefer `bg-surface` / `text-on-surface` / `border-outline` over `bg-white` / `text-zinc-900` / `border-zinc-200`. The semantic token already encodes the dark-mode flip.
- **Always use the matching `on-*` foreground.** `bg-primary` pairs with `text-on-primary`, `bg-error-container` pairs with `text-on-error-container`, etc. Don't mix pairs.
- **Need a new color?** Add a new token to `@theme` (and its dark-mode value to `.dark`) in `globals.css` first, then use it. Don't inline the hex.
- **Opacity** uses Tailwind's `/N` modifier on the token: `bg-primary/10`, `bg-scrim/50`, `border-outline/50`. Never `rgba()`.

#### Catalyst exception

Catalyst components are vendored at [src/components/catalyst/](src/components/catalyst/) and built directly on `zinc-*` and patterns like `border-zinc-950/10 dark:border-white/10`. **Do not edit them**, and do not try to convert their internals to semantic tokens — that would break future Catalyst updates.

When **composing** Catalyst primitives in your own components:

- Pass `className` overrides using **semantic tokens** (`className="bg-surface-container"`), not raw zinc.
- For elements that sit **adjacent to** a Catalyst surface and need to visually match it, you may use the Catalyst border convention `border-zinc-950/10 dark:border-white/10` — but `border-outline` is preferred and produces the same result against `bg-surface`.
- Muted body text: prefer the Catalyst `Text` component ([src/components/catalyst/text.tsx](src/components/catalyst/text.tsx)) over writing `text-on-surface-variant` by hand, since `Text` also handles font-size and leading.

### Class ordering

Order utilities by category so call sites stay scannable: **layout → sizing → spacing → typography → colors → borders → effects → states/transitions → responsive**.

```tsx
<button
  className="
    inline-flex items-center justify-center   // layout
    h-10 w-full                                // sizing
    px-4 py-2 gap-2                            // spacing
    text-sm font-semibold                      // typography
    bg-primary text-white                      // colors
    border border-zinc-950/10 rounded-lg       // borders
    shadow-sm                                  // effects
    hover:bg-primary-light transition          // states
    md:w-auto                                  // responsive
  "
/>
```

You don't need to memorize this — `prettier-plugin-tailwindcss` auto-sorts on save. Install it once and stop thinking about order.

### Spacing — Tailwind scale only

Use the Tailwind scale (`p-4`, `gap-3`, `mt-8`). Avoid arbitrary pixel values like `p-[13px]` or `gap-[22px]`.

The only acceptable arbitrary value is a layout-critical fixed dimension that doesn't fit the scale (e.g. a sidebar width), and it should carry a short comment explaining why.

### Opacity via modifiers

Use Tailwind's `/N` opacity syntax instead of arbitrary `rgba()` values.

```tsx
// ✅
<div className="bg-primary/10 border border-zinc-950/10">

// ❌
<div className="bg-[rgba(45,90,39,0.1)]">
<div style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
```

### Inline `style` exception

The "no inline styles" rule has one exception: **truly dynamic values computed at runtime** (e.g. `transform: translateX(${offset}px)` from a drag gesture). Static styling always goes in `className`.

### Responsive — mobile-first

Write base styles for mobile, then layer on `sm:` / `md:` / `lg:` for larger screens. Don't write desktop styles and override them downward — it produces confusing cascade chains.

```tsx
// ✅ mobile-first
<div className="flex-col gap-4 md:flex-row md:gap-8 lg:gap-12">

// ❌ desktop-first
<div className="flex-row gap-12 md:gap-8 sm:flex-col sm:gap-4">
```

### Multi-line `className` formatting

- One-liner is fine for short class lists.
- Once `className` exceeds ~6–8 utilities or wraps in your editor, break it onto multiple lines grouped by the categories above.

### Enforcement

- **Primary:** install `prettier-plugin-tailwindcss` — it auto-sorts classes on format. This is the only enforcement you actually need day-to-day.
- **Optional:** `eslint-plugin-tailwindcss` can flag arbitrary values, but its Tailwind v4 support has historically lagged — verify before adding. Don't block the build on it.

## State Management

- **80% of the app**: Server Components with `await`. No state needed.
- **Local state**: `useState` for single-component interactivity.
- **Shared state**: Lift state up via props first.
- **Global client state**: Zustand (only if truly needed).
- **Do NOT** install Redux, MobX, or Recoil.

## Imports

- Use `@/` alias for all imports from `src/`.
- Group imports: React → external libs → internal modules → types.
- No circular imports between modules.

## Git Conventions

- **Commits**: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
- **Branches**: `feature/feature-name`, `fix/bug-description`.
- Never commit `.env.local`. Use `.env.example` for templates.

## Performance

- Prefer Server Components to reduce client bundle.
- Use `next/image` for all images (never `<img>`).
- Use `next/link` for all internal navigation (never `<a>`).
- Use `next/font` for font loading.
- Lazy load heavy client components with `dynamic()`.

## Security

- Validate all inputs with Zod on the server side.
- Use `middleware.ts` for route protection.
- Never expose secrets in `NEXT_PUBLIC_` env vars.
- Sanitize user input before rendering.

## Testing

- Test files live next to source: `Component.test.tsx`.
- Use React Testing Library for component tests.
- Use Vitest as the test runner.
- Test services independently with mocked dependencies.

## Localization — next-intl

This project is internationalized with **next-intl**. All user-facing text must come from the translation catalog — never hardcode strings in components, pages, server actions, or emails.

### Source of truth

- Messages live in [messages/`{locale}`.json](messages/), namespaced by domain (`common`, `auth`, `dashboard`, `marketing`, `errors`, `validation`, `email`, etc.).
- Config: [src/i18n/routing.ts](src/i18n/routing.ts) (locales + default), [src/i18n/request.ts](src/i18n/request.ts), [src/i18n/navigation.ts](src/i18n/navigation.ts).
- Middleware: [src/middleware.ts](src/middleware.ts). Locale lives in the URL (`/en/...`, `localePrefix: 'always'`).
- Route tree: all pages live under [src/app/[locale]/](src/app/[locale]/). `src/app/api/` and `src/app/actions/` stay unprefixed. [src/app/layout.tsx](src/app/layout.tsx) is a passthrough; `<html>`/`<body>` + providers live in [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx).

### Rules

- **No hardcoded user-facing strings.** Button labels, headings, placeholders, aria-labels, toast messages, metadata, validation messages, email subjects/bodies — all from `messages/{locale}.json`.
- **Server Components** → `const t = await getTranslations('namespace')` from `next-intl/server`.
- **Client Components** → `const t = useTranslations('namespace')` from `next-intl`.
- **Metadata** → `export async function generateMetadata()` using `getTranslations`.
- **Server Actions** → `await getTranslations('namespace')` at the top of the action. The locale is resolved from the request cookie set by middleware.
- **Emails** → same pattern as server actions. Subjects/bodies live under the `email` namespace.
- **Zod schemas** → keep messages as **stable keys** (e.g. `'passwordMin'`). Translate at the action boundary, not inside the schema. See [src/lib/validations/auth.ts](src/lib/validations/auth.ts) + [src/app/actions/auth.ts](src/app/actions/auth.ts) for the pattern.
- **Internal navigation** → `Link` / `redirect` / `usePathname` / `useRouter` from [`@/i18n/navigation`](src/i18n/navigation.ts), NOT `next/link` or `next/navigation`. The wrapped versions handle the locale prefix.
- **ICU format** for plurals and variables: `{count, plural, one {credit} other {credits}}`, `{email}`, `{provider}`. For inline styling inside a message, use rich-text tags: `"We sent a link to <em>{email}</em>."` + `t.rich('key', { email, em: (c) => <span>{c}</span> })`.
- **Testing** — component tests that render translated output must be wrapped in `NextIntlClientProvider` with messages loaded from `messages/en.json`. Server action tests mock `next-intl/server` (see [src/app/actions/auth.test.ts](src/app/actions/auth.test.ts)).

### Adding a new user-facing string

1. Add the key to the appropriate namespace in [messages/en.json](messages/en.json).
2. Consume it with `t('key')` in the component/page/action.
3. For non-English locales, mirror the key in every `messages/{locale}.json`.

### Adding a new locale

1. Create `messages/{locale}.json` with the same key structure as `en.json`.
2. Add the code to `routing.locales` in [src/i18n/routing.ts](src/i18n/routing.ts).
3. Nothing else — no component changes needed.

### Key naming

- camelCase keys (`workbookHistory`, not `workbook_history` or `workbook-history`).
- Namespace by domain, not by screen. `common.back` is reused across every dialog; don't duplicate as `authDialog.back`, `forgotPassword.back`.
- Reuse `common` atoms (`back`, `continue`, `cancel`, `retry`, `edit`, `close`, `tryAgain`, `goHome`) instead of adding feature-local copies.

## What NOT to Do

- Don't make everything `'use client'`.
- Don't put business logic in `page.tsx`.
- Don't skip TypeScript types (no `any`).
- Don't create abstractions before you need them (wait for 3 repetitions).
- Don't use `useEffect` for data fetching — use Server Components.
- Don't nest providers more than 3 levels deep.
- Don't create API routes for things Server Actions can handle.

## UI Components — Catalyst Only

This project uses **Catalyst UI Kit** (by the Tailwind team) as its single source of UI components. This rule is strict to keep the design system consistent.

### Rules

- **Always use Catalyst components** for UI primitives: buttons, inputs, dialogs, dropdowns, tables, navigation, layouts, etc.
- **Never install other UI libraries** — no shadcn/ui, no Material UI, no Chakra, no Ant Design, no Radix (directly), no Mantine, no DaisyUI, no Headless UI additions beyond what Catalyst already uses.
- **Never write raw styled `<button>`, `<input>`, or `<select>` elements** — always import from Catalyst.
- **Before creating a new component**, check `src/components/catalyst/` first. If a primitive exists, use it.

### File Locations

- Catalyst source files live in `src/components/catalyst/` — treat them as vendored code.
- **Never edit Catalyst files.** Not for styling, not for tokens, not for anything. They must stay pristine so future Catalyst updates apply cleanly.
- To restyle a Catalyst primitive, either (a) pass `className` at the call site, (b) wrap it in a feature component under `src/components/features/`, or (c) extend the underlying `@theme` token / `@layer base` rule in [src/styles/globals.css](src/styles/globals.css) so the change flows through automatically.

### Import Pattern

Always use the `@/` alias:

```tsx
// ✅ Correct
import { Button } from '@/components/catalyst/button';
import { Input } from '@/components/catalyst/input';
import { Dialog, DialogTitle, DialogBody } from '@/components/catalyst/dialog';

// ❌ Wrong — relative imports
import { Button } from '../../components/catalyst/button';

// ❌ Wrong — raw HTML element
<button className="bg-green-600 text-white px-4 py-2 rounded">Click</button>
```

### Composing Components

When a Catalyst primitive needs project-specific styling (e.g., a hero CTA), **wrap it** in a new component under `src/components/features/` — don't modify Catalyst itself:

```tsx
// src/components/features/HeroButton.tsx
import { Button, type ButtonProps } from '@/components/catalyst/button';

interface HeroButtonProps extends Omit<ButtonProps, 'color'> {
  children: React.ReactNode;
}

export function HeroButton({ children, ...props }: HeroButtonProps) {
  return (
    <Button color="dark" className="px-10 py-4 text-lg" {...props}>
      {children}
    </Button>
  );
}
```

### Available Catalyst Components

Buttons & actions: `Button`, `Link`
Forms: `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Combobox`, `Listbox`, `Fieldset`, `Label`
Feedback: `Alert`, `Badge`
Overlays: `Dialog`, `Dropdown`
Navigation: `Navbar`, `Sidebar`, `Pagination`
Layout: `AuthLayout`, `SidebarLayout`, `StackedLayout`, `Divider`
Data: `Table`, `Avatar`, `DescriptionList`
Typography: `Heading`, `Subheading`, `Text`, `Code`

If a component you need doesn't exist in Catalyst, **ask before adding a new library**. Most needs can be composed from existing primitives.

### Catalyst Styling

- Extend styles on specific instances via Catalyst's `className` prop — do not fork the component.
- All other styling rules follow the global [Styling Rules](#styling-rules) section.

### Icons — Lucide React Only

- **Always use [`lucide-react`](https://lucide.dev/)** for icons. No other icon libraries (no Heroicons, no react-icons, no Font Awesome, no Material Icons, no custom SVG packs).
- Import icons individually by name: `import { Search, User } from 'lucide-react';`
- Size icons via Tailwind classes (`className="size-5"`) — do not pass pixel `size` props.
- Inline SVGs are allowed only for logos, illustrations, or brand assets that aren't icons.

### When Adding a New Catalyst Component

If you download a new component from Catalyst:

1. Place the file in `src/components/catalyst/`.
2. Install any new dependencies it requires (check its imports).
3. Add it to the "Available Catalyst Components" list above.
4. Commit with message: `chore: add Catalyst <ComponentName>`.

## Feature specifications

Feature specs live in `docs/features/`. Before implementing or modifying
a feature, read its spec. Use `/feature-new <slug>`, `/feature-update
<id-or-slug> <k=v>`, and `/feature-list` to manage them. The current index:

@docs/features/README.md
