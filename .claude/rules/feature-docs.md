---
description: Conventions for feature specification documents.
---

# Feature docs conventions

- Feature specs live at `docs/features/NNNN-kebab-slug.md` (4-digit zero-padded, no prefix).
- The index is `docs/features/README.md` — keep it in sync when specs change.
- Status enum: `draft | proposed | accepted | in-progress | shipped | deprecated | superseded | rejected`.
- Frontmatter is authoritative for `id`, `status`, `owner`, `created`, `updated`, `shipped_at`, `tags`, `issues`, `prs`, `related`.
- Once a spec's status is past `accepted`, the body is append-only: put changes in the Changelog section.
- Prefer the `/feature-new`, `/feature-update`, `/feature-list`, and `/feature-document` skills over direct file edits.
- Never `@`-import individual spec bodies into `CLAUDE.md`; only the index is imported.
