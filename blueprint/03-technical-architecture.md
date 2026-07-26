# 03 — Technical Architecture

## The architecture in one paragraph

Atlas is a **single-document, in-memory, local-first React application**. One Zod-validated document (`AtlasDoc`) is read from IndexedDB at startup, migrated if needed, held in a Zustand store, mutated only through domain-checked actions, autosaved whole on a debounce, and exported/imported as human-readable JSON. There is no server, no query layer, no cache, and no loading state. The system is four layers with one-way dependencies; the bottom layer (`domain`) is pure TypeScript designed to outlive every layer above it.

## Layers and the dependency rule

```
┌─────────────────────────────────────────────────────┐
│ app/        composition root: router, providers,     │
│             shell, theme boot, tab guard              │
├────────────────────────┬────────────────────────────┤
│ features/*             │  (features NEVER import     │
│ founding week systems  │   other features; shared    │
│ question book pulse    │   needs are promoted down)  │
│ capture pillars atlas  │                             │
│ reflect ceremonies …   │                             │
├──────────┬─────────────┴───────────┬────────────────┤
│ design/  │ data/                   │                 │
│ tokens   │ store (zustand slices)  │                 │
│ primitives│ actions (only mutation │                 │
│ components│  path, rule-enforcing) │                 │
│          │ persist (idb, autosave, │                 │
│          │  migrations, tab guard) │                 │
│          │ transfer (export/import)│                 │
├──────────┴─────────────────────────┴────────────────┤
│ domain/   THE DECADE LAYER — pure TS, imports nothing │
│ schema (zod + inferred types) · time (local dates,    │
│ ISO weeks) · derive (density, day-count, week views)  │
│ rules (invariants) · grammar (⌘K parser)              │
└─────────────────────────────────────────────────────┘
```

Enforced by ESLint `import/no-restricted-paths` (see `11`). `lib/` (generic utils: `cn`, `debounce`) may be imported anywhere but may not know Atlas concepts.

## State management

- **One store, sliced by collection** (`seasons`, `systems`, `sessions`, `questions`, `books`, `signals`, `milestones`, `identity`, `meta`) plus a small `ui` slice (theme, open sheet, ⌘K state, founding step) that is **not persisted**.
- **Actions live in `data/actions/`**, one module per feature-verb group (`markSession`, `addIdea`, `closeQuestion`…). Each action: (1) calls `domain/rules` to validate the transition, (2) applies an immutable update, (3) returns a typed result. Components never call `set` directly.
- **Append-mostly enforced at the action layer:** immutable record types (`sessions`, `milestones`, `identity`, idea/note fragments, `signals` after their day) expose no update path; the type system and the action surface make dishonesty inexpressible.
- **Selectors are memoized per derived view** (`selectWeekView(weekKey)`, `selectDensity(systemId, window)`); components subscribe narrowly. Derived data is computed in `domain/derive` — selectors only bind store state to pure functions.
- **Why not reducers/RTK/jotai:** one user, one document, low event rate; Zustand is the smallest tool that keeps mutation centralized. Why not TanStack Query: no async state exists (decision record DR-3, `11`).

## Persistence

```
action → store update → subscribe → debounce 500 ms → serialize AtlasDoc
      → IndexedDB put (single object, single transaction)  [atomic]
      → on visibilitychange/pagehide: flush immediately
```

- **Startup:** open idb → `get('atlas-doc')` → if absent: fresh doc + route `/founding` → else `migrate(doc)` → `AtlasDocSchema.parse` → hydrate → render. Total budget < 50 ms; no loading UI exists.
- **Migrations:** `data/persist/migrations/v{N}.ts`, pure `(docN) → docN+1`, run as a chain; applied on load *and* on import. Every version bump commits a fixture export to `fixtures/exports/vN.json` and a test that the chain migrates it to current (see `10`).
- **Multi-tab:** BroadcastChannel `atlas-presence`; second tab renders the guard screen; "Use here instead" broadcasts a release, first tab freezes to the guard screen after flushing.
- **Durability:** `navigator.storage.persist()` after founding; storage status surfaced on `/data`.
- **Corruption:** parse failure → rescue screen; the raw stored value is downloadable before any repair attempt. Atlas never silently discards bytes.

## Routing (TanStack Router, file-based)

| Route | Surface | Phase | Guard |
|---|---|---|---|
| `/` | Week | v0.1 | founded |
| `/founding` | Founding ceremony | v0.1 | not-founded (else →`/`) |
| `/foundations` | Identity page | v0.1 | founded |
| `/data` | Data & Settings | v0.1 | none |
| `/pillars`, `/pillars/$pillarId` | Pillars | v0.2 | founded |
| `/reflect`, `/reflect/$entryId` | Reflect | v0.2 | founded |
| `/atlas` | Atlas view | v1.0 | founded |
| Ceremonies (weekly/season/year/final) | full-screen overlays, not routes — they preserve the underlying room and must be resumable without URL semantics | v0.2+ | — |

Sheets are search-param state (`?question`, `?book`, `?milestone=id`) so they deep-link and restore, without becoming route hierarchy.

## Animation architecture

- **Tokens only:** `design/tokens/motion.ts` exports named durations (`instant 120`, `room 250`, `settle 350`, `page 400`, `seal 900`, `echo 1000`) and the signature easing `cubic-bezier(0.25, 1, 0.5, 1)`. Motion (the library) consumes tokens; raw numbers in feature code fail review.
- **Choreography lives beside the surface that owns it** (`features/week/motion.ts` etc.); primitives expose variants, features compose them.
- **Reduced motion:** a single `useMotionMode()` hook (system preference + `/data` override) selects between full variants and a universal `fade150` variant set. Every animated component takes its variants from this hook — reduced-motion is structurally incapable of being forgotten.
- **The held beat** (seal/unseal) is implemented as explicit delay tokens, not animation padding, so reduced-motion can preserve the *pause* while dropping the *movement*.

## Design tokens pipeline

`design/tokens/*.ts` (single source, typed) → generated CSS custom properties on `:root` / `[data-theme]` → Tailwind v4 `@theme` consumes the variables → utilities like `bg-surface text-ink-muted` are the only color/space/type vocabulary available in JSX. Fonts self-hosted in `public/fonts` (`font-display: swap`, subsetted). Theme boot inline in `<head>` (pre-React) to eliminate flash.

## Dependency graph (runtime)

```
react ── react-dom ── @tanstack/react-router ── motion ── cmdk ── radix(dialog,popover)
   │                                                                │
   └── zustand ── zod ── idb ── nanoid ── tailwind(build-time) ─────┘
```

Eleven runtime packages. The removal cost of each is documented in `11 §dependencies`; nothing else enters without a decision record.

## Build & delivery

Vite build → static assets → any static host, and equally: `npx serve dist` on localhost forever (delivery must not depend on any company existing in 2035). Service worker (generated, Workbox via `vite-plugin-pwa`) precaches the shell; updates activate on next open — never a "refresh to update" prompt mid-session. CSP meta: `default-src 'self'`. Target: initial JS ≤ 300 KB gz (budgeted in CI, see `10`).
