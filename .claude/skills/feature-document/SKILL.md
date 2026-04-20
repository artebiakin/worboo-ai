---
name: feature-document
description: Documents an existing, already-shipped feature by scanning the codebase and drafting a retroactive spec under docs/features/. Use when the user says "document the existing X feature", "write a spec for the already-built Y", "backfill docs for Z", or asks to create an as-built spec for a feature that already exists. Reads relevant code first to ground the spec in reality rather than guessing.
argument-hint: <kebab-case-slug> [hint: path or route where the feature lives]
disable-model-invocation: true
allowed-tools: Read Write Edit Glob Grep Bash(date:*) Bash(ls:*) Bash(git log:*)
---

Document the existing feature **$1** as an as-built spec.

## Approach

This is NOT a forward-looking spec. The feature exists; you are reconstructing what's there. **Prioritize accuracy over completeness.** Flag anything you cannot verify from code or user input as `[NEEDS REVIEW]` rather than guessing. Never fabricate original intent.

## Steps

1. **Compute today's date:**
   !`date +%Y-%m-%d`

2. **Find the next feature ID** (same logic as feature-new):
   !`ls docs/features/ 2>/dev/null | grep -E '^[0-9]{4}-' | sort | tail -1`

3. **Locate the feature in the codebase.** If $ARGUMENTS includes a path hint, start there. Otherwise:
   - Glob `app/**/*$1*`, `components/**/*$1*`, `lib/**/*$1*`
   - Grep the slug and title-cased variants across `app/`, `components/`, `lib/`
   - If the feature is a route, look for its directory under `app/`

   If matches are ambiguous or the scope is unclear, list what you found and ask the user to confirm before proceeding.

4. **Read the implementation.** Cover:
   - Route files: `page.tsx`, `layout.tsx`, `route.ts`, `actions.ts`, `loading.tsx`, `error.tsx`, `default.tsx`
   - Client components: grep for `'use client'` in the feature's directory
   - Server actions: grep for `'use server'`
   - DB schema: check `prisma/schema.prisma`, `drizzle/schema.ts`, or equivalent for tables this feature touches
   - `middleware.ts` / `proxy.ts` entries affecting the feature's routes
   - Relevant tests under `__tests__/`, `*.test.ts`, `e2e/`
   - Env vars: grep `process.env\.` in feature files

5. **Pull git history** for `shipped_at` and scope evolution:
   !`git log --diff-filter=A --format="%ad %h" --date=short -- app/$1 2>/dev/null | tail -1`
   The first-commit date is a reasonable `shipped_at` fallback. Also check:
   !`git log --format="%h %s" --date=short -- app/$1 2>/dev/null | head -20`
   for PR numbers / issue refs to populate `prs:` and `issues:`.

6. **Draft frontmatter with retroactive adjustments:**
   - `status: shipped`
   - `created:` today (the *doc* is new, even if the feature is old)
   - `updated:` today
   - `shipped_at:` from git if found, else `[NEEDS REVIEW]`
   - Remove `appetite:` and `target_release:` — not meaningful retroactively
   - `owner:` `[NEEDS REVIEW]` unless the user provided one
   - `issues:` / `prs:` populate from git if found

7. **Fill body sections — grounded in code, past tense:**
   - **TL;DR** — one paragraph describing what the feature does today.
   - **Problem** — reconstruct from code comments, README mentions, commit messages. End with `[NEEDS REVIEW — reconstructed, verify original intent]`.
   - **Goals** — infer from what the code actually accomplishes. Flag for review.
   - **Non-goals** — usually unknowable retroactively. Write `Not documented at time of implementation.` Do **not** guess.
   - **User stories / UX** — describe actual current UX from page components and routes.
   - **Solution overview** — describe the as-built end-to-end flow. This can be maximally accurate since you've read the code.
   - **Tech details** — fill every applicable subsection from actual code, citing file paths. This is the highest-value part of a retroactive spec.
   - **Risks & rabbit holes** — rename this section in-place to **Known issues / tech debt**. List anything you noticed while reading: missing tests, client-component boundaries that leaked server data, missing DAL auth checks, N+1 queries, unrevalidated caches, unguarded `process.env.NEXT_PUBLIC_*` secrets, `dynamic = 'force-dynamic'` escape hatches.
   - **Alternatives considered** — `Not documented at time of implementation.` Do not fabricate.
   - **Open questions** — rename to **Known limitations**. List real constraints of the current implementation.
   - **Rollout & success metrics** — historical. Note any flag still in place and the current rollout state. If no metrics exist, say so.

8. **Changelog — start with a retroactive-creation entry:**
   ```
   - {{DATE}} — documented retroactively from existing implementation. Status: shipped.
   ```

9. **Write the file** at `docs/features/NNNN-$1.md` and **update the index** `docs/features/README.md`.

10. **Report back** with:
    - The file path and ID
    - A bullet list of every `[NEEDS REVIEW]` marker left behind
    - The top 3 items from "Known issues / tech debt" you'd prioritize addressing

## Conventions (same as feature-new)

- Filenames: `NNNN-kebab-slug.md`, 4-digit zero-padded, no prefix.
- Status stays `shipped`; future changes go in the Changelog, not by rewriting the body.
- Never fabricate historical intent. When in doubt, mark `[NEEDS REVIEW]` or write `Not documented at time of implementation.`
