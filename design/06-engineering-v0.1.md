# Atlas v0.1 — Engineering Plan

Product requirements: `00`–`05` design docs + the ten experience journeys. This document is the build contract for v0.1 ("The Week") and the architectural foundation for everything after it.

Guiding judgment for every decision below: **the data format is the decade-long product; the UI is seasonal.** Optimize the domain and data layers for 2035; optimize the UI for being rewritten.

---

## 1. What belongs in v0.1 — and what was cut

v0.1 is **one screen you live in daily, a ceremony that founds it, a command bar that feeds it, and a data layer you can trust for ten years.**

### In

| Area | Scope |
|---|---|
| **The Founding** | Full ceremony: letter (written + sealed), six identity statements, system declaration, first season (name, focus pillars, intentions), first Question, current book, first pulse. Resumable if interrupted. "Not tonight" graceful exit. |
| **Week screen** | The home room, both lanes: QuestionCard, BookCard, system rows with weekly grid, Today band (session marks, energy dial, one-liner), season header, "Day N of becoming" footer. |
| **Systems** | Create (in founding), mark sessions (1 tap + optional note), weekly rhythm display, 7/30-day density (computed). Pause/retire deferred — no season boundary occurs within v0.1's first month. |
| **Question** | One live question; notes via ⌘K; carry (implicit — it just stays); close with written answer; ask next. State: open → exploring → answered. |
| **Book** | One-at-a-time current book: title/author/pillar/why; loose progress; idea captures via ⌘K; finish (with "what did it change?") and set down. |
| **Pulse** | Energy (1–5) + optional one-liner, one per calendar day. Editable same-day only (append-mostly). |
| **⌘K Command bar** | Capture: session marks, `q:` question notes, `idea:` book ideas, `milestone:` captures. Navigate: the few v0.1 destinations. |
| **Milestone capture** | **Write-only.** ⌘K capture with pillar tag; stored, not rendered anywhere yet. Rationale: the record matters more than the render — evidence must not wait for v0.2's UI. |
| **Foundations page** | Read-only: the six identity statements + the sealed letter's marker. Cheap, and the emotional payoff of the founding must remain visitable. |
| **Data** | Local persistence, autosave, export to human-readable JSON, import with validation, schema versioning + migration runner, multi-tab guard. |
| **Chrome** | Light/dark themes (system + manual), full keyboard operability, reduced-motion support, PWA/offline, a minimal Data & Settings page. |

### Out — with the reason, so future-you doesn't re-litigate

