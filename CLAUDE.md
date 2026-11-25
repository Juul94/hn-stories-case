# imerco-hn-case — Hacker News case (Next.js)

Next.js 16 (App Router, Server Components), React 19, TypeScript strict, SCSS Modules, npm, Node 24 LTS.
Tests: Vitest + React Testing Library + MSW (unit/integration), Playwright (e2e mod mocket netværk).

## Tidsramme

- Start: **2026-11-25 16:24:25** (vægur-tid, inkl. review og merge).
- 18:54:25 (2t 30m): giv besked og prioritér: data + UI → states → tests → CI → README.
- 19:24:25 (3t): stop al kode og alle commits. Kun én sidste commit, der retter tidsforbruget i README.
- Tjek tiden (`date`) før hver ny PR. Opdater tidsforbruget i README løbende.

## Struktur

```
src/
├── app/          # Routes: page.tsx (server), loading.tsx, error.tsx
├── components/   # UI-komponenter + *.module.scss
├── lib/hn/       # HN API-klient og typer
├── utils/        # Rene funktioner (shuffle, sort, time, url) — ingen I/O
└── styles/       # _variables.scss, _mixins.scss, globals.scss
public/           # Statiske filer (placeholder.svg)
tests/
├── unit/         # Vitest, rene funktioner
├── integration/  # Vitest + RTL + MSW
└── e2e/          # Playwright mod mock-server
```

Path alias: `@/*` → `src/*`.

## Kommandoer

- `npm run dev` / `npm run build` / `npm start`
- `npm run lint` · `npm run typecheck` · `npm run format` · `npm run format:check`
- `npm test` (Vitest) · `npm run test:e2e` (Playwright)

## Regler

- Kør `npm run lint`, `npm run typecheck`, `npm run format:check` og `npm test` efter hver ændring. Ingen commits med røde tests.
- Små, logiske commits på feature-branches. PR mod `main`. Brugeren merger — stop efter hver PR og vent.
- Self-review af PR-diffen før review, noteret i PR-beskrivelsen.
- UI-tekster på dansk. Kode, variabler, commits og PR'er på engelsk.
- Ingen UI-biblioteker eller CSS-frameworks. Kun SCSS Modules + globale variabler/mixins. Ingen hex-farver uden for `_variables.scss`.
- Rolig, ren stil: ingen lilla gradienter, glow eller emojis. Én accentfarve.
- Mobile-first, virker fra 320px. Respektér `prefers-color-scheme` og `prefers-reduced-motion`.
- Tilgængelighed: semantisk `main`/`article`/`time`, alt-tekst, synligt fokus, WCAG AA, `rel="noopener noreferrer"` på eksterne links.
- Data hentes på serveren med caching/revalidate. Parallelle kald med `Promise.all`.
- Ingen `any`. Rene funktioner i `utils/` får unit-tests.
- Tilføj, fjern eller opgrader ikke afhængigheder uden aftale.
- Git: kun som Juul94 (noreply-email). Ingen persondata i repoet.
