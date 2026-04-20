---
name: feature-update
description: Updates frontmatter or adds a changelog entry to an existing feature spec in docs/features/. Use when the user says "mark feature X as shipped", "update status of <slug>", "add PR link to feature Y", "bump feature Z to in-progress", or any request to mutate a feature spec's metadata. Preserves append-only semantics once status is past 'accepted'.
argument-hint: <id-or-slug> <field>=<value> [<field>=<value> ...]
disable-model-invocation: true
allowed-tools: Read Edit Glob Bash(date:*) Bash(ls:*)
---

Update the feature doc identified by **$1** with the fields in **$ARGUMENTS**.

## Steps

1. **Resolve the target file.** `$1` may be a numeric ID (`0002`, `2`) or a slug fragment (`stripe`, `stripe-checkout`):
   !`ls docs/features/ 2>/dev/null`
   - If numeric, match `docs/features/NNNN-*.md` where NNNN is `$1` zero-padded to 4 digits.
   - If slug, glob `docs/features/*$1*.md`. If multiple match, list them and ask.

2. **Read the current file** to inspect frontmatter and current status.

3. **Parse the remaining arguments** as `key=value` pairs. Recognized fields:
   `status`, `owner`, `shipped_at`, `target_release`, `appetite`, `tags` (comma-separated, replaces), `issues` (comma-separated, appends), `prs` (comma-separated, appends), `related` (comma-separated, appends).

4. **Apply rules:**
   - Always update `updated:` to today: !`date +%Y-%m-%d`
   - If transitioning to `status: shipped`, set `shipped_at:` to today unless provided.
   - If the current status is `shipped`, `deprecated`, `superseded`, or `rejected`, **do not edit body sections.** Metadata-only edits are allowed; substantive changes go in the Changelog as a new dated entry.
   - Valid status transitions:
     `draft → proposed → accepted → in-progress → shipped`
     any → `deprecated | superseded | rejected`.
     Warn on backward transitions.

5. **Edit the file** using targeted Edit calls — do not rewrite the whole file.

6. **Append a Changelog entry** with today's date summarizing the change (e.g. "`2026-04-17` — status: in-progress → shipped; added PR link #482").

7. **Update `docs/features/README.md`** to reflect the new status/updated-date in the index row.

8. **Report back** with a one-line summary of what changed.
