# Testing Rules

## General

Tests must verify behavior, not implementation details.

Prefer testing:

input → behavior → result

instead of:

function → internal implementation

---

# Feature Testing

Every feature should contain:

## Happy Path

Normal expected behavior.

## Edge Cases

Boundary conditions.

## Invalid Cases

Invalid actions or input.

## Failure Cases

Storage, offline and system failures.

## Repeated Actions

Double click, retry, duplicate event, etc.

## Save / Reload

When applicable:

- reload in the middle of the flow
- continue from an autosave
- offline
- storage unavailable or full

---

# Bug Testing

Every bug fix must have:

1. Original reproduction
2. Regression test
3. Verification after fix

The regression test should fail before the fix
whenever practical.

---

# Save & Offline Testing

For saves and the PWA test:

- first save, autosave, continue
- save from a previous version (migration)
- corrupted or unreadable save
- storage unavailable or full
- first load offline-ready, then a full run offline
- a new version arriving while a run is in progress

---

# Story Testing

For content test:

- every node reachable, no dead end (content validator)
- every condition and effect refers to something that exists
- a scripted playthrough for each ending
- same seed + same choices = same result

---

# Gameplay Testing

For gameplay systems test:

- valid state transitions
- invalid state transitions
- repeated actions
- cancellation
- interruption
- reload mid-flow
- persistence
- money and stat changes, including their limits

---

# Test Evidence

Record test results in:

`.tasks/<status>/<TASK-ID>/test.md`

Use:

PASS
FAIL
BLOCKED
NOT TESTED

Never mark NOT TESTED as PASS.
