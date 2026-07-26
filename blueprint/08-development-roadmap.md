# 08 — Complete Development Roadmap

Milestones sized for evenings (E) and weekends (W). Every milestone ends: **deployable** (static build runs), **testable** (its tests green in CI), **production quality** (no TODOs on shipped surfaces), **unbroken** (the app is fully usable at its current scope). `main` is always shippable; work happens in short-lived branches (see `11`).

## Phase v0.1 — "The Week" (features F0–F11)

| M | Name | Size | Delivers | Definition of done |
|---|---|---|---|---|
| M0 | **Paper** | E | F0: scaffold, tokens, fonts, themes, RoomShell, PWA manifest, CSP, empty Week shell with real date + "Day 1 of becoming" | Both themes flawless; Lighthouse a11y ≥ 95; deployed; *it already feels like Atlas* |
| M1 | **Memory** | W | F1+F2: schemas, time math, derive, rules, grammar (all unit-tested); store, actions, autosave, migrations runner, export/import, tab guard; `/data` page | Round-trip test green (doc→export→import→identical); v1 fixture frozen; time-math property tests pass; kill-the-tab loses ≤ 500 ms of input |
| M2 | **The Week** | W | F3+F4+F5: full Week room, session marking, density, TodayBand, past-week nav; temporary seed form (flagged for deletion in M5) | **Begin living in Atlas daily.** Keyboard-complete grid; pulse ≤ 60 s verified; E2E: seed→mark→pulse→reload→persisted |
| M3 | **Curiosity** | W | F6+F7: Question and Book complete (sheets, notes/ideas, close/finish/set-down, auto-mint) | Both lanes live on the Week screen above systems; E2E: ask→note→answer→ask-next; start→idea→finish→milestone exists in export |
| M4 | **The Wire** | W | F8: ⌘K complete (grammar, captures, navigation, settle confirmations) + global keyboard pass + `?` reference | Grammar unit-suite green (every prefix, `#pillar`, system-name matching, ambiguity rules); idea captured start-to-saved < 15 s; keyboard-only week E2E |
| M5 | **The Founding** | W | F9+F10: full ceremony with resume + seal + Week-assembly; `/foundations`; **seed form deleted**; one-time migration of the month's lived data into founded state | Fresh-profile E2E founding run; interrupt-and-resume E2E; re-found personal Atlas properly with real letter |
| M6 | **Complete** | E–W | F11 polish + hardening: reduced-motion parity, a11y audit fixes, service-worker offline, storage.persist, rescue screen, edge states, motion polish to `02` spec | Full E2E suite green; axe clean; offline cold-start works; bundle ≤ 300 KB gz; **tag `v0.1.0`** |

**Gate → v0.2:** the one-month success criteria from `design/06 §2`, evaluated honestly. Fail → redesign, don't advance.

## Phase v0.2 — "The Mirror" (F12–F17) — history becomes visible

| M7 | **Evidence** | W | F12 milestones render + F17 gaps/welcome-back; schemaVersion 2 (+fixture, +migration) | Milestone cards from month-one captures; gap annotation E2E; v1→v2 migration test green |
| M8 | **Echoes** | E | F13 resurfacing engine + placements | Heuristics unit-tested (never same echo twice in 7 days; date-window correctness); first real echo lands |
| M9 | **The Sunday** | W | F14 weekly ceremony (both movements, invitation, skip grace) | Ceremony E2E incl. question-carry and question-close paths; skip-2-weeks soft line verified; reflection stored per I-6 |
| M10 | **Structure** | W | F15 pillars room + F16 reflect room | Six cards + details; reflect lists accumulated Sundays; rooms nav = W/P/R live |
| — | *Gate:* four Sunday ceremonies done in real life; **tag `v0.2.0`** | | | |

## Phase v0.3 — "The Ritual" (F18–F19) — timed to the first real season boundary

| M11 | **Playback** | W | Season playback render (reusing WeekPlayback patterns at season scale); grading + identity-check steps | Playback renders real 12-week data beautifully; grading writes `Season.grades`; schemaVersion 3 |
| M12 | **The Ceremony** | W | Full season ceremony assembled: unseal → … → pull-back; composition seals next season's note; early-close variant | Dress-rehearsal E2E on fixture season; then **perform the real ceremony** — the release criterion is a lived season transition; tag `v0.3.0` |

## Phase v1.0 — "The Atlas" (F20–F21) — only after ≥ 2 closed seasons

| M13 | **The Canvas** | W | Altitudes + bands + time scroll + milestones at season/year level | 60 fps scroll on target hardware; keyboard altitude control |
| M14 | **The Long View** | W | Decade altitude, energy underlay, letter marker | Decade renders honestly sparse; visual-regression baselines for all three altitudes |
| M15 | **Curiosity Made Visible** | W | F21 QuestionTrail + Shelf | Carried questions render as connected runs; set-down spines lean; **tag `v1.0.0`** |

## Beyond (each its own small phase, in life-order not sprint-order)

M16 **Year Chapter** (F22, W) at the first post-v1.0 anniversary · M17+ **sync/mobile per `09`** only if a real second device need emerges · M-final **The Final Opening** (F23): built across 2030 as three W milestones (traverse · letter/answer · Close-the-Book artifact + archive mode), finished before December — the only milestone in this file with a true deadline.

## Standing rules

1. **Never two milestones in flight.** Finish, tag, live with it, then next.
2. **Data-affecting milestones (M1, M7, M11) get double review time** — schema work is the highest-stakes work (see `04`).
3. **Every milestone ships its tests in the same branch** — test debt is scope creep in disguise.
4. **If a weekend milestone doesn't fit a weekend, the milestone is wrong:** cut scope in the milestone table via PR to this file, never cut quality silently.
5. **Living in the product is part of the build.** M2 onward, the maintainer's real data is the primary test environment; exports are backed up weekly (30 seconds, `/data`, into any synced folder).