- **Pillars, Atlas, Reflect rooms** — v0.2/v0.3/v1.0 per roadmap. Nav shows only what exists; empty rooms would make v0.1 feel like a demo instead of complete.
- **Weekly Review & Vision ceremony** — v0.2. For the first month, Sunday's "review" is looking at the Week screen; the Question can be closed/asked any day. The ceremony needs Echo and playback to be worth shipping.
- **Milestone rendering, Echoes, pillar detail** — v0.2 (they need accumulated history to mean anything).
- **Season ceremony, sealed season notes** — v0.3 (no season ends during v0.1's life).
- **Density textures beyond the week grid + simple 30-day strip** — the multi-year `DensityTexture` variants are v1.0 Atlas material.
- **Multiple concurrent books** — v0.1 is strictly one current book. Real life has parallel books; v0.1 doesn't. Scope discipline > fidelity, and the data model already supports many.
- **Mobile layout, Tauri wrapper, sync, encryption, photo attachments** — later, if ever. v0.1 is a desktop-browser PWA.

**The completeness test:** a stranger given only v0.1 should experience a founding, live a full week in it, and never hit a dead end, a stub, or a "coming soon."

---

## 2. Success criteria — after one month

**Product (the real ones):**
1. ≥ 25 of 30 days pulsed, and the pulse genuinely takes ≤ 60 seconds (measure honestly a few times).
2. ≥ 2 Questions carried to written answers.
3. ≥ 5 book ideas captured, ≥ 2 of them via ⌘K in under 15 seconds from thought to saved.
4. ≥ 3 milestones captured even though nothing renders them.
5. The subjective one, answered honestly: *you want to open it* — it never once felt like homework.

**Engineering:**
6. Zero data loss across 30 days (verified by weekly exports diffing cleanly).
7. Cold open → interactive in under 1 second; every interaction responds in under 100 ms.
8. One full week driven entirely by keyboard, deliberately, as a test.
9. Export opened in a text editor is readable and self-explanatory to a human.

If 1–5 hold, build v0.2. If they don't, the correct next step is redesign, not more features.

---

## 3. User stories

### Founding
- As a new user, I want a guided founding ceremony, so that Atlas begins from my own words instead of empty screens.
- As a new user, I want to write and seal a letter to my 2030 self, so that the decade has an anchor I cannot peek at.
- As a new user, I want to write one identity statement per pillar, so that everything in the app traces to who I'm becoming.
- As a new user, I want to declare the systems already running in my life with weekly rhythms, so that Atlas starts by recognizing reality.
- As a new user, I want to name my first season, choose 2–3 focus pillars, and write 1–3 intentions, so that my weeks have context.
- As a new user, I want to set my first Question and my current book with its *why*, so that the curiosity lane is alive on day one.
- As a new user, I want to decline with "Not tonight" and resume a half-finished founding later, so that interruption costs nothing.

### Week screen
- As a user, I want to open Atlas directly onto this week — question, book, systems, today — so that one glance shows what becoming looks like this week.
- As a user, I want to see each system's sessions against its weekly rhythm as quiet dots, so that consistency is visible without judgment.
- As a user, I want the season name and week number always present, so that the week sits inside a larger story.
- As a user, I want a "Day N of becoming" footer, so that time in Atlas always points forward.

### Systems & sessions
- As a user, I want to mark a session with one tap and optionally one line, so that recording never interrupts living.
- As a user, I want to mark a session for an earlier day this week, so that forgetting to log ≠ not showing up.
- As a user, I want to unmark a same-week mistake, so that the record stays honest.
- As a user, I want 7/30-day density per system, so that I see rhythm, not streaks.

### Question
- As a user, I want my current question pinned atop every week, so that it primes my attention all week.
- As a user, I want to add dated thought-fragments to it from anywhere, so that gathering has zero friction.
- As a user, I want to close it by writing the answer in my own words, and then ask the next one, so that understanding is recorded as mine.
- As a user, I want an unanswered question to simply persist week over week, so that depth never reads as delay.

### Book
- As a user, I want starting a book to ask only *what* and *why*, so that it feels like an inscription, not a form.
- As a user, I want to update progress only when I feel like it, so that reading stays mine.
- As a user, I want to capture an idea in ~10 seconds from anywhere, so that the moment a book changes my mind is never lost.
- As a user, I want to finish (with "what did it change?") or set down a book with equal dignity, so that the record stays true.

### Pulse
- As a user, I want to record energy and one optional line in seconds, so that daily obligation stays under a minute.
- As a user, I want a missed day to simply be blank, so that absence carries no debt.

### Command bar
- As a user, I want ⌘K from anywhere to capture (`idea:`, `q:`, `milestone:`, session marks) and navigate, so that capture never requires navigation.

### Data
- As a user, I want everything saved locally and automatically, so that I never think about saving.
- As a user, I want one-click export to a readable file and validated import, so that my decade of data is mine and portable.
- As a user, I want old exports to import into future versions, so that no data is ever stranded.

### Chrome
- As a user, I want first-class light/dark themes and full keyboard operation, so that Atlas fits 6 a.m. and midnight, hands on keys.

## 4. Functional requirements

**Founding** — FR-F1: Fresh installs route to founding; founded installs never see it again. FR-F2: Steps in order: letter → statements ×6 → systems → season → question → book → first pulse; progress persisted per step; resumable. FR-F3: Letter is stored obfuscated (base64 + sentinel), never rendered by any v0.1 surface, `opensAt: 2030-12-01`; one warning before sealing; seal is irreversible in-app. FR-F4: Statements — one per pillar, non-empty, versioned append-only. FR-F5: Systems — name, pillar, rhythm 1–7/week; 1–10 systems. FR-F6: Season — name, startDate (today), ~12-week suggested end, 2–3 focus pillars, 1–3 intentions. FR-F7: Question (text, pillar default engineering) and Book (title, author optional, pillar, why) required to finish founding. FR-F8: "Not tonight" exits cleanly pre-founding.

**Week** — FR-W1: `/` renders current ISO week; season name + week index in header. FR-W2: Order: question, book, systems, today band, footer. FR-W3: System rows show Mon–Sun cells; filled = ≥1 session; today focused; future cells inert. FR-W4: Clicking any current-week cell toggles a session mark (optional note via long-press/enter). FR-W5: Footer shows day count since founding; no other numbers. FR-W6: Past weeks viewable read-only (simple prev navigation); no editing outside current week except FR-W4's current week.

**Systems** — FR-S1: Session mark = `{systemId, date, note?}`, append-only plus same-week delete. FR-S2: Density = marks ÷ expected (rhythm-prorated) over rolling 7/30 days, computed, never stored. FR-S3: Max one mark per system per day.

**Question** — FR-Q1: Exactly 0 or 1 question in state `open`/`exploring` at a time. FR-Q2: Adding a note moves `open → exploring`. FR-Q3: Closing requires a non-empty answer; sets `answered` + timestamp; then prompts (skippably) for the next question. FR-Q4: Answered questions listed read-only on the question's history sheet.

**Book** — FR-B1: One book in `reading` at a time. FR-B2: Progress = page or percent, optional, freely editable. FR-B3: Ideas = dated text, append-only. FR-B4: Finishing asks optional "what did it change?"; sets `finished` + a milestone capture auto-mints. FR-B5: `setDown` with optional reason; both endings then offer starting the next book.

**Pulse** — FR-P1: One signal per local calendar date: energy 1–5 required-if-present, line optional. FR-P2: Editable only on its own date. FR-P3: No backfill.

**Command bar** — FR-C1: ⌘K opens everywhere; Esc closes; full keyboard. FR-C2: Prefix grammar: `idea: …` → current book; `q: …` → current question; `milestone: …` (with `#pillar` optional tag) → milestone capture; typing a system name → mark today's session. FR-C3: Plain text falls through to navigation/search of v0.1 destinations. FR-C4: Capture confirms with a quiet inline settle (pillar hue), never a toast.

**Data** — FR-D1: All mutations autosave (debounced ≤ 500 ms) to IndexedDB in one atomic transaction. FR-D2: Export = pretty-printed JSON of the whole document, stable key order, `schemaVersion` first. FR-D3: Import validates with Zod; on failure, refuses with a human message and touches nothing. FR-D4: Migration runner upgrades any older `schemaVersion` on load and on import. FR-D5: Second tab detects via BroadcastChannel and shows a calm "Atlas is open in another window" screen (no write races). FR-D6: `navigator.storage.persist()` requested once post-founding.

## 5. Non-functional requirements

- **Performance:** cold open → interactive < 1 s; input latency < 100 ms; no spinners or skeletons anywhere — if something would need one, make it instant instead (load-all-into-memory makes this achievable; see §6). Bundle budget ≤ 300 KB gz initial.
- **Accessibility:** WCAG 2.1 AA. Every density/texture readable without color (opacity steps + accessible labels). Visible focus rings (the design system styles them; never `outline: none` without replacement). Semantic landmarks; the week grid navigable and markable by keyboard.
- **Offline:** 100% functional offline, forever — there is no online. Installable PWA; service worker precaches the app shell.
- **Animations:** durations/easings exist only as tokens (250–500 ms band, single signature easing). `prefers-reduced-motion` swaps all motion for opacity fades ≤ 150 ms — a first-class mode, not an afterthought.
- **Keyboard:** everything operable without a pointer. ⌘K global; Esc always retreats; arrows/enter in every list; `W/P/A/R` room keys reserved (only W bound in v0.1).
- **Persistence:** append-mostly enforced at the data-layer API (no generic `update()` on immutable record types); `schemaVersion` from day one; every schema change ships a migration; exports from any past version import forever.
- **Responsiveness:** desktop-first, designed at 1280, correct from 1024, functional at 768. Below that, a calm full-screen note — honest beats broken.
- **Privacy / local-first:** zero network requests at runtime — no telemetry, no CDN fonts (self-hosted), no analytics. Enforced by CSP (`default-src 'self'`) so it's a property, not a promise. Data leaves the machine only via explicit export.

## 6. Data model

One root document, loaded fully into memory at startup, persisted whole. At one user's scale (a few records/day for a decade ≈ single-digit MB) this is the correct architecture: it makes reads synchronous, renders instant, export trivial, and eliminates a query layer. Collections are arrays; "relationships" are ids + a fixed pillar enum.

```
AtlasDoc
├─ schemaVersion: 1
├─ meta:        { foundedAt, foundingStep? }          // foundingStep only while founding
├─ letter:      { sealedBody, sealedAt, opensAt }     // base64 + sentinel; UI never decodes
├─ identity:    IdentityVersion[]                     // append-only
├─ seasons:     Season[]
├─ systems:     System[]
├─ sessions:    SessionMark[]                         // append-only (+ same-week delete)
├─ questions:   Question[]
├─ books:       Book[]
├─ signals:     Signal[]                              // keyed by date, one per day
└─ milestones:  MilestoneCapture[]                    // append-only, write-only in v0.1
```

**Entities** (ids: nanoid; timestamps: ISO 8601 with offset; day-keyed fields: **local** calendar date `YYYY-MM-DD`, never UTC timestamps — the classic off-by-one-day bug is a spec violation here):

| Entity | Fields |
|---|---|
| `IdentityVersion` | `id, pillar, text, createdAt` — latest per pillar is current; history is the feature |
| `Season` | `id, name, startDate, plannedEndDate, focusPillars: PillarId[2..3], intentions: {id, text}[1..3]` (sealed note & grades arrive v0.3) |
| `System` | `id, name, pillar, rhythmPerWeek: 1..7, status, createdAt, retiredAt?` |
| `SessionMark` | `id, systemId, date, note?` — unique on `(systemId, date)` |
| `Question` | `id, text, pillar, state, askedOn, answeredAt?, answer?, notes: {id, text, createdAt}[]` |
| `Book` | `id, title, author?, pillar, why, status, progress?: {page} \| {percent}, startedAt, endedAt?, endNote?, ideas: {id, text, createdAt}[]` |
| `Signal` | `date, energy: 1..5, line?` |
| `MilestoneCapture` | `id, text, pillar?, capturedAt` |

**Enums:** `PillarId = engineering | university | english | health | spirit | relationships` (fixed; names/hues live in code config, not data). `SystemStatus = active | paused | retired`. `QuestionState = open | exploring | answered`. `BookStatus = reading | finished | setDown`.

**Derived, never stored:** densities, weekly counts, day-of-becoming, week keys (ISO-8601 weeks, Monday start). Storing derivables creates decade-long consistency debt.

**Zod schemas are the single source of truth** — TypeScript types are inferred from them, import validation uses them, and migrations target them. One definition, three duties.

## 7. Application architecture — and the stack verdicts

Layered, feature-based, with a hard dependency rule: **`domain` imports nothing; `data` imports `domain`; `design` imports nothing above tokens; `features` import all three but never each other; `app` composes.** Cross-feature needs route through `domain`/`data`. This rule is what lets the UI be rewritten in 2028 without touching the decade layer.

| Proposed | Verdict | Reasoning |
|---|---|---|
| React + TypeScript (strict) + Vite | ✅ | Boring, durable, excellent. Strict mode, no `any`. |
| Tailwind CSS (v4) | ✅ | Tokens as CSS variables feeding Tailwind theme; utilities may only reference tokens. |
| TanStack Router | ✅ | Type-safe file routes; tiny now (4 routes), right shape for the four rooms later. |
| Zustand | ✅ | One store, slice per collection, actions defined in `data/` (the only mutation path). Components select narrowly. |
| Zod | ✅ | Promoted: it's the data contract, not a form helper. |
| Motion | ✅ | For settle/crossfade choreography; consumes only motion tokens; reduced-motion variant mandatory. |
| **shadcn/ui** | ⚠️ **Not as a kit** | Its visual language is generic-SaaS and would fight Quiet Observatory in every component. Adopt its *mechanism* (copy-in code, Radix underneath) for exactly what's needed: Dialog, Popover — plus **cmdk** for ⌘K. Everything else is bespoke `design/` components; that was always the plan (`04-design-system.md`). |
| **TanStack Query** | ❌ **Cut from v0.1** | Query manages *server* state — caching, refetching, invalidation. v0.1 has no server and no async reads: the whole doc is in memory. Adding Query would wrap synchronous data in async ceremony. Revisit only if sync ever exists. |
| **React Hook Form** | ❌ **Cut from v0.1** | The largest "form" is three fields. Founding is one input per screen. Controlled inputs + Zod cover everything; RHF earns entry when a form has enough fields to hurt, which v0.1 never does. |
| *(additions)* idb (~1 KB), cmdk, nanoid | ✅ | The entire added-dependency list. Each is small, focused, and replaceable. |

**Persistence flow:** Zustand subscribe → debounce 500 ms → serialize doc → single IndexedDB transaction. Startup: read doc → run migrations → validate → hydrate store → render (no loading state; it's single-digit milliseconds). Export/import are pure functions over the same doc.

**Testing:** Vitest on the decade layer — week math, density, ⌘K grammar, migrations, schema round-trips. Test the domain, not the pixels; UI is verified by living in it daily (the maintainer is the user).

## 8. Folder structure

```
atlas/
├─ design/                    # product & engineering docs (this folder)
├─ public/                    # self-hosted fonts, icons, manifest
└─ src/
   ├─ app/                    # composition root only — providers, router, shell,
   │  ├─ routes/              #   theme bootstrapping, multi-tab guard. No logic.
   │  └─ providers/
   ├─ domain/                 # THE DECADE LAYER. Pure TS, zero imports from
   │  ├─ schema/              #   react/anywhere. Zod schemas + inferred types,
   │  ├─ time/                #   ISO-week & local-date math, density calc,
   │  └─ rules/               #   invariants (one live question, one reading book).
   ├─ data/                   # store + persistence. Zustand slices, actions
   │  ├─ store/               #   (the only mutation path, enforcing append-mostly),
   │  ├─ persist/             #   idb adapter, autosave, migrations/ (one file per
   │  └─ transfer/            #   version bump), export/import.
   ├─ design/                 # QUIET OBSERVATORY. tokens/ (color, type, space,
   │  ├─ tokens/              #   motion — the only place raw values exist),
   │  ├─ primitives/          #   restyled Radix Dialog/Popover, focus ring,
   │  └─ components/          #   IdentityStatement, DensityDots, EnergyDial,
   │                          #   OneLiner, SealedNote… No feature knowledge.
   ├─ features/               # One folder per feature; internal structure free
   │  ├─ founding/            #   (components/, hooks/, index.ts public surface).
   │  ├─ week/                #   Features NEVER import other features.
   │  ├─ systems/
   │  ├─ question/
   │  ├─ book/
   │  ├─ pulse/
   │  ├─ capture/             # ⌘K: cmdk shell + the prefix grammar parser
   │  ├─ foundations/         # read-only identity page
   │  └─ data-settings/       # export/import/theme
   └─ lib/                    # tiny generic utils (cn, debounce). If it knows
                              #   about Atlas concepts, it belongs in domain/.
```

Routes: `/` (week) · `/founding` · `/foundations` · `/data`.

## 9. Technical roadmap — seven milestones, never broken

| # | Name | Size | Ships (working app at every step) |
|---|---|---|---|
| M0 | **Paper** | evening | Scaffold (Vite/TS/React/Tailwind/Router), tokens, self-hosted fonts, both themes, PWA manifest. App = one beautiful empty Week shell with real date + "Day 1 of becoming." The design system is born before any feature — Quiet Observatory from commit one. |
| M1 | **Memory** | weekend | `domain/` schemas + time math (tested), `data/` store + IndexedDB autosave + export/import + migration runner + tab guard. Visible surface: `/data` page. The decade layer exists and is trustworthy before anything feeds it. |
| M2 | **The Week** | weekend | System rows + week grid + session marking + density, Today band (energy dial, one-liner), season header. Systems seeded via a temporary plain form. **→ Start living in Atlas daily at the end of this weekend.** Everything after M2 is built inside a product already in use. |
| M3 | **Curiosity** | weekend | QuestionCard (notes, close-with-answer, ask-next) + BookCard (why, progress, ideas, finish/set-down). The two lanes complete; auto-mint milestone on finished book. |
| M4 | **The Wire** | weekend | ⌘K: cmdk shell, prefix grammar (`idea:`/`q:`/`milestone:`/system names), navigation fallthrough, quiet settle confirmations, full keyboard pass across the app. |
| M5 | **The Founding** | weekend | The complete ceremony incl. letter sealing and resume; replaces M2's temporary seed form (delete it); fresh-install gate; `/foundations` page. Re-found your real data properly, importing nothing — or migrate your month of M2–M4 data in (one-time script). |
| M6 | **Complete** | evening–weekend | Reduced-motion mode, a11y audit (keyboard-only week, contrast, labels), service-worker offline, `storage.persist()`, past-week read-only view, edge states (empty day, unfounded, second tab), motion polish to spec. **= v0.1.** |

Sequencing rationale: data layer before features (M1) because trust is the product; daily use from M2 because a month of real use is the v0.1 success test and it starts the clock early; founding late (M5) because it's the most design-sensitive build and benefits from a month of inhabiting the design system.

## 10. Engineering principles — for the maintainer of 2035

1. **The data format is the product.** Schema changes are the only scary changes: every one ships a migration + a test importing every historical export version. UI rewrites are Tuesday.
2. **The domain layer is framework-free.** If `domain/` imports React, the layering has failed. It must compile unchanged in whatever runtime 2032 brings.
3. **Zero network is an invariant, not a default.** CSP-enforced. Any future feature that wants the network must argue against this line in writing.
4. **No raw values in components.** Every color, duration, easing, and space step comes from `design/tokens`. A hex code in a feature file fails review.
5. **Features never import features.** Shared need = promote to `domain`/`data`/`design`. This is the rule that keeps year-five Atlas navigable.
6. **Append-mostly is API-enforced.** Immutable record types expose `add` (and narrowly-scoped same-period `remove`), never `update`. Honesty of the record is load-bearing for the 2030 journey.
7. **Components under ~200 lines; composition over configuration.** A component growing past that is two components being punished together.
8. **No new dependency without a written sentence in this file.** Current total beyond the framework: idb, cmdk, nanoid, zod, zustand, motion. Every addition is a decade of upgrades someone must do.
9. **Accessibility and reduced-motion are spec, not polish.** A feature isn't done until it works with a keyboard and with motion off.
10. **No spinners, ever.** If something is slow enough to need one, the fix is architectural (it should be instant), not decorative.
11. **Calm is testable.** Before merging any surface, ask: does anything on this screen ask, count, or judge when it shouldn't? (`04-design-system.md` banned-vocabulary list applies to code-generated strings too.)
12. **Simplicity over cleverness; boring over novel.** Every clever abstraction is a letter to 2031-you that begins "sorry."
13. **Delete the temporary.** Scaffolding (M2's seed form) is removed the milestone its replacement ships. Atlas carries no dead code into any year.
14. **The maintainer is the user.** When code quality and lived experience conflict, the Week screen wins — but they almost never conflict; both are downstream of simplicity.
