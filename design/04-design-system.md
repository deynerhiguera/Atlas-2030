# Atlas 2030 — Design System ("Quiet Observatory")

The aesthetic target: **a well-typeset book crossed with an observatory.** Paper and ink by day; deep, starlit calm by night. Linear's precision, Apple Health's warmth, nothing shouting.

## Typography — the interface *is* typography

Two voices:

- **The Voice of Identity** — a warm serif (e.g. *Newsreader*, *Source Serif 4*, or *Tiempos*). Used **only** for words you wrote: identity statements, season names, reflections, echoes, the letter, the week's Question, a book's *why*, and captured ideas. When you see serif, you are reading yourself.
- **The Voice of the Instrument** — a precise sans (e.g. *Inter* or *Geist*) for UI: labels, dates, chips, navigation. Small sizes, generous tracking on uppercase labels (`SEASON · WEEK 4 OF 12`).

Scale (desktop): 13 / 15 / 17 / 22 / 28 / 40 / 56. Identity statements render at 40–56. UI never exceeds 17. Line-height 1.6 for reading, 1.2 for display. Tabular numerals for all dates and counts.

## Color

### Base — near-monochrome, warm

| Token | Light ("Paper") | Dark ("Observatory") |
|---|---|---|
| `bg` | `#FAF9F7` warm paper | `#0E1116` deep blue-black |
| `surface` | `#FFFFFF` | `#151A21` |
| `ink` | `#1A1A18` | `#E8E6E1` |
| `ink-muted` | `#6F6D66` | `#8A8F98` |
| `line` | `#E7E5E0` | `#232933` |

No pure black, no pure white, anywhere.

### Pillar hues — muted, desaturated, equal-weight

Six hues, all at similar low saturation so no pillar visually "wins":

| Pillar | Hue | ~Light | ~Dark |
|---|---|---|---|
| Engineering | slate blue | `#5B7A9D` | `#7A97B8` |
| University | ochre | `#A98D4B` | `#C2A968` |
| English | sage | `#6E8F6E` | `#8CAB8C` |
| Health | clay | `#B0725E` | `#C68D7B` |
| Spirit & Mind | dusk violet | `#8A7AA0` | `#A394BD` |
| Relationships | rose | `#B07A8C` | `#C795A7` |

Rules: pillar hues appear only as **accents** (dots, marks, 2px strips, chips) — never as backgrounds or large fills. **There is no red and no alarm color in the system at all.** Density textures use pillar hue at 4 opacity steps; an empty day is `line`-colored, i.e., nearly invisible — absence is quiet.

## Space, shape, depth

- 8px grid; page gutters are extravagant (96px+ on desktop). The whitespace *is* the premium feel.
- Content column max ~680px for reading, full-bleed only for Atlas visualizations.
- Radius: 8px controls, 12px cards, 999px chips. Borders (1px `line`) over shadows; at most one shadow level for raised moments (command bar, ritual overlays).

## Motion — "slow instrument"

- Durations 250–500ms, always eased (`cubic-bezier(0.25, 1, 0.5, 1)`); nothing snaps.
- Practice check: the dot **settles** (soft scale-down + hue fill), no bounce, no confetti.
- Atlas altitude changes: cross-fade + gentle z-zoom, like refocusing a lens.
- Ritual steps: slow crossfade, ~400ms — page-turning, not sliding.
- Echoes fade in over ~1s, like a memory arriving.
- The sealed letter, on the decade view, has a barely-perceptible slow shimmer — alive, waiting. The only "idle animation" in the app.

## Voice & microcopy

- Always second person, calm, specific, brief. The app is a quiet senior mentor, not a coach and not a cheerleader.
- Banned vocabulary: *overdue, missed, failed, streak, crush, unlock, level up, don't break, you haven't…*
- House vocabulary: *became, moved, didn't move, texture, density, season, system, session, question, carried, shelf, echo, evidence, welcome back, set down* (for books not finished).
- Empty states are invitations written in the product's voice: *"No milestones yet this season. They tend to arrive quietly."*

## Accessibility & platform

- All texture/density information must be readable without color (opacity steps + tooltips carry the data).
- Full keyboard operability; ⌘K is the universal entry; `W / P / A / R` jump between the four rooms.
- Light/dark follow system; both themes are first-class (this app will be opened at 6am and at midnight).
