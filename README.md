# imerco-hn-case

**Live:** https://imerco-hn-case.vercel.app/

Viser 10 tilfældige topnyheder fra Hacker News, sorteret efter score (score stigende som standard, kan ændres i sorteringsvælgeren). Hver række har titel, URL, tidspunkt, score, forfatter, forfatterens karma og et dummy-billede. Knappen "Vis 10 nye historier" henter et nyt udvalg.

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

- **Next.js + TypeScript + SCSS.** Server Components holder HN-kaldene på serveren med indbygget caching, TypeScript i strict mode giver typesikre API-data, og SCSS opfylder kravet om en preprocessor uden et CSS-framework.
- **Server Components hele vejen.** Data hentes på serveren; kun tema-knap, "Vis 10 nye", sorteringsvælgeren og fejlsiden er client components. Ingen API-nøgler eller fetch-logik i browseren.
- **Tilfældigt udvalg pr. request.** `connection()` gør siden dynamisk, mens de enkelte HN-kald caches (top-liste 60 s, items 5 min, brugere 1 t).
- **Sortering med seed.** `?seed=` styrer, hvilke 10 historier der trækkes, så `?sort=` kan sortere på serveren uden at trække nye. Uden `?sort` er rækkefølgen score stigende som krævet.
- **Parallelle kald.** Items og brugere hentes med `Promise.allSettled`, så ét fejlende kald ikke vælter siden.
- **Domæne adskilt fra generiske hjælpere.** Alt HN-specifikt ligger i `lib/hn/`, rene funktioner i `utils/` med unit-tests.
- **Ingen UI-biblioteker.** SCSS Modules med variabler og mixins, én accentfarve, lyst/mørkt tema uden blink ved indlæsning.
- **Tilgængelighed.** Semantisk `main`/`article`/`time`, synligt fokus, WCAG AA-kontrast, `prefers-reduced-motion` respekteres. Opdater-knappen bruger `aria-disabled` i stedet for `disabled`, så fokus ikke tabes under hentning.

## Edge cases

- Døde, slettede, ikke-story eller manglende items springes over og erstattes fra den blandede liste.
- Historier uden URL (Ask HN) eller med en ikke-http(s)-URL linker til HN-tråden.
- Fejler et brugeropslag, vises "karma ukendt" i stedet for at fejle.
- Fejler top-listen, viser `error.tsx` en dansk fejlbesked med "Prøv igen".
- Ingen gyldige historier giver en tom-tilstand i stedet for en tom liste.
- Skeleton-rækker under indlæsning, uden animation ved reduced motion.
- Layout virker fra 320px uden vandret scroll (testet i e2e).
- Top-listen caches i 60 s, så samme seed kan give nogle få andre historier, når cachen er fornyet.

## Brug af AI

Projektet er bygget med Claude Code som par-programmør; jeg har styret retning, scope og kvalitet.

- **Små PR'er med tidsmål.** Jeg delte opgaven i små PR'er (setup → data → UI → states → e2e/CI → docs).
- **Design.** Jeg afviste flere generiske, "AI-agtige" designforslag og satte selv den redaktionelle retning.
- **Krav.** Jeg opdagede, at den fulde URL på hver historie (et hårdt krav) manglede, og fik den tilføjet.
- **Scope-styring.** Undervejs prioriterede jeg krav og kvalitet over nye features og visuel polish. Sortering tilføjede jeg sent, først da alle krav, tests, CI og docs var på plads.

## Kvalitetssikring af AI-genereret kode

1. **Regler for agenten.** [`CLAUDE.md`](CLAUDE.md) styrer agenten:
   - Code style: explaining variables, guard clauses og domænestruktur (`lib/hn/` vs. generiske `utils/`).
   - Ingen UI-biblioteker og ingen nye afhængigheder uden min godkendelse.
   - Tilgængelighed (WCAG AA) og mobile-first fra 320px.
   - Lint, typecheck, format:check og tests skal være grønne lokalt før hver commit.
2. **Automatiske gates.** GitHub Actions kører lint → typecheck → format:check → unit/integration → build → e2e ved hver push og PR. Branch protection blokerer merge til `main`, medmindre `ci` er grønt og branchen er opdateret. Det gælder også admins.
3. **Menneskelig gate.** Agenten merger aldrig. Jeg reviewer hver diff og ser UI'et på mobil og desktop. En separat Claude-chat er reviewer nummer to, men jeg beslutter selv, hvad der rettes, fx `h3`-titler og `aria-disabled` på opdater-knappen.

## Hvad jeg ville gøre med mere tid

- Tema-knappens ikon og label korrekt allerede før hydrering (i dag er ikonet tomt og labelen standard, indtil klienten har hydreret).
- Visuel regressionstest og automatisk a11y-scan (axe) i e2e.
- Opdatere GitHub Actions til versioner, der kører direkte på Node 24.

## Tidsforbrug

- Start: 2026-11-25 16:24:25
- Slut: 2026-11-25 19:03:01
- Total: ca. 2 t 39 m
- Plus: ca. 15 min planlægning og prompt-skrivning før start.
- I alt inkl. planlægning: ca. 2 t 54 m
