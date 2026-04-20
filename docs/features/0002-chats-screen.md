---
id: 0002
title: "Chats"
status: draft
owner: "@me"
created: 2026-04-20
updated: 2026-04-20
shipped_at:
appetite:
target_release:
tags: [chats, workbook, presentation]
issues: []
prs: []
related: [0001]
---

# Chats

## TL;DR
Introduce a `Chats` screen in the app shell where teachers build a workbook by chatting with the assistant. Each chat captures the prompts, clarifications, and generated output that lead to a single workbook, so the build step becomes a conversation instead of a single free-text box.

## Problem
Today the `/dashboard` Home screen is a single textarea — a teacher types one prompt and we expect to produce a finished workbook. Real prompts are underspecified: level, length, grammar focus, target language, and output style all need clarifying. Without a back-and-forth surface we either guess (bad workbook) or force the teacher to cram everything into one blob of text (bad UX). We also have nowhere to resume a half-built workbook or iterate after a first draft.

## Goals
- Teachers can start a new chat from the app shell and iterate with the assistant until the workbook is ready.
- Each chat is persisted and listed on `/dashboard/chats`, so a teacher can reopen an in-progress build.
- A finished chat produces exactly one workbook (HTML file), linked from the chat.
- The Chats entry is reachable from the sidebar alongside Home and History.

## Non-goals
- Shared / multi-user chats.
- Chat search, filters, tags.
- Assistant memory across chats (each chat is self-contained in v1).
- Exporting the chat transcript itself — only the generated workbook is an export target.
- Voice, attachments, or file uploads.
- Replacing the Home prompt box — Home still offers a one-shot prompt; Chats is the longer-form surface.

## User stories / UX
- As a **teacher with a vague idea** ("a B1 reading on climate change"), I want to refine scope in a chat so the generated workbook matches my class.
- As a **teacher interrupted mid-build**, I want to reopen the chat and continue where I left off.
- As a **teacher reviewing past work**, I want to see my previous chats listed so I can reuse or fork them.
- Figma / design link: *(paste URL here)*

## Solution overview
1. **`/dashboard/chats`** — list of the teacher's chats. Empty state prompts the teacher to start one. Each row shows title, last message preview, updated-at.
2. **`/dashboard/chats/:chatId`** — the conversation view: message list, composer, and a side-panel that surfaces the workbook-in-progress (parameters, preview, download).
3. **New-chat entry** — a "New chat" affordance in the Chats screen (and optionally a button on Home that routes into a fresh chat pre-filled with the Home prompt).

Presentation layer scaffolding lands first in this feature (screen folder, route, sidebar entry, empty state). Wiring to a real chat backend + domain repositories ships in follow-ups once the data model is agreed.

## Tech details

### Routes & files
Routes under `src/app/routes/`:
- `dashboard.chats.tsx` — `/dashboard/chats`, renders `ChatsView`.
- `dashboard.chats.$chatId.tsx` — **planned**, chat detail at `/dashboard/chats/:chatId`.

Screen folders:
- `src/presentation/chats/view.tsx` — list/index view (shipped as empty-state scaffold in this feature).
- `src/presentation/chats/hooks/use-chats.ts` — viewmodel; will own the chats query + new-chat handler.
- `src/presentation/chats/hooks/index.ts` — public surface.

Sidebar: the Catalyst sidebar in `src/presentation/app/components/AppSidebar.tsx` gains a `Chats` item between `Home` and `History`, using the `MessageSquare` icon from `lucide-react`.

### Rendering strategy
Inherits the dashboard shell's `ssr: false` — the chat list/detail run client-side against the Supabase browser client and TanStack Query.

### Components
- `ChatsView` (screen root) — list + empty state.
- `ChatView` (**planned**) — the conversation surface with message list + composer + workbook side-panel.
- Shared primitives go into `src/presentation/components/` when reused across screens.

### Data fetching
Data layer lands in a follow-up. Target shape:

