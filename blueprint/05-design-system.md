# 05 — Design System: "Quiet Observatory" (implementation grade)

Extends `design/04-design-system.md` (the taste document) into buildable specification. Where they differ, this document wins for implementation; the taste document wins for intent.

## Typography

Two families, both self-hosted and subsetted (`public/fonts`, woff2):

- **Serif — the Voice of Identity** (*Newsreader* variable, opsz axis on): exclusively for words the user wrote — identity statements, season names, questions, book *whys*, ideas/notes, reflections, echoes, the letter. Serif appearing around text the user didn't write is a design-system bug.
- **Sans — the Voice of the Instrument** (*Inter* variable): all UI. Uppercase labels get `tracking-wide` + `text-label`. Tabular numerals (`font-variant-numeric: tabular-nums`) for every date, count, and the week grid.

| Token | px | LH | Family | Use |
|---|---|---|---|---|
| `text-label` | 11 | 1.2 | sans, caps | rail labels, chips, week header eyebrow |
| `text-ui` | 13 | 1.4 | sans | controls, metadata |
| `text-body` | 15 | 1.6 | sans | default UI prose |
| `text-read` | 17 | 1.7 | serif | notes, ideas, reflections reading |
| `text-quote` | 22 | 1.5 | serif | QuestionCard, book why, echoes |
| `text-title` | 28 | 1.3 | serif | season names, sheet heroes |
| `text-display` | 40 | 1.2 | serif | identity statements (rooms) |
| `text-monument` | 56 | 1.15 | serif | ceremony heroes, the letter, North Star question |

Reading measure ≤ 680 px (`max-w-prose-atlas`). UI text never exceeds 17 px.

## Color

Tokens exactly as specified in `design/04-design-system.md` (base neutrals + six pillar hues, light "Paper" / dark "Observatory") — that table is normative. Implementation rules:

- CSS custom properties on `:root[data-theme=…]`; Tailwind exposes only token names (`bg-bg`, `bg-surface`, `text-ink`, `text-ink-muted`, `border-line`, `accent-{pillar}`). Raw hex in feature code fails review.
- Pillar hues ship as **4-step opacity ramps** (`accent-engineering/25|50|75|100`) — the only legal way to encode density. Empty cells use `line`, near-invisible by design.
- **No alarm colors exist.** There is no `red`, `warning`, `error` token. The rescue screen uses `ink` at full weight — seriousness through typography, not hue.
- Every (fg, bg) pair in both themes ships with a contrast test (≥ 4.5:1 text, ≥ 3:1 UI graphics) in CI.

## Spacing, grid, layout

- Base-8 scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`. No arbitrary values (`p-[13px]` fails lint).
- Desktop gutters ≥ 96 px at 1280; the whitespace is the premium. Rooms: single centered column (`max-w-[900px]`) except Pillars (grid) and Atlas (full-bleed).
- Vertical rhythm: sections separated by `48`; elements within a section by `16/24`.
- Breakpoints: 1280 design target · 1024 correct · 768 functional floor · <768 calm gate screen.

## Elevation

Three levels only: **flat** (rooms — borders `1px line`, no shadow) · **raised** (sheets, popovers — `shadow-raised`, one soft wide shadow) · **ceremonial** (⌘K, ceremonies — `shadow-raised` + backdrop dim `bg/60` + blur 8px). No stacked shadows, no elevation-on-hover.

## Motion

Tokens (normative, from `03`): `instant 120` · `room 250` · `settle 350` · `page 400` · `seal 900 (incl. 250 held beat)` · `echo 1000`; single easing `cubic-bezier(0.25, 1, 0.5, 1)`.

Principles: nothing snaps; nothing bounces; nothing loops (single exception: the letter's slow shimmer, 8 s period, opacity-only); movement distances ≤ 8 px except ceremonial zooms; input surfaces animate at `instant`, retrospective surfaces may use the slow end. **Reduced motion** replaces every variant with `fade150` and converts held beats to plain pauses — parity of meaning, not absence of design.

## Iconography

**Lucide**, stroke 1.5, sizes 16/20 only, `text-ink-muted` default. Used *sparsely* — Atlas is typography-first; if a label can be a word, it is a word. Icons never appear without accessible names. No filled icons, no emoji in UI chrome.

## Accessibility (spec, not aspiration)

- WCAG 2.1 AA. Full keyboard operability per the map in `02`. Focus ring: 2 px `ink` offset 2 px — visible in both themes, styled once in primitives, never suppressed.
- Week grid: `role=grid` semantics, arrow navigation, cells labeled "Deep Learning, Wednesday July 8, session marked."
- Density conveyed by opacity ramp **plus** accessible text; never color alone. EnergyDial is a labeled `slider` (1–5).
- Ceremonies trap focus, restore on exit, announce step changes politely (`aria-live=polite`). `Esc` never destroys typed text (confirm-on-dirty).
- Zoom to 200% without horizontal scroll in rooms.

## Empty states — a designed catalog

Empty states are invitations in the product's voice (serif where it quotes the user's future). Normative copy:

| Surface | Copy |
|---|---|
| Day with nothing marked | *(nothing — silence is the design; the texture simply stays paper)* |
| No ideas in a book yet | "Ideas tend to arrive mid-page. ⌘K when one does." |
| No notes on a question | "Let it sit with you this week." |
| Milestone log (v0.2, none yet) | "No milestones yet this season. They tend to arrive quietly." |
| Reflect, no entries | "Sundays will fill this room." |
| Past week never pulsed | "A quiet week. It counts too." |

Never: illustrations of empty boxes, gray mascots, "Get started!" CTAs.

## Loading philosophy

**There are no loading states.** No spinners, no skeletons, no progress bars, no shimmer placeholders — the token set contains no spinner because the architecture makes waiting impossible (<50 ms startup, in-memory reads). If a future feature would need one, the feature is redesigned until it doesn't (Engineering Principle 10). The single sanctioned "wait" is the ceremonial held beat, which is meaning, not latency.

## Voice in the system

Banned vocabulary (`design/04`) is enforced as a lint rule over UI string literals (`overdue|missed|failed|streak|unlock|level` …) — the copy police is a CI job. House vocabulary and all normative microcopy live in `design/copy.ts` as named constants; features import copy, they don't inline it. (Atlas is single-language by design — it speaks to one person; i18n is complexity with no customer.)
