---
name: feature-new
description: Creates a new feature specification document under docs/features/ using the project's canonical template. Use when the user says "new feature doc", "create a feature spec", "start tracking feature X", "spec out <feature>", or any request to begin a new feature write-up. Assigns the next available 4-digit ID and scaffolds frontmatter.
argument-hint: <kebab-case-slug> [optional title]
disable-model-invocation: true
allowed-tools: Read Write Edit Glob Bash(date:*) Bash(ls:*)
---

Create a new feature spec for slug: **$1**

## Steps

1. **Compute today's date** for frontmatter:
   !`date +%Y-%m-%d`

2. **Find the next feature ID.** List existing specs and pick `max + 1`, zero-padded to 4 digits:
   !`ls docs/features/ 2>/dev/null | grep -E '^[0-9]{4}-' | sort | tail -1`
   If the directory is empty or doesn't exist, start at `0001`. Create `docs/features/` if missing.

3. **Read the canonical template:** [template.md](template.md).

4. **Derive the title.** If the user passed a title as `$2` and beyond, use it. Otherwise, convert the slug to Title Case (e.g. `stripe-checkout` → `Stripe Checkout`).

5. **Write the new file** at `docs/features/NNNN-$1.md`, filling the template placeholders:
   - `{{TITLE}}` → derived title
   - `{{OWNER}}` → leave as `@me` placeholder; the user will fill it
   - `{{DATE}}` → today's date from step 1
   - `id: NNNN` → the 4-digit number from step 2
   - Leave `status: draft`, empty `tags`, `issues`, `prs`, `related`, `shipped_at`, `target_release`.

6. **Update the index.** Append a row to `docs/features/README.md`'s status table with the new feature. If the README doesn't exist yet, create it with this skeleton:

   ```md
   # Feature specifications

   | ID | Title | Status | Owner | Updated |
   |----|-------|--------|-------|---------|
   ```

7. **Confirm to the user** with the full file path, ID, and a one-line reminder: "Fill in the Problem, Goals, and Non-goals first; tech details can wait until you've bounded the scope."

## Conventions (enforce silently)

- Filenames: `NNNN-kebab-slug.md`, 4-digit zero-padded, no prefix.
- Status enum: `draft | proposed | accepted | in-progress | shipped | deprecated | superseded | rejected`.
- Never rewrite a file whose status is past `accepted` — append to its Changelog instead.
- Do not @-import individual feature docs into CLAUDE.md; only the index is imported.
