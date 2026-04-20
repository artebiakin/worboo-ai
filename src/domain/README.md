# Domain

Business logic for Worboo, grouped by bounded context. Repository functions live here (not interfaces) — they directly use the clients initialised in `infrastructure/`. Presentation code only ever talks to the domain.

## Structure

```
domain/<name>/
  models/               ← entity types and value objects.
                          e.g. Workbook.ts — a plain interface shaped like the data
                          the rest of the app consumes.
  repositories/         ← one file per data-access function. Uses clients from
                          `infrastructure/`. Returns domain models (not raw DTOs).
                          e.g. get-workbook.ts, get-workbooks.ts, create-workbook.ts.
  index.ts              ← the bounded context's public surface.
                          Re-exports models + repository functions.
                          Outside code imports only from here.
```

## Rules

- **One repository function per file.** Named after the operation (`get-workbook.ts`, not `WorkbookRepository.ts`). Default export is the function. File name uses kebab-case; the exported function is camelCase.
- **Repositories return domain models, not wire DTOs.** Map Supabase row shapes (`created_at`) to the domain model (`createdAt`) inside the repository. The rest of the app never sees snake_case columns or nullable columns we've decided are invariants.
- **Outside code imports from `index.ts`.** Callers write `import { getWorkbook } from "#/domain/workbook"` — never reach into `models/` or `repositories/` directly. `index.ts` is the compiled contract of this bounded context.
- **Cross-domain imports go through `index.ts`.** If `domain/b` needs a type from `domain/a`, `import { A } from "#/domain/a"`. Circular imports signal a missing shared domain.
- **Errors are thrown, not returned.** Supabase errors bubble up; the controller handles them via TanStack Query's `error` state or an error boundary. Don't invent a `Result<T, E>` type unless a specific repository actually needs discriminated failure.

Depends on: `infrastructure/` (for clients).
Imported by: `presentation/<screen>/controller/` only.
