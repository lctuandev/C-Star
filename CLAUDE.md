# Project Development Rules

## Project

This is a single-player, story-driven web game: **Công ty C\*** (working title), a dark comedy
about employees whose company owes them more than six months of salary.

Primary stack (ADR-001):

- Frontend: Next.js
- Domain: `packages/game-core` (pure TypeScript)
- Content: `packages/content` (story as data)
- Language: TypeScript
- Backend: none. The game runs entirely in the browser.
- Saves: on the device
- Testing: Vitest + Playwright
- PWA: installable and fully playable offline (ADR-002)

---

## Product Direction (confirmed by project owner)

- Web game, delivered as a PWA.
- Before entering the game the player sees a note: the content is not real and targets no one
  (ADR-003, `.project/contracts/content.md`). This must never be skipped or removed.
- Everything in the game is fiction. No real company, person, logo or figure.
- Mobile-first, **portrait (vertical) orientation** is the primary target. Laptop and PC are supported.
- UX quality bar: design as the player, optimize for ease of use and delight, and build something to be proud of. No admin-dashboard UI.
- Player money can never be negative.
- Details: `docs/Cong_Ty_C_GDD_v0.1.md`, `.project/ux-direction.md`, `.project/roadmap.md`.
- Project documents (`.project/`, `docs/`, task documents) are written in Vietnamese. Workflow files stay in English.

---

# 1. Core Development Philosophy

All meaningful development work follows:

PLAN
IMPLEMENT
VERIFY
FIX
REGRESSION
COMPLETE

Do not skip verification.

Do not consider a task complete merely because the code compiles.

A task is complete only when its acceptance criteria are satisfied and relevant verification has passed.

---

# 2. Before Making Changes

Before implementing a feature, bug fix, refactor, or architectural change:

1. Read `.project/CURRENT.md`.
2. Identify the current active task.
3. Read the relevant task documentation.
4. Inspect the existing implementation.
5. Search for related implementations.
6. Check `.project/architecture/` when relevant.
7. Check `.project/contracts/` when relevant.
8. Check `.project/decisions/` when relevant.
9. Reuse existing project patterns whenever possible.

Do not blindly rewrite existing functionality.

Do not introduce a new architecture pattern without understanding the existing architecture.

---

# 3. Task Tracking

Every meaningful feature, bug fix, refactor, or technical change must have a Task ID.

Task ID formats:

- Feature: `FEAT-XXX-name`
- Bug: `BUG-XXX-name`
- Refactor: `REFACTOR-XXX-name`
- Technical: `TECH-XXX-name`

Examples:

- `FEAT-003-story-engine`
- `BUG-014-save-lost-on-reload`
- `REFACTOR-008-game-state`
- `TECH-002-3d-office-spike`

Tasks are stored under:

`.tasks/active/<TASK-ID>/`

---

# 4. Planning Requirement

Non-trivial work must have a plan before implementation.

Feature tasks require:

- `plan.md`
- `progress.md`
- `scenarios.md`
- `test.md`

Bug tasks require:

- `investigation.md`
- `fix.md`
- `scenarios.md`
- `test.md`

The plan must define:

- objective
- scope
- non-goals
- affected systems
- implementation steps
- acceptance criteria
- risks
- dependencies

Do not begin complex implementation without understanding the plan.

Small obvious fixes may be implemented directly, but they must still be documented in task progress.

---

# 5. Implementation

Implement one logical step at a time.

After every meaningful milestone:

1. Update `progress.md`.
2. Record important decisions.
3. Record problems.
4. Record the next step.

If implementation differs from the original plan:

1. Document the deviation.
2. Explain why it was necessary.
3. Explain its impact.

Do not silently change scope.

---

# 6. Gameplay Rules

Gameplay logic must be deterministic and testable.

Separate:

- gameplay/domain logic
- application logic
- UI state
- network state
- persistence
- rendering

Important gameplay rules must not exist only inside React components.

Examples:

- story progression
- conditions and effects of choices
- weekly actions
- salary, bills and company debt
- energy and stress
- relationships
- evidence
- crises
- ending selection

These rules should be independently testable.

---

# 7. Content Rules

The story is data in `packages/content`, not code.

Always consider:

- every node reachable, no dead end
- conditions and effects refer to things that exist
- player-facing Vietnamese copy that sounds natural
- the fiction rules in `.project/contracts/content.md`

Content that breaks the validator must not build.

