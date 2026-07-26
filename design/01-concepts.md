# Atlas 2030 — Core Concepts & Information Architecture

The entire app is **ten concepts**. Two of them — Question and Book — earned their way in because curiosity is half the product's soul (see `00-vision.md`, "Two engines"). The door closes at ten.

## The object model

```
Identity (per pillar: who I am in 2030)
   └── Pillar (×6: Engineering, University, English, Health, Spirit & Mind, Relationships)
         └── Season (a ~12-week chapter with a theme and 1–3 intentions)
               ├── System    (recurring engine of growth — the discipline lane)
               └── Milestone (proof of growth — dated, permanent)

Question    (the weekly inquiry — the curiosity lane)
Book        (what's moving through you: why, where, what it changed)
Signal      (daily pulse: energy, one line — cross-pillar)
Reflection  (weekly review & vision, season ritual — cross-pillar)
Atlas       (the derived long view — not stored, computed from everything above)
```

Two lanes feed everything: **Systems** (discipline — showing up on rhythm) and **Questions + Books** (curiosity — what's moving through your mind). Milestones are minted from both. A week in Atlas is the two lanes side by side.

### 1. Identity — the "why" layer

For each pillar, a short written statement in first person, present tense, dated 2030:

> *"I am an engineer who builds systems people rely on, and I understand them down to the metal."*

- Written once, revised rarely (revisions are versioned — watching your identity statements evolve over six years is itself a feature).
- Rendered beautifully (large serif type, generous space) — this is the "opening my future" moment.
- Everything else in the app hangs off these six statements.

### 2. Pillar — the six areas

Pillars are **containers with character**, not folders. Each has:

- An identity statement (above)
- A muted accent hue (see design system)
- A current **mode**: `Focus` or `Maintenance` (see Seasons)
- Its systems, questions, books, milestones, and trajectory

Pillars never get "completed" and never show a percentage. They show *texture over time*.

### 3. Season — the unit of intention (~12 weeks)

You do not plan 2030. You do not plan the year. You plan a **season**:

- A **name/theme** you write ("Foundations," "The English Wall," "Ship Season")
- **1–3 intentions** — outcomes or directions, not task lists
- **Focus pillars:** at most **2–3 pillars in Focus mode** per season.
- A **season note to self**, written at the start, sealed until the season review.

**Focus vs. Maintenance, clarified.** Focus is where you are trying to *change the curve* this season. Maintenance is not dormancy — it is systems humming at their established rhythm (Gym and Basketball keep running whether Health is in focus or not). A real week can carry seven systems across five pillars and still honor the focus discipline, because focus governs *intentions*, not *rhythm*. What the discipline forbids is trying to bend six curves at once.

### 4. System — the discipline lane

A **long-term recurring engine of growth**, attached to a pillar. The current real-life set:

| System | Pillar |
|---|---|
| Deep Learning | Engineering |
| Engineering Lab | Engineering |
| University | University |
| English | English |
| Reading | (home pillar chosen once — the *books* carry their own pillars, see §6) |
| Gym | Health |
| Basketball | Health |

- Defined with an **intended weekly rhythm** ("3 sessions/week"), not a schedule with times. The week, not the day, is a system's native unit.
- A session is **marked, never measured**: one tap says "this system ran today," with an optional one-line session note ("built the ALU," "leg day," "read ch. 4"). Atlas never counts minutes — see the "No time accounting" anti-goal.
- Tracked as **density**: sessions against intended rhythm over rolling 7/30/90-day windows, rendered as the dot texture. Missed sessions are quiet, not red.
- A system can be **paused for a season** or **retired with honor** — both are timeline events, not failures.
- Adding a system should feel like a commitment ceremony, not a form. The app actively resists a casual tenth.

*Deliberately absent from this table:* **Weekly Review and Weekly Vision are not systems.** They are the app's own heartbeat — the Reflection rhythm (§8). Atlas already knows when you've done them; modeling them as tracked systems would mean the app tracking your usage of the app, which is the productivity-dashboard failure mode in miniature.

### 5. Question — the curiosity lane, part one

The **Engineering Question** is a first-class object: one deep inquiry held at a time, set during Weekly Vision.

> *"Why does RAM exist?" · "How do computers execute instructions?" · "How do operating systems work?"*

- Fields: the question, its pillar (defaults to Engineering; any pillar may ask), the week it was asked, its state, and **the answer in your own words** — a short write-up, however rough.
- States: `open → exploring → answered`. A deep question **carries forward across weeks without penalty** — real questions don't respect calendars, and carrying one is a sign of depth, not delay.
- Big answers can be **promoted to milestones** ("Understood instruction execution down to the fetch–decode–execute cycle").
- Over years, the questions form the **Question Trail** in Atlas: ~50 dots a year, each one a door you opened — a literal map of an engineer's mind forming. This is one of the two renders that must be beautiful (the other is the season closing view).

### 6. Book — the curiosity lane, part two

A book is not a task to finish; it is **something moving through you**. Atlas knows four things about every book:

1. **What** — title, author, and its pillar (a CS book is Engineering evidence; a spiritual book is Spirit & Mind evidence — the *book* carries the pillar, the Reading system just measures the sitting-down)
2. **Why** — one sentence, written when you start, rendered in serif: *"I'm reading this because…"*
3. **Where** — loose progress (page or %), updated whenever, never demanded daily
4. **What it changed** — dated **idea captures**: passages and thoughts that shifted your thinking, captured via ⌘K in seconds

- States: `reading → finished` or `set down` — abandoning a book is recorded without shame (*"Not every book earns finishing"*), because pretending otherwise would corrupt the record.
- Finishing a book **auto-mints a milestone** in the book's pillar.
- Over years, books form the **Shelf** in Atlas: slim pillar-hued spines accumulating year by year, each opening to its why and its ideas.

### 7. Signal — the daily pulse (≤ 60 seconds, by design)

One tiny daily check-in, deliberately capped:

- **Energy** (1–5, a dial not a form)
- **One line** — free text, optional ("what mattered today")
- Today's system session marks (tap, tap, done)

That's the entire daily obligation of the app. Everything richer lives at the weekly rhythm.

### 8. Reflection — the heartbeat (review looks back, vision looks forward)

- **Weekly Review & Vision (~15 min, one sitting, two movements):**
  - *Review* — the week played back (sessions, question, book, energy), then three prompts: *What moved? What drained me? What did I learn?*
  - *Vision* — compose next week: carry or set the Question, glance the systems (pause/adjust if life requires), one optional intention line for the week.
  - Skippable without penalty; two skipped weeks earn one soft line on the Week screen, and that is the maximum nagging the app will ever do.
- **Season review (≈45 min, 4×/year):** the sealed season note is opened; intentions graded honestly (`became / moved / didn't move` — never "failed"); identity statements checked; the next season composed. The ritual is the rudder of the product — but the **week is its engine**.

### 9–10. Atlas — the long view (derived)

Not a data type — renderings across all data: the year in texture, milestones on a timeline, the Question Trail, the Shelf, energy vs. seasons, identity statements over versions. Detailed in `03-screens.md`.

## Relationships at a glance

- Systems and milestones belong to **one pillar**; questions and books carry their own pillar (curiosity roams).
- Signals and reflections are **cross-pillar** — energy is a property of you, not of a category.
- Seasons don't own pillars; they *spotlight* them. Systems keep humming regardless of spotlight.
- The **week** is the atomic unit of life in Atlas: systems have weekly rhythms, questions are weekly, review & vision are weekly. Days are for pulse; seasons are for intention; the week is where becoming actually happens.

## Data longevity (a product decision, not an engineering one)

This app must outlive frameworks, laptops, and possibly its own UI. Therefore:

- **Local-first, plain, portable.** Canonical data must be human-readable (SQLite + markdown export, or markdown/JSON files outright). You must be able to read your 2026 question write-ups in 2036 with no app at all.
- **Append-mostly.** Milestones, signals, idea captures, and reflections are never edited destructively. The record is the point.
- The UI may be rewritten five times before 2030. The data format gets designed once, carefully, and versioned.