```
src/domain/chat/
  models/
    Chat.ts                ← Chat { id, title, createdAt, updatedAt, workbookId }
    ChatMessage.ts         ← { id, chatId, role, content, createdAt }
  repositories/
    get-chats.ts           ← getChats() — list for the signed-in teacher
    get-chat.ts            ← getChat(id) — chat + messages
    create-chat.ts         ← createChat({ initialPrompt? })
    send-chat-message.ts   ← sendChatMessage({ chatId, content })
  index.ts
```

### Mutations
See Data fetching — mutations live alongside queries under `src/domain/chat/`.

### Caching & invalidation
TanStack Query, keyed by `['chats']` and `['chat', id]`. Sending a message invalidates the chat query; creating a chat invalidates the list.

### Auth, authz, middleware/proxy
Inherits the `/dashboard/*` app-shell guard from feature 0001. Chat rows are scoped to `auth.uid()` via Supabase RLS once the tables exist.

### Metadata & SEO
`/dashboard/chats*` — `noindex` (authenticated area).

### Styling (Tailwind)
- List view mirrors the `History` screen's empty-state pattern (dashed border, muted icon, short copy).
- Conversation view uses Catalyst primitives only; any missing primitives get copied in per project rules.

### Testing
- Vitest unit tests for each repository function (mock Supabase).
- Vitest unit tests for `useChats` viewmodel (empty, loaded, error states).
- Manual E2E once the data layer lands: create chat → send message → generated workbook appears in the side-panel.

### Environment & config
None beyond existing Supabase env vars.

### Database / ORM
New tables (deferred to the data-layer follow-up):
- `chats` — `id`, `user_id`, `title`, `workbook_id nullable`, `created_at`, `updated_at`. RLS: `user_id = auth.uid()`.
- `chat_messages` — `id`, `chat_id`, `role`, `content`, `created_at`. RLS via join on `chats.user_id`.

## Risks & rabbit holes
- **Scope creep vs. Home prompt.** Two input surfaces (one-shot prompt on Home, long-form on Chats) risks confusing teachers. Mitigation: treat Home as a shortcut that silently creates a chat seeded with that prompt; avoid advertising two separate "ways to build".
- **Assistant latency inside a chat.** If each reply takes >5s, the conversation feels dead. Streaming + intermediate states need to be part of the v1 UX, not retrofitted.
- **Message schema churn.** Pinning `role`/`content` too early will force migrations. Start with a JSONB `content` and evolve.
- **Workbook ↔ chat coupling.** If a teacher regenerates from the same chat, do we produce a new workbook version or overwrite? Decision deferred — flagged as open question.

## Alternatives considered
- **Keep the single-shot prompt and lean on follow-up edits of the generated HTML.** Cheaper but pushes the teacher out of a chat mindset and back into text-editor territory, which is exactly the pain we're trying to remove.
- **Use the History screen as the chat list.** Conflates "things I've built" with "things I'm building"; the two lifecycles differ enough to justify separate surfaces.

## Open questions
- [ ] Do regenerations inside a chat produce a new workbook row, or update the existing one? — **owner**: @me
- [ ] Should Home's prompt box create a chat silently, or stay one-shot? — **owner**: @me
- [ ] Chat assistant implementation: do we call Anthropic directly from the browser via a proxy, or route through a TanStack Start server function? — **owner**: @me

## Rollout & success metrics
- No flag — scaffold first, light up the conversation surface behind the feature as the data layer lands.
- **Success (post-data-layer)**: ≥60% of generated workbooks come from Chats (vs. the Home one-shot) within 4 weeks of launch; median time from "New chat" to "download workbook" under 5 minutes.
- **Events**: `chat_created`, `chat_message_sent`, `chat_workbook_generated`.

## Changelog
- 2026-04-20 — created in `draft`. Scaffolded `ChatsView` + `/dashboard/chats` route + sidebar entry; data layer and conversation view deferred.
