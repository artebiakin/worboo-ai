# Async UI states

Every screen that depends on async data has three states: **loading**, **error**, **loaded**. All three are part of the UI — none of them is "just a spinner" or "just silent".

## Loading — skeletons, not spinners

- **Data-dependent regions render a skeleton** that mirrors the shape of the loaded content: same container, same row count, same dimensions, same spacing. The user should see the page *settle into* real data, not *replace* a spinner with it.
- Skeletons use Tailwind's `animate-pulse` on placeholder blocks (`bg-zinc-950/5 dark:bg-white/5`). Nothing else animates.
- **Do not use spinners for data.** `Loading…` text, progress bars, and centered spinners are forbidden for query states. This applies to the initial fetch, to refetches, and to paginated loads.
- **Acceptable exception — shell bootstrap.** The top-level app shell (e.g. the session-guard in `useApp`) may show a centered spinner *before* we know what to render at all. Use sparingly; once a shape is known, it's a skeleton.
- **Action state ≠ loading state.** A submit button that goes `disabled` + shows a spin icon while a mutation runs is action feedback, not data loading, and stays allowed. The no-spinner rule governs data-dependent UI regions, not individual interactive controls.

## Errors — catch every one and present it

- **No silent catches.** Every `try`/`catch`, every TanStack Query `error`, every awaited call has a visible user-facing outcome. An error that only hits the console is a bug.
- **Query errors render inline** in the region the data would have filled — same container, a short message with the thrown error's message (not a generic "something went wrong"), and a retry affordance when the failure is likely transient. Use `query.error.message` when the error is an `Error`; fall back to a short generic line only if no message exists.
- **Mutation errors surface via `sonner`**: `toast.error(err instanceof Error ? err.message : "<short fallback>")`. Never swallow.
- **Always log before presenting.** `logger.scope("<feature>").error("<human label>", err)` before the toast / inline render, so diagnostics exist without leaking stack traces into the user-facing message.
- **Never show raw Supabase / DB error codes.** If `err.message` looks like `duplicate key value violates …`, catch earlier and translate to a user-facing sentence. Unknown errors get a short generic fallback, but the real error still goes through `logger`.
