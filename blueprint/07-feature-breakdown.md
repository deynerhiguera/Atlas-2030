# 07 — Feature Breakdown

Every feature Atlas will ever contain. Complexity: **S** ≤ 1 evening · **M** ≤ 1 weekend · **L** = one weekend of build after a weekend of groundwork (no feature is allowed to be larger; L features must be split in their milestone plan).

## Foundation features (not user-visible, everything depends on them)

| # | Feature | Description | Depends on | Cx | Phase |
|---|---|---|---|---|---|
| F0 | **tokens-and-shell** | Design tokens → CSS vars → Tailwind; fonts; themes; RoomShell; GateScreens; PWA manifest | — | M | v0.1 |
| F1 | **domain-core** | Schemas, enums, invariant rules, time math (local dates, ISO weeks), derive (density, day count, week views), ⌘K grammar parser | — | M | v0.1 |
| F2 | **data-core** | Store + slices, action layer (append-mostly enforcement), idb persistence, autosave, migrations runner, tab guard, export/import | F1 | M | v0.1 |

## Daily-life features

| # | Feature | Description | Depends on | Cx | Phase |
|---|---|---|---|---|---|
| F3 | **week** | The home room: header, grid, footer, past-week nav, welcome-back state | F0 F1 F2 | M | v0.1 |
| F4 | **systems** | SystemRow marking, notes, density chips; (v0.2: pause/retire/rhythm-change inside ceremonies) | F3 | S | v0.1 |
| F5 | **pulse** | TodayBand: EnergyDial + OneLiner, same-day rules | F3 | S | v0.1 |
| F6 | **question** | QuestionCard, sheet, notes, close-with-answer, ask-next, history | F3 | M | v0.1 |
| F7 | **book** | BookCard, sheet, progress, ideas, finish/set-down, next-book, milestone auto-mint | F3 | M | v0.1 |
| F8 | **capture** | ⌘K bar, grammar wiring, inline settle confirmations, navigation fallthrough | F1 F2 F0 | M | v0.1 |
| F9 | **founding** | The ceremony (14 steps), resume, seal, Week-assembly exit; deletes the M2 seed form | F2 F4–F7, RitualFlow | **L** | v0.1 |
| F10 | **foundations-page** | Read-only identity + letter marker | F2 | S | v0.1 |
| F11 | **data-settings** | Export/import UI, theme, reduced-motion, storage status, rescue screen | F2 | S | v0.1 |

## Mirror features (v0.2 — "history becomes visible")

| # | Feature | Description | Depends on | Cx |
|---|---|---|---|---|
| F12 | **milestones-render** | Milestone cards, pillar logs, enrichment editing | F2 | S |
| F13 | **echo** | Resurfacing engine (selection heuristics: anniversaries, same-week-last-season, random-old; computed at open, never scheduled) + Echo placements (week footer, ceremony closes) | F2 | M |
| F14 | **weekly-ceremony** | Review & Vision: WeekPlayback, PromptSequence, question carry/close integration, systems glance, invitation logic, skip-grace rules | RitualFlow F4–F7 F13 | **L** |
| F15 | **pillars** | Grid + detail pages (statement hero, trajectory, curiosity, milestone log) | F12 | M |
| F16 | **reflect-room** | Entry list + viewer for accumulated reflections | F14 | S |
| F17 | **gaps** | Welcome-back detection, one-time annotation offer, timeline marks | F2 | S |

## Ritual features (v0.3)

| F18 | **season-ceremony** | Unseal → playback → grading → identity check → composition → seal → pull-back; early-close variant | RitualFlow F13–F16 | **L** |
| F19 | **season-notes** | Sealing/unsealing season notes (SealedNote reuse), schemaVersion 3 | F18 | S |

## Atlas features (v1.0+)

| F20 | **atlas-canvas** | Three altitudes, scroll/zoom, bands, milestones, energy underlay | F12 F18 data | **L** |
| F21 | **curiosity-layer** | QuestionTrail + Shelf renders | F20 F6 F7 | M |
| F22 | **year-chapter** | Anniversary long-scroll chapter (v1.1) | F20 F13 | M |
| F23 | **final-opening** | Dec-2030 gate, decade traverse, letter unseal, last answer, Close-the-Book artifact + archive mode, Found-2040 | everything | **L** (built during 2030, unhurried) |

## Dependency graph

```
F0 ──┬────────────────────────────────────┐
F1 ──┤► F2 ─► F3 ─► F4,F5,F6,F7 ─► F9     │
     └► F8 ────────────┘        └► F10,F11│
F2 ─► F12 ─► F15      F13 ─► F14 ─► F16   │  F17
F14,F15,F13 ─► F18 ─► F19                 │
F12,F18 ─► F20 ─► F21 ─► F22              └─► F23 (all)
```

## Implementation order & rationale

**F0 → F1 → F2** (trust before surface) → **F3+F4+F5** (start living in it — the clock that matters starts here) → **F6+F7** (curiosity lane; the product stops being a habit tracker) → **F8** (the wire; retrofits capture into everything) → **F9+F10+F11** (the ceremony last in v0.1 — most design-sensitive, benefits from a month inside the design system) → v0.2 order **F12 → F13 → F14 → F15 → F16 → F17** (echo before weekly ceremony because the ceremony's close depends on it) → **F18+F19** when the first real season approaches its end (build the ceremony *for* a real occasion — the deadline is a season of your life, which is the most Atlas-native project management imaginable) → **F20 → F21** only after two closed seasons exist → F22, then F23 in its year.
