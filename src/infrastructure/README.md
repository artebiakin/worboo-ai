# Infrastructure

Initialisation of external clients — nothing else. **No business logic, no queries, no mappers.** Each file in here exports a ready-to-use client that the domain layer imports.

## Structure

```
infrastructure/
  <vendor>/
    index.ts             ← constructs and exports the client singleton.
                           e.g. supabase/index.ts exports `supabase`.
```

## Rules

- **Clients are singletons.** Module-level `const supabase = createBrowserClient(...)` → `export { supabase }`. No factories, no per-call construction.
- **Read env through `#/env`.** Never reference `import.meta.env` or `process.env` directly — go through the validated `env` object so missing/invalid config fails loudly at startup.
- **No queries here.** `supabase.from("workbooks").select(...)` belongs in `domain/workbook/repositories/`. This folder only knows how to build the client.
- **No React.** Provider components (e.g. a `<SupabaseProvider>` that puts the client in context) belong in `src/app/providers/`, not here.

Depends on: `#/env`, vendor SDKs.
Imported by: `domain/<name>/repositories/`.
