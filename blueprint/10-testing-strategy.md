# 10 — Testing Strategy

Shaped by two facts: **the data layer must be correct for a decade**, and **the maintainer is the daily user** (living in the app is a continuous manual test of experience). Therefore: exhaustive automation at the bottom of the stack, lean automation at the top, and honest reliance on inhabitation for feel.

```
            E2E (Playwright)         ~15 journeys      · slow, few, sacred
        Integration (Vitest+idb)     ~40 tests         · store↔persist↔transfer
    Unit — domain (Vitest)           hundreds          · exhaustive, property-based
  + always-on: a11y · visual · performance · migration fixtures (CI gates)
```

## Unit — `domain/` (the exhaustive tier)

Everything in `domain/` is pure, which is *why* it can be tested to decade-grade confidence:

- **Time math** — property-based (fast-check): ISO week boundaries (incl. week 52/53, year rollover, Jan-1-is-week-52 cases), local-date arithmetic, DST transitions in America/Bogotá and after hypothetical relocation (the "moved timezones mid-decade" suite), `dayOfBecoming` monotonicity.
- **Derive** — density windows (7/30/90) against rhythm, **rhythm-history proration** (DR-7: a March density never changes when the rhythm changes in June — pinned by regression test), week-view assembly, question-run derivation.
- **Rules** — every invariant I-1…I-10 with accept and reject cases; every action precondition (mark future day → refused; second live question → refused; delete last week's session → refused).
- **Grammar** — the full ⌘K table: each prefix, `#pillar` tags, system-name matching (exact, prefix, ambiguous → no-match-fallthrough), empty/whitespace, absurd input. The grammar file and its test file evolve in the same commit, always.
- **Schemas** — round-trip (`parse(serialize(doc)) ≡ doc`), boundary values on every constrained field, rejection quality (path-level error messages asserted, since humans read them on import failure).

## Migration fixtures (the decade contract — its own CI gate)

`fixtures/exports/vN.json` — one frozen real-shaped export per schema version, **never edited after freeze** (enforced by a checksum test). CI runs every fixture through the full chain to current, then: parses clean · zero user-text loss (every user-written string in fixture exists somewhere in output — automated sweep) · invariants hold. A failing migration test blocks everything; this is the one tier where flakiness tolerance is zero and coverage ambition is total.

## Integration — `data/` (Vitest + fake-indexeddb)

Action → store → autosave → reload → identical state (per action type). Debounce/flush semantics (pagehide flush; kill mid-debounce loses only the debounce window). Export→import→re-export byte-stable. Tab-guard handshake. Corrupt-doc → rescue path (never partial render). Fresh-doc → founding-gate routing.

## E2E — Playwright (the journeys, nothing else)

The ~15 sacred journeys, mapped 1:1 to the experience designs: full founding (incl. interrupt/resume, "Not tonight") · daily pulse under 60 s (timed assertion) · session mark + note + past-week readonly · question lifecycle (ask→notes→carry a week→answer→next) · book lifecycle (→finish→auto-milestone) and set-down path · every ⌘K grammar form end-to-end · keyboard-only week (no pointer events issued at all) · export/import round-trip through the real UI · second-tab guard · welcome-back after simulated absence · weekly ceremony both movements (v0.2) · season ceremony dress rehearsal on fixture data (v0.3) · atlas altitudes (v1.0). E2E tests use the real build, a fresh browser profile, and a **time-travel harness** (injectable clock — required anyway for date-gated features like the 2030 opening; built in M1, not bolted on).

## Visual regression (Playwright screenshots)

Baselines for: Week (populated + empty + welcome-back), each founding step, sheets, `/data`, ceremonies' key steps, Atlas altitudes — **each in light + dark + reduced-motion** (motion off makes screenshots stable; a separate smoke checks motion mounts). Baselines update only via explicit `--update` commits with the diff image in the PR. This is the guard that keeps Quiet Observatory quiet — visual drift is regression, not evolution.

## Accessibility

- **Automated:** axe-core against every route and open sheet in CI (zero violations = merge gate); contrast checks for the full token matrix in both themes (unit-level, runs on token changes).
- **Manual, scheduled:** one full keyboard-only day of real use per milestone (logged in the PR); screen-reader pass (VoiceOver) on Week + founding at v0.1, v0.2, v1.0; zoom-200% sweep each phase tag.

## Performance (CI budgets, not vibes)

| Metric | Budget | Where |
|---|---|---|
| Cold open → interactive | < 1 s (mid hardware), < 50 ms startup logic | Lighthouse CI + startup-timing assertion in E2E |
| Interaction latency (mark, dial, ⌘K open) | < 100 ms | E2E timed assertions |
| Initial JS | ≤ 300 KB gz | size-limit in CI |
| Atlas canvas scroll (v1.0) | 60 fps on target hardware | manual trace per Atlas milestone + scripted scroll-jank probe |
| Decade-scale data | all budgets hold at 10-year synthetic doc (~15k sessions, 3.6k signals, 300 questions, 150 books) | `fixtures/decade.json` generator; run per phase tag |

That last row matters most: **Atlas must be tested against 2030-sized data from 2026.** Every list, selector, and render meets its budget on the decade fixture, or it doesn't merge.

## What is deliberately not tested

Pixel-level component internals (visual baselines cover appearance) · implementation details of store wiring (integration covers behavior) · animation aesthetics (inhabitation covers feel; tests only assert reduced-motion parity and mount/unmount correctness) · copy tone (the banned-vocabulary lint covers the floor; taste isn't automatable).

## Cadence

Per commit: lint, typecheck, unit, integration (< 2 min total — speed keeps the habit). Per PR: + E2E, axe, visual, size. Per phase tag: + decade-fixture perf run, manual a11y passes, screen-reader pass. Per schema change: + fixture freeze ritual. Weekly, forever: export real data, diff against last week's export — the cheapest and most honest data-loss detector that will ever exist.
