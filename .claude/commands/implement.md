# Implement Command

Implement the current active task.

## Before Coding

Read:

- `CLAUDE.md`
- `.project/CURRENT.md`
- task `plan.md`
- task `progress.md`
- task `test.md`
- relevant architecture decisions

## During Implementation

Work through the implementation steps sequentially.

After each meaningful milestone:

Update `progress.md`.

If the implementation differs from the plan:

Document:

- what changed
- why
- impact

Do not silently change scope.

## Verification

After implementation:

1. Run relevant tests.
2. Run typecheck.
3. Run lint.
4. Run relevant E2E/manual tests.
5. Update `test.md`.

Do not mark the task complete automatically unless verification passes.

## Completion

If all acceptance criteria pass:

Create `result.md`.

Update `.project/CURRENT.md`.

Move the task from:

`.tasks/active/`

to:

`.tasks/completed/`
