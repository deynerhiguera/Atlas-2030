# 02 — Complete Information Architecture

Every surface Atlas will ever have, across all phases (v0.1 → 2030). Phase tags mark when each ships. Nothing outside this document gets built without amending this document.

## Surface taxonomy

Atlas has exactly four kinds of surface:

1. **Rooms** — persistent top-level destinations (Week, Pillars, Atlas, Reflect). Live in the top rail.
2. **Ceremonies** — full-screen, stepped, "dim the world" flows (Founding, Weekly Review & Vision, Season, Year Chapter, Final Opening). Entered deliberately, always resumable, never interruptive.
3. **Sheets & overlays** — contextual detail over a room (Question sheet, Book sheet, Milestone card, ⌘K). Esc always retreats.
4. **Utility screens** — Foundations, Data & Settings, and system states (second tab, small viewport, corrupt-data rescue).

## Navigation map

```
                       ┌──────────── ⌘K (global: capture / navigate / search) ───────────┐
                       │                                                                  │
 ┌───────┐   W  ┌──────┴──┐   P  ┌─────────┐   A  ┌─────────┐   R  ┌─────────┐            │
 │Founding├─────►  WEEK   │◄─────►  PILLARS │◄─────►  ATLAS  │◄─────►  REFLECT │◄──────────┘
 │(once)  │      └──┬──┬──┘      └────┬────┘      └────┬────┘      └────┬────┘
 └───────┘          │  │              │                │                │
   Question sheet ◄─┘  └─► Book sheet │ Pillar detail  │ Milestone card │ Entry viewer
                                      │                │ Season segment─┼─► Season review (read)
 Utility: /foundations · /data        │                │ Question Trail │ Weekly ceremony (v0.2)
 System: second-tab · small-viewport  │                │ Shelf          │ Season ceremony (v0.3)
         corrupt-data rescue          │                │ Letter marker  │
                                      └── (v0.2) ──────┴── (v1.0) ──────┴──── (v0.2/v0.3)
```

**Rules:** rooms are siblings (no hierarchy between them); ceremonies exit only to Week; sheets exit to the room that opened them; ⌘K reaches every destination from everywhere; the back key (Esc) always goes exactly one level out and never loses input.

## Screens

### R1 · Week (v0.1) — the home room, route `/`

| Element | Interactions |
|---|---|
| Season header (`FOUNDATIONS · week 4 of 12` + date) | none — context only |
| QuestionCard (serif question + state chip) | click/Enter → Question sheet; ⌘K `q:` appends note |
| BookCard (title, progress, serif *why*) | click/Enter → Book sheet; ⌘K `idea:` appends idea |
| SystemRows (Mon–Sun grid per system, `n of m` chip) | click/Space cell → toggle session (current week only); long-press / `Shift+Enter` → session note popover; arrows move cell focus |
| Today band (EnergyDial 1–5, OneLiner) | click/arrow-keys dial; type + Enter one-liner; editable today only |
| Footer (`Day N of becoming` ∥ Echo, v0.2 ∥ ceremony invitations) | Echo click → view in context; invitation click → ceremony |

**States:** normal · **past week** (read-only, `[`/`]` or header arrows to navigate; future weeks unreachable) · **welcome back** (≥14 days absent: "Welcome back." line + one-time gap-annotation offer, v0.2) · **unfounded** (redirect → `/founding`).

### R2 · Pillars (v0.2) — route `/pillars`, key `P`

Grid of six PillarCards (name, hue, mode chip, 90-day strip, latest milestone) → **Pillar detail** `/pillars/:id`: IdentityStatement hero (+ version history affordance) · trajectory band · current systems with density · its questions & books · finite milestone log. Interactions: card click/Enter; within detail, milestone click → Milestone card; statement history → inline version list.

### R3 · Atlas (v1.0) — route `/atlas`, key `A`

Three altitudes: **Season** (default) · **Year** · **Decade**. Scroll = time; `⌘+`/`⌘-`/pinch = altitude; `C` toggles curiosity layer (Question Trail + Shelf); click milestone → Milestone card; click season segment → its review (read-only); click question dot → its write-up; click spine → Book sheet (read mode); letter marker at decade right edge → sealed-state popover (never opens before Dec 2030). Energy line renders as underlay at Year altitude.

### R4 · Reflect (v0.2) — route `/reflect`, key `R`

Left: finite entry list grouped by season (weeks + season reviews). Right: read pane / editor. Entry click → viewer; "The week is ready" → Weekly ceremony. No compose button — writing happens only inside ceremonies (this is an IA decision: Reflect is a reading room with scheduled writing, not a journal).

