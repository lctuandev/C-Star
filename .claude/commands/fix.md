# Fix Command

Fix the current bug.

## Before Coding

Read:

- `CLAUDE.md`
- `.project/CURRENT.md`
- bug `investigation.md`
- bug `fix.md`
- bug `test.md`

## Investigation

First establish:

- symptom
- reproduction steps
- expected behavior
- actual behavior
- affected systems
- likely root cause

Do not immediately patch symptoms.

## Fix

Prefer the smallest correct fix.

Avoid unrelated refactoring.

Document:

- root cause
- solution
- files changed
- possible regression risks

## Regression

Create or update the regression test.

Verify:

1. Original reproduction
2. Regression test
3. Related functionality

Only mark the bug resolved after verification.
