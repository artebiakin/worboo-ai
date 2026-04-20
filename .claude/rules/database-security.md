# Database security conventions

The database is **closed by default** — every table ships locked, and each migration opens the minimum slice of access the feature currently uses. Widen later, in the migration that needs it.

## Rules

- **Enable RLS on every new `public.*` table.** The migration that creates the table must include `alter table public.<name> enable row level security;`. A table without RLS leaks every row to every `anon` / `authenticated` client.
- **No policy = no access.** With RLS on, absence of a policy means nobody gets in. That's the intended default — do not add "just in case" policies.
- **Open the minimum set of operations.** Only add `select` / `insert` / `update` / `delete` policies the shipping feature actually calls. If the domain layer exposes `createChat` and `getChats`, the migration grants exactly `insert` and `select` — no `update`, no `delete`. Add those later, in the migration that introduces the rename/delete feature.
- **Scope policies to `authenticated`.** Never grant `to anon` or `to public` on user-owned tables. Public-readable tables (if any) must be called out explicitly in the migration with a comment explaining why.
- **Scope rows by `auth.uid()`.** Ownership predicates use `user_id = auth.uid()`. Use `WITH CHECK` on `insert` and `update` to prevent a client from writing a row owned by someone else.
- **Default ownership on insert.** Prefer `user_id uuid not null default auth.uid() references auth.users(id) on delete cascade` so the column fills itself; the `WITH CHECK` policy still enforces the match if the client sends a value.
- **Name policies `<table>_<op>_<scope>`.** e.g. `chats_select_own`, `chats_insert_own`. Scannable in `pg_policies`.
- **No triggers or helper functions without a caller.** Don't ship an `updated_at` trigger on a table that doesn't yet expose `update` — dead code. Add it alongside the migration that opens `update`.
- **Domain repositories are not the security boundary.** RLS is. Every query from `domain/<name>/repositories/` must return correct results even if the repository code has a bug — because the database won't let it do otherwise.
- **When in doubt, ship the narrower migration.** Opening access later is cheap; retroactively closing it is a breaking change that may be impossible if external clients already depend on it.
