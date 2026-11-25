# Architecture

Next.js App Router app. Every folder has one job, so it is clear where new code goes.

| Folder           | Job                                                                                   | Example                |
| ---------------- | ------------------------------------------------------------------------------------- | ---------------------- |
| `src/app`        | Routes and route states: the page, `loading.tsx`, `error.tsx`.                        | `app/page.tsx`         |
| `src/components` | What the user sees and clicks, each with its own `*.module.scss`.                     | `components/StoryRow/` |
| `src/lib/hn`     | Everything Hacker News: API client, types, validation and mapping.                    | `lib/hn/api.ts`        |
| `src/lib/theme`  | Theme resolution, storage key and the inline script that sets the theme before paint. | `lib/theme/theme.ts`   |
| `src/utils`      | Generic pure functions. No HN knowledge, no I/O.                                      | `utils/shuffle.ts`     |
| `src/styles`     | Design tokens (`_variables.scss`), mixins and global styles.                          | `styles/_mixins.scss`  |

## How a request flows

1. `app/page.tsx` is a Server Component. `connection()` makes it render per request, so every visit gets a new random set.
2. `getRandomStories()` in `lib/hn/api.ts` fetches the top list, shuffles it (`utils/shuffle`) and fetches items in parallel. `isValidStory` (`lib/hn/story.ts`) filters out dead, deleted and non-story items; missing ones are refilled from the shuffled list.
3. Authors are fetched in parallel and deduplicated. `toStory` maps item + user to the `Story` the UI needs (safe URL, domain, karma or `null`).
4. The list is sorted by score ascending (`utils/sort`) and rendered by `StoryList` → `StoryRow`.
5. While this runs, `loading.tsx` shows skeleton rows. If the top list fails, `HNApiError` is thrown and `error.tsx` renders with a retry that calls `reset()`.
6. "Vis 10 nye historier" (`RefreshButton`, client) calls `router.refresh()` inside a transition, so the server renders a new set without a full reload.

All HN responses go through `fetch` with `next.revalidate` (top list 60 s, items 5 min, users 1 h). The base URL comes from `HN_API_BASE`, which is how tests swap in a mock.

## Client vs. server

Only three files are client components: `ThemeToggle` (reads/writes `localStorage` via `useSyncExternalStore`), `RefreshButton` and `app/error.tsx` (Next.js requires it). Everything else renders on the server, and `lib/hn/api.ts` imports `server-only`.

The theme is a `data-theme` attribute on `<html>`, set by an inline script in `<head>` before first paint. With no stored choice, CSS follows `prefers-color-scheme`.

## Tests

| Layer               | Tool               | Covers                                               |
| ------------------- | ------------------ | ---------------------------------------------------- |
| `tests/unit`        | Vitest             | Pure functions in `utils/` and `lib/`                |
| `tests/integration` | Vitest + RTL + MSW | API client against mocked HN, components and states  |
| `tests/e2e`         | Playwright         | Production build against `tests/e2e/mock-server.mts` |
