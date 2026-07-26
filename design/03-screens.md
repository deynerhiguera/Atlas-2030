# Atlas 2030 — Screens, Navigation & Components

## Navigation: four rooms and a wire

Exactly **four top-level destinations** plus the command bar. This is fixed; features must fit into rooms, not add new ones.

```
┌──────────────────────────────────────────────┐
│  Week   ·   Pillars   ·   Atlas   ·   Reflect           ⌘K │
└──────────────────────────────────────────────┘
```

- **Week** — the present (the week in motion, with today focused)
- **Pillars** — the structure (six areas, identity, systems)
- **Atlas** — the past becoming the future (the long view)
- **Reflect** — the thinking (weekly review & vision, season rituals, all writing)
- **⌘K command bar** — the wire: capture, navigate, search, from every screen. Capture never requires navigation.

Sidebar-less on desktop: a quiet top rail (Notion Calendar/Arc energy), full-bleed content. On mobile: four tabs.

---

## Screen 1 — Week

The home room. Answers "what does becoming look like *this week*?" in one glance. Two lanes: curiosity above, discipline below — that ordering is a product decision, not a layout accident.

```
┌──────────────────────────────────────────────────┐
│  FOUNDATIONS · week 4 of 12          Sat, July 5  │
│                                                   │
│  ── This week's question ────────────────────     │
│  "Why does RAM exist?"              exploring     │  ← serif, your words
│                                                   │
│  ── Reading ─────────────────────────────────     │
│  The Soul of a New Machine · p. 142               │
│  "…to understand how machines get built."         │  ← your why, serif
│                                                   │
│  ── Systems ────────────────  M T W T F S S ──    │
│  Deep Learning      2 of 3    ● · ● · · ○ ·       │
│  Engineering Lab    1 of 2    · ● · · · · ·       │
│  English            3 of 5    ● ● · ● · ○ ·       │
│  Gym                3 of 4    ● · ● · ● ○ ·       │
│  Basketball         1 of 1    · · · ● · · ·       │
│                                                   │
│  ── Today ───────────────────────────────────     │
│  Energy  ◔──────    "What mattered today?"        │
│                                                   │
│  · · ·  Day 847 of becoming  · · ·                │
└──────────────────────────────────────────────────┘
```

- The week grid marks **sessions run**, never hours. Today's column is subtly focused; past empty cells are paper-quiet dots, not judgments.
- The Question card is tappable → its notes/write-up. The book card is tappable → its ideas. Both accept ⌘K captures.
- The **Today band** is the entire daily obligation: session taps + energy + optional line. ≤ 60 seconds, always.
- Occasionally the footer is replaced by an **echo**: "One year ago you wrote: …"

## Screen 2 — Pillars

Six cards in a grid. Each card: pillar name, accent hue, `Focus`/`Maintenance` mode chip, a 90-day density texture strip, most recent milestone.

**Pillar detail** (click through):
1. **Identity statement** — full-bleed serif, the hero of the page
2. **Trajectory** — density texture across the pillar's life, milestones as marks
3. **Current systems** (rhythm + 30/90-day density)
4. **Its curiosity** — questions asked under this pillar, books read into it
5. **Milestone log** — the pillar's proof, newest first, finite list

## Screen 3 — Atlas (the signature screen)

The reason the app is named what it's named. A zoomable time view, three altitudes, and — new — a **curiosity layer** that can be brought forward at any altitude:

- **Decade** — 2024 → 2030 as horizontal bands; seasons as named segments; milestones as points colored by pillar. Sparse today, filling over years. *Designed to look better every year you live.*
- **Year** — 12 months of daily texture (calm GitHub-graph DNA: paper background, pillar-hued dots, no judgment), season boundaries, milestone markers, the energy line as faint topography underneath.
- **Season** — the current chapter close-up: intentions, system arcs, questions and books in flight, milestones so far, week counter.

**The curiosity layer** (toggle or scroll-reveal, both altitudes):
- **The Question Trail** — one dot per week, pillar-hued, brighter when answered; hover shows the question, click opens the write-up. Five years in, this is ~250 opened doors — a map of an engineer's mind forming. This render and the season closing view are the two moments the app must be at its most beautiful.
- **The Shelf** — each year's books as slim pillar-hued spines on a shelf; a spine opens to its *why*, its ideas, its dates. The shelf grows left to right, year over year, like a life's library assembling itself.

Interactions: scroll = time, pinch/⌘± = altitude, click anything = its story. The sealed 2030 letter sits at the right edge of the decade view — visible, locked, waiting.

## Screen 4 — Reflect

A writing room. Left: a finite, book-like list of entries (weeks and seasons, grouped by season). Right: the editor — serif, generous measure, zero toolbars. The weekly ceremony renders as its two movements (Review, then Vision); season reviews appear as richer, sealed-then-opened documents. Question write-ups live with their questions but are searchable from here.

---

## Component inventory (the complete set — 17 components)

**Identity & narrative**
1. `IdentityStatement` — full-bleed serif rendering, subtle version-history affordance
2. `SealedNote` — locked note with open-date (the 2030 letter, season notes)
3. `Echo` — a resurfaced past entry, quoted, dated, with "view in context"

**Curiosity**
4. `QuestionCard` — the week's inquiry: serif question, state chip, notes affordance
5. `BookCard` — title, loose progress, the serif *why*; expands to idea captures
6. `QuestionTrail` — years of weekly question dots (Atlas layer)
7. `Shelf` — pillar-hued book spines by year (Atlas layer)

**Time & evidence**
8. `DensityTexture` — the dot/cell texture for system consistency (weekly grid, 30/90-day, and multi-year variants). Empty cells are paper, not red. The core visual primitive.
9. `TimelineBand` — a pillar or year as a horizontal band with marks (Atlas view)
10. `MilestoneMark` / `MilestoneCard` — point-on-timeline and expanded story forms
11. `SeasonSegment` — a named span with intention count and grade marks
12. `EnergyLine` — faint area line of daily energy, used as underlay

**Input (all optimized for ≤ 3 seconds each)**
13. `SystemRow` — the week-grid row: rhythm target, session dots, one-tap mark with optional session note
14. `EnergyDial` — 5-stop horizontal dial
15. `OneLiner` — single-line capture with rotating prompt placeholder
16. `CommandBar` — ⌘K capture/navigate/search (Raycast DNA); parses "idea: …", "milestone: …", "q: …" style input

**Structure**
17. `PillarCard` + `RitualFlow` — grid card with mode chip and texture strip; full-screen stepper shell shared by onboarding, weekly review & vision, and season ritual (one shell, three ceremonies)

Anything not buildable from these seventeen should trigger the question: does the feature belong in Atlas at all?