### C1 · Founding ceremony (v0.1) — route `/founding`, once

Steps (one screen each, resumable at step granularity): 1 Threshold ("Begin / Not tonight") → 2 Letter → 3 Seal warning + seal animation → 4–9 Identity ×6 → 10 Systems declaration → 11 Season composition → 12 First Question → 13 Current Book → 14 First pulse → exit: **Week assembles itself** from the entered data (signature transition).

### C2 · Weekly Review & Vision (v0.2) — entered from Week/Reflect invitation

Movement I: week playback (composed page) → prompts ×3, one at a time. Movement II: Question carry/close → systems glance (default: no changes) → optional intention line → closing echo → exit to new week.

### C3 · Season ceremony (v0.3)

Threshold ("about an hour") → unseal past note (held-beat) → season playback film → intention grading (`became/moved/didntMove`, equal typography) → identity check per focus pillar → next-season composition → seal new note → **pull-back**: season slots into the year. Early-close variant: same flow, shortened playback, no stigma copy.

### C4 · Year Chapter (v1.1) — anniversary week, invitation-only

Single long scroll: seasons by name → year texture → Question table-of-contents → year Shelf → milestones → interleaved echoes → identity diffs. Read-only. Withdraws after the week.

### C5 · Final Opening (December 2030) — date-gated

Ordinary Week once more → "The letter is ready." → decade traverse (pausable, not skippable) → letter unseal (long held-beat) → the North Star question, answered in writing (the last write) → Close the Book (generate final typeset artifact + archive mode) ∥ Found Atlas 2040.

### Overlays

- **⌘K CommandBar (v0.1):** opens ≤ 120 ms (input surfaces are *fast*-calm, not slow-calm). Grammar: `idea:` `q:` `milestone:` `#pillar` · system-name match → mark today · fallthrough → navigation/search. Enter commits with inline hue-settle; Esc discards.
- **Question sheet (v0.1):** question serif hero · note trail (dated fragments) · Close-with-answer flow (full-height serif editor) · history of answered questions.
- **Book sheet (v0.1):** why · progress edit · idea trail · Finish ("What did it change?") / Set down (optional why) · then "next book" inscription flow.
- **Milestone card (v0.2):** text, date, pillar, optional note/photo(v2); enrichment editing.
- **Dialogs (Radix):** seal warnings, import confirmation, destructive-free otherwise.

### Utility

- **Foundations `/foundations` (v0.1):** six statements (read) + sealed letter marker + founding date.
- **Data & Settings `/data` (v0.1):** export · import · theme (system/light/dark) · reduced-motion override · storage status · app version + schemaVersion.
- **Second tab:** full-screen calm block, "Atlas is open in another window," with a "Use here instead" takeover action.
- **Small viewport (<768):** full-screen note; ⌘K capture remains available (capture is never blocked).
- **Corrupt-data rescue:** if the stored doc fails validation on load: never render partial data; show rescue screen offering raw download of stored bytes + import of a known-good export. The only screen allowed to look serious.

## Transition specification

| Path | Transition | Duration/curve (tokens) |
|---|---|---|
| Room ↔ room | crossfade, no slide (rooms are siblings, not a stack) | `duration.room` 250 ms, `ease.settle` |
| Room → ceremony | "dim the world": room fades to 40% + scale 0.98 under, ceremony fades over | 400 ms |
| Ceremony step → step | page-turn crossfade (old settles down 8 px, new rises 8 px) | 400 ms |
| Room → sheet | rise + settle from trigger side, backdrop dim | 300 ms |
| ⌘K open/close | opacity + 4 px rise, near-instant | 120 ms |
| Session mark | dot ink-settle (scale 1.15→1.0 + hue fill) | 350 ms |
| Seal / unseal | fold/unfold with **held beat** (250 ms pause before reveal); the only intentional friction | 900 ms total |
| Echo appearance | 1 s fade — "a memory arriving" | 1000 ms |
| Reduced motion | all of the above become ≤ 150 ms opacity fades; held beats become plain pauses | — |

## Keyboard map (global)

`⌘K` command bar · `W/P/A/R` rooms · `[` `]` week navigation · `T` jump to today band · `E` focus energy dial · `Esc` retreat one level · arrows/Enter/Space within any focused list or grid · `?` keyboard reference overlay (v0.2). All bindings inert inside text inputs except `⌘K` and `Esc`.
