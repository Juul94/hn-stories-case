# imerco-hn-case

**Live:** https://imerco-hn-case.vercel.app/

Viser 10 tilfældige topnyheder fra Hacker News, sorteret stigende efter score. Hver række har titel, URL, tidspunkt, score, forfatter, forfatterens karma og et dummy-billede. Knappen "Vis 10 nye historier" henter et nyt udvalg.

Arkitektur og dataflow: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Kør projektet

Kræver Node 24 (`.nvmrc`).

```sh
npm install
npm run dev            # http://localhost:3000
npm test               # Vitest: unit + integration (MSW, intet netværk)
npm run build && npm run test:e2e   # Playwright mod lokal HN-mock
npm run lint && npm run typecheck && npm run format:check
```

Første gang e2e køres: `npx playwright install chromium`.

`HN_API_BASE` styrer, hvilket API appen kalder. E2E sætter den til en lokal mock-server (`tests/e2e/mock-server.mts`), så testene er stabile og ikke rammer nettet. Den er bevidst **ikke** sat på Vercel, så live-siden falder tilbage til det rigtige HN API (`https://hacker-news.firebaseio.com/v0`).

## Vigtige valg

- **Server Components hele vejen.** Data hentes på serveren; kun tema-knap, "Vis 10 nye" og fejlsiden er client components. Ingen API-nøgler eller fetch-logik i browseren.
- **Tilfældigt udvalg pr. request.** `connection()` gør siden dynamisk, mens de enkelte HN-kald caches (top-liste 60 s, items 5 min, brugere 1 t).
- **Parallelle kald.** Items og brugere hentes med `Promise.allSettled`, så ét fejlende kald ikke vælter siden.
- **Domæne adskilt fra generiske hjælpere.** Alt HN-specifikt ligger i `lib/hn/`, rene funktioner i `utils/` med unit-tests.
- **Ingen UI-biblioteker.** SCSS Modules med variabler og mixins, én accentfarve, lyst/mørkt tema uden flash.
- **Tilgængelighed.** Semantisk `main`/`article`/`time`, synligt fokus, WCAG AA-kontrast, `prefers-reduced-motion` respekteres. Opdater-knappen bruger `aria-disabled` i stedet for `disabled`, så fokus ikke tabes under hentning.

## Edge cases

- Døde, slettede, ikke-story eller manglende items springes over og erstattes fra den blandede liste.
- Historier uden URL (Ask HN) eller med en ikke-http(s)-URL linker til HN-tråden.
- Fejler et brugeropslag, vises "karma ukendt" i stedet for at fejle.
- Fejler top-listen, viser `error.tsx` en dansk fejlbesked med "Prøv igen".
- Ingen gyldige historier giver en tom-tilstand i stedet for en tom liste.
- Skeleton-rækker under indlæsning, uden animation ved reduced motion.
- Layout virker fra 320px uden vandret scroll (testet i e2e).

## Kvalitet og CI

GitHub Actions kører ved hver push og PR: install → lint → typecheck → format:check → test → build → e2e (Playwright-browsere caches). Node-version læses fra `.nvmrc`.

`main` er beskyttet: status-checket `ci` skal være grønt, og branchen skal være opdateret med `main`, før en PR kan merges. Reglen gælder også admins, så rød CI blokerer merge.

## Brug af AI

Projektet er bygget med Claude Code som par-programmør; jeg har styret retning, scope og kvalitet.

- **Rammer først.** `CLAUDE.md` fastlægger stack, mappestruktur, code style (explaining variables, guard clauses), regler for farver, tilgængelighed, mobile-first, ingen nye afhængigheder uden aftale, og at lint/typecheck/format/test skal være grønne før hver commit.
- **Små PR'er med tidsmål.** Jeg delte opgaven i PR'er (setup → data → UI → states → e2e/CI → docs) med måltider, og jeg merger hver PR selv efter review.
- **Review og beslutninger.** Jeg læste hver diff og så UI'et på mobil og desktop. Jeg brugte en separat Claude-chat som AI-reviewer og sparringspartner til PR-reviews, prompts og designfeedback, og besluttede selv, hvilke punkter der skulle handles på (fx `h3`-titler og `aria-disabled` på opdater-knappen; pre-hydration-label på tema-knappen blev udskudt).
- **Design.** Jeg afviste flere generiske, "AI-agtige" designforslag og satte selv den redaktionelle retning.
- **Krav.** Jeg opdagede, at den fulde URL på hver historie (et hårdt krav) manglede, og fik den tilføjet.
- **Scope-styring.** Undervejs prioriterede jeg krav og kvalitet over nye features og visuel polish, fx blev sortering valgt fra.

## Hvad jeg ville gøre med mere tid

- Sortering (score, tid, karma) styret af brugeren.
- Tema-knappens ikon og label korrekt allerede før hydrering (i dag er ikonet tomt og labelen standard, indtil klienten har hydreret).
- Visuel regressionstest og automatisk a11y-scan (axe) i e2e.
- Opdatere GitHub Actions til versioner, der kører native på Node 24.

## Tidsforbrug

Start 2026-11-25 16:24:25. Brugt: ca. 1 t 45 m (opdateres ved aflevering). Dertil ca. 30 min planlægning og prompt-skrivning før start.
