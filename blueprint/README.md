# Atlas 2030 — Engineering Blueprint

The implementation source of truth. `design/` holds the product requirements (vision, concepts, experience, taste); `blueprint/` holds how it gets built. Blueprint is law until amended by PR (`11 §documentation`).

| Doc | Contents | Read before |
|---|---|---|
| [01 — Project Overview](01-project-overview.md) | goals, philosophy→engineering, constraints, non-goals | everything |
| [02 — Information Architecture](02-information-architecture.md) | every surface, interaction, path, transition, keyboard map | building any screen |
| [03 — Technical Architecture](03-technical-architecture.md) | layers, state, persistence, routing, motion, tokens, deps | M0 |
| [04 — Data Model](04-data-model.md) | every entity/field/enum, invariants, validation, migrations, versioning | M1 and any schema change |
| [05 — Design System](05-design-system.md) | type, color, space, motion, elevation, icons, a11y, empty states, no-loading | M0 and any UI work |
| [06 — Component Inventory](06-component-inventory.md) | all components, props, hierarchy, rules | building any component |
| [07 — Feature Breakdown](07-feature-breakdown.md) | F0–F23: scope, dependencies, complexity, order | planning any work |
| [08 — Development Roadmap](08-development-roadmap.md) | M0–M15+ milestones, gates, standing rules | starting any milestone |
| [09 — Backend Evolution](09-backend-evolution.md) | sync/auth/mobile/AI evolution paths + decision gates | any network temptation |
| [10 — Testing Strategy](10-testing-strategy.md) | test pyramid, migration fixtures, budgets, cadence | M1 |
| [11 — Engineering Standards](11-engineering-standards.md) | naming, review checklists, git, commits, DRs, tooling gates | first commit |
| [12 — Future Vision](12-future-vision.md) | 2026–2035 trajectory, the never-add register, constitutional machinery | annually, and any scope debate |

Current status (July 2026): pre-M0. Next action: `08 §M0 — Paper`.
