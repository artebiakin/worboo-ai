---
name: feature-list
description: Lists and summarizes feature specifications under docs/features/, optionally filtered by status, tag, or owner. Use whenever the user asks about the product roadmap, current features, what's in progress, what's shipped, what's in draft, or wants a summary of feature specs. Also use when the user mentions a feature slug and you need to confirm what specs exist before acting.
argument-hint: [status=<value>] [tag=<value>] [owner=<value>]
allowed-tools: Read Glob Grep Bash(ls:*)
---

List feature specs from `docs/features/`, filtered by any `key=value` constraints in $ARGUMENTS.

## Steps

1. **Enumerate spec files:**
   !`ls docs/features/[0-9]*.md 2>/dev/null`

2. **Parse each file's frontmatter** (id, title, status, owner, updated, tags). Skip `TEMPLATE.md` and `README.md`.

3. **Apply filters** from $ARGUMENTS. Supported: `status=`, `tag=`, `owner=`. Multiple filters are AND-combined. If no filters, show all.

4. **Render a markdown table** grouped by status, in this order:
   `in-progress → accepted → proposed → draft → shipped → deprecated → superseded → rejected`.
   Columns: ID · Title · Owner · Updated · Tags.

5. **Below the table, call out:**
   - Specs whose `updated` is older than 30 days and status is `in-progress` (likely stalled).
   - Specs in `draft` status older than 14 days (likely abandoned).
   - Any specs with open `- [ ]` checkboxes in their "Open questions" section (use Grep).

6. **If the user asked about a specific feature by name or slug**, additionally print a 3-line summary of its TL;DR section.

## Conventions

- Never modify files from this skill; read-only.
- If `docs/features/` doesn't exist, say so and suggest running `/feature-new <slug>`.
