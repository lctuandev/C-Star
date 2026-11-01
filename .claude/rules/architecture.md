# Architecture Rules

## General

Understand existing architecture before introducing new architecture.

Prefer existing project patterns.

Avoid creating duplicate abstractions.

---

# Frontend

UI components should not contain important domain rules.

Prefer:

UI
↓
Application / Hook
↓
Domain logic
↓
Content / Save

when consistent with the existing architecture.

---

# Domain

The game has no backend (ADR-001). `packages/game-core` is the domain layer.

Keep responsibilities separated:

Content (data)
↓
Story engine / game rules (`game-core`)
↓
Application hooks / store
↓
UI / rendering

Do not place game rules inside components or the store.

---

# Game State

`GameState` in `game-core` is the single source of truth for a run.

Document whether a value is:

- game state (saved)
- derived (recomputed, never saved)
- UI state (never saved)

---

# State Machines

Use explicit states for systems with meaningful transitions.

Examples:

RUN
CHAPTER
WEEK
SCENE
DIALOGUE
CRISIS
ENDING
DISCLAIMER

Avoid combinations of booleans when they can produce invalid states.

---

# Save Data

Do not change the save format casually.

Before changing it:

1. inspect `.project/contracts/save.md`
2. bump the save version
3. write the migration from the previous version
4. test it against a saved fixture of the previous version
5. test the affected flows
