# Bug Fix Test

## Task

{{TASK_ID}} — {{TITLE}}

## Test Objective

Verify that the reported bug is fixed and that the fix does not introduce regressions.

-

---

# Original Bug

## Expected Behavior

-

## Actual Behavior

-

## Reproduction Steps

1.
2.
3.
4.

---

# TEST-001 — Original Bug Regression

## Related Scenario

SCENARIO-001

## Type

Regression

## Given

Describe the state required to reproduce the original bug.

-

## When

Perform the exact action that previously triggered the bug.

-

## Expected

The original bug must no longer occur.

-

## Actual

-

## Status

PASS / FAIL / BLOCKED / NOT TESTED

## Notes

-

---

# TEST-002 — Related Edge Case

## Related Scenario

SCENARIO-002

## Type

Regression

## Given

-

## When

-

## Expected

-

## Actual

-

## Status

PASS / FAIL / BLOCKED / NOT TESTED

## Notes

-

---

# TEST-003 — Repeated Action

## Type

Regression

## Given

The player performs the relevant action.

## When

Repeat the action multiple times.

## Expected

The bug fix must not allow duplicate or invalid side effects.

## Actual

-

## Status

PASS / FAIL / BLOCKED / NOT TESTED

## Notes

-

---

# TEST-004 — Invalid State

## Type

Regression

## Given

The system is in an invalid or unsupported state.

## When

The player attempts the affected action.

## Expected

The game rejects the action safely.

## Actual

-

## Status

PASS / FAIL / BLOCKED / NOT TESTED

## Notes

-

---

# TEST-005 — Save / Reload

## Type

Regression

## Given

A run in the state the fix touches.

## When

Reload the app, or load an older save.

## Expected

The run continues correctly and the bug does not return.

## Actual

-

## Status

PASS / FAIL / BLOCKED / NOT TESTED / NOT APPLICABLE

## Notes

-

---

# Test Coverage

| Test     | Purpose                   | Status     |
| -------- | ------------------------- | ---------- |
| TEST-001 | Original bug regression   | NOT TESTED |
| TEST-002 | Related edge case         | NOT TESTED |
| TEST-003 | Repeated action           | NOT TESTED |
| TEST-004 | Invalid state             | NOT TESTED |
| TEST-005 | Save / reload             | NOT TESTED |

---

# Technical Verification

## Typecheck

PASS / FAIL / NOT RUN

Notes:

-

## Lint

PASS / FAIL / NOT RUN

Notes:

-

## Unit Tests

PASS / FAIL / NOT RUN

Notes:

-

## Integration Tests

PASS / FAIL / NOT RUN

Notes:

-

## E2E Tests

PASS / FAIL / NOT RUN

Notes:

-

## Build

PASS / FAIL / NOT RUN

Notes:

-

## Manual Verification

PASS / FAIL / NOT RUN

Notes:

-

---

# Regression Areas

Check all affected areas:

- [ ] Gameplay
- [ ] Story content
- [ ] Economy
- [ ] Player state
- [ ] NPC
- [ ] Save
- [ ] Offline / PWA
- [ ] Office
- [ ] UI
- [ ] Performance

---

# Final Test Status

PASS / FAIL / BLOCKED / NOT TESTED

## Tested At

YYYY-MM-DD HH:mm