Never write a real company, person, logo or figure into the game.

---

# 8. State Machines

Systems with meaningful lifecycle states should use explicit states.

Examples:

- Run
- Chapter
- Week
- Scene
- Dialogue
- Crisis
- Ending

Avoid combinations of unrelated booleans when they can create impossible states.

Prefer explicit state transitions.

---

# 9. State Authority

`GameState` in `game-core` is the single source of truth for a run.

Examples:

- player money
- company debt
- energy and stress
- relationships
- evidence
- story progress
- ending

The UI may request an action.

`game-core` decides whether that action is valid.

Randomness comes only from the seeded RNG in the run, so a run can be replayed from its seed and choices.

---

# 10. Gameplay Scenarios

Any task that changes gameplay behavior must contain `scenarios.md`.

Gameplay behavior includes:

- player actions
- story branches
- economy
- stats
- NPC behavior
- evidence
- crises
- endings
- saves
- office interactions

A scenario describes the real gameplay flow.

A test describes technical verification.

Do not replace scenarios with tests.

Once a gameplay scenario has been established, treat it as a behavioral contract.

Changing an existing scenario requires:

1. Documenting why.
2. Updating the scenario.
3. Updating affected tests.
4. Checking regression impact.

Do not silently change gameplay behavior.

---

# 11. Testing

Every feature must have explicit test scenarios.

Tests should cover relevant:

1. Happy path.
2. Invalid input.
3. Boundary conditions.
4. Failure conditions.
5. Repeated actions.
6. Reload and old saves.
7. Offline.
8. Regression cases.

Every bug fix must include a regression test for the original problem.

Do not remove or weaken a test simply because the implementation fails it.

Fix the implementation instead.

---

# 12. Save & Offline Testing

Save and PWA features should consider:

- first save and autosave
- continue after a reload
- a save from a previous version
- a corrupted save
- storage unavailable or full
- a full run offline
- a new version arriving during a run

---

# 13. Verification

Before completing a task, run the relevant project checks.

Possible checks include:

- typecheck
- lint
- unit tests
- integration tests
- E2E tests
- build
- manual gameplay scenarios

Use the commands already defined by the project.

Do not invent commands when the repository already provides scripts.

---

# 14. Failure Handling

If verification fails:

1. Record the failure.
2. Identify the likely root cause.
3. Investigate.
4. Apply the smallest appropriate fix.
5. Run the failed test again.
6. Run relevant regression tests.
7. Update documentation.

Never hide failures.

Never claim success when verification was not performed.

---

# 15. Completion Criteria

A task can only be marked `COMPLETED` when:

- implementation is complete
- acceptance criteria are satisfied
- relevant tests pass
- regression tests pass
- gameplay scenarios are verified
- known issues are documented
- `progress.md` is updated
- `test.md` is updated
- `result.md` exists
- `.project/CURRENT.md` is updated

---

# 16. Architecture Decisions

When making a significant architectural decision:

1. Check existing ADRs.
2. Determine whether an existing decision already applies.
3. If a new decision is required, create an ADR under `.project/decisions/`.
4. Record alternatives and consequences.

Do not introduce significant architecture changes without documentation.

---

# 17. Context Preservation

Important project knowledge must not exist only in chat history.

Persist important information into:

- `.project/CURRENT.md`
- `.project/architecture/`
- `.project/contracts/`
- `.project/decisions/`
- task documentation

The repository must remain understandable even after a completely new Claude session starts.

---

# 18. Current State

`.project/CURRENT.md` is the project's current development memory.

Update it when:

- starting a task
- changing task status
- reaching a major milestone
- encountering an important blocker
- completing a task

Keep it concise.

Do not turn `CURRENT.md` into a changelog.

---

# 19. Code Quality

Prefer:

- small modules
- clear responsibilities
- explicit types
- reusable domain logic
- predictable state transitions
- minimal duplication
- explicit error handling

Avoid:

- giant components
- giant services
- duplicated business logic
- hidden side effects
- unnecessary abstractions
- speculative architecture

Do not refactor unrelated code unless required.

---

# 20. Final Response

When completing a task, report:

## Completed

What was implemented.

## Files Changed

Important files that changed.

## Tests

What was tested and the result.

## Scenarios

What gameplay scenarios were verified.

## Known Issues

Anything remaining.

## Next

Only if there is a clear next step.

Do not say "everything works" unless verification actually confirms it.
