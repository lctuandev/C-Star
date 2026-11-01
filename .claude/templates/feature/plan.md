# Feature Plan

## Task

{{TASK_ID}} — {{TITLE}}

## Status

PLANNING

---

# 1. Objective

Describe what this feature should accomplish.

-

---

# 2. Problem

What problem does this feature solve?

-

---

# 3. User Value

Why does this feature matter to the player?

-

---

# 4. Scope

## In Scope

-

## Out Of Scope

-

---

# 5. Requirements

## Functional Requirements

### FR-001

-

### FR-002

-

### FR-003

-

## Gameplay Requirements

### GR-001

-

### GR-002

-

## Technical Requirements

### TR-001

-

### TR-002

-

---

# 6. Gameplay Flow

Describe the intended player experience.

Player
↓
Action
↓
Game
↓
Result

Detailed flow:

1.
2.
3.
4.

---

# 7. Gameplay State

Describe the relevant state transitions.

States:

-

Transitions:

-

Invalid transitions:

-

---

# 8. Actors

List all actors involved.

- Player
- NPC
- System

Additional actors:

-

---

# 9. Frontend

Describe frontend changes.

## UI

-

## State

-

## Components

-

## Client Logic

-

## Mobile / PWA

-

---

# 10. Game Core

Describe changes in `packages/game-core`.

## State

-

## Rules

-

## Validation

-

---

# 11. Content

Does this feature add or change story content?

YES / NO

If yes:

## Scenes / Dialogue

-

## Conditions / Effects

-

## Fiction Check

Does it respect `.project/contracts/content.md`?

-

---

# 12. Save

Does this feature change the save format?

YES / NO

If yes:

## New Save Version

-

## Migration

-

---

# 13. Economy

Does this feature affect the player's money or the company's debt?

YES / NO

If yes:

## Money

-

## Bills

-

## Company Debt

-

---

# 14. Player State

Does this feature affect energy, stress, relationships or evidence?

YES / NO

If yes:

-

---

# 15. NPC

Does this feature affect NPCs?

YES / NO

If yes:

-

---

# 16. Office

Does this feature affect the office scene?

YES / NO

If yes:

## Rooms

-

## Interactions

-

---

# 17. Offline / PWA

Does this feature need new assets or routes offline?

YES / NO

If yes:

## Precached Assets

-

## Update Behavior

-

---

# 18. Scenarios

Create or update this task's `scenarios.md`.

Required scenarios:

## SCENARIO-001

-

## SCENARIO-002

-

## SCENARIO-003

-

---

# 19. Testing Strategy

Create or update this task's `test.md`.

Testing should cover:

- [ ] Happy path
- [ ] Invalid input
- [ ] Boundary conditions
- [ ] Repeated actions
- [ ] Failure conditions
- [ ] Reload mid-flow
- [ ] Old save
- [ ] Offline
- [ ] Regression

---

# 20. Architecture Impact

Does this feature change the architecture?

YES / NO

If yes:

Affected architecture:

-

---

# 21. Contract Impact

Does this feature change an existing contract?

YES / NO

If yes:

Affected contracts:

- [ ] Gameplay
- [ ] Content
- [ ] Save

Details:

-

---

# 22. ADR

Does this feature require an architectural decision record?

YES / NO

If yes:

ADR:

-

---

# 23. Implementation Steps

## Step 1

-

## Step 2

-

## Step 3

-

## Step 4

-

## Step 5

-

---

# 24. Acceptance Criteria

| ID     | Criteria      | Status     |
| ------ | ------------- | ---------- |
| AC-001 | {{Criterion}} | NOT TESTED |
| AC-002 | {{Criterion}} | NOT TESTED |
| AC-003 | {{Criterion}} | NOT TESTED |

---

# 25. Risks

## Technical Risks

-

## Gameplay Risks

-

## Fiction Risks

-

## Performance Risks

-

## Data Risks

-

---

# 26. Dependencies

- Existing features:
- Game core:
- Frontend:
- Content:
- Assets:
- External systems:

---

# 27. Definition Of Done

The feature is complete only when:

- [ ] Implementation completed
- [ ] Acceptance criteria satisfied
- [ ] Gameplay scenarios documented
- [ ] Tests implemented
- [ ] Tests passed
- [ ] Regression checks passed
- [ ] Typecheck passed
- [ ] Lint passed
- [ ] Build passed
- [ ] Architecture updated if necessary
- [ ] Contracts updated if necessary
- [ ] ADR created if necessary
- [ ] `.project/CURRENT.md` updated
- [ ] `result.md` completed

---

# 28. Next Step

-

## Last Updated

YYYY-MM-DD HH:mm
