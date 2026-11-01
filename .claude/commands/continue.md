# Continue Command

Resume the project's current development work.

## Steps

1. Read `CLAUDE.md`.
2. Read `.project/CURRENT.md`.
3. Identify the active task.
4. Read its:
   - plan.md
   - progress.md
   - test.md
   - investigation.md if present
   - fix.md if present
5. Inspect the relevant code.
6. Determine the last completed step.
7. Determine the next incomplete step.
8. Continue implementation from that point.

Do not restart completed work.

Do not assume previous chat context is available.

If the current state is ambiguous:

Stop and document the ambiguity before making destructive changes.

At the end:

Update `progress.md`.
Update `.project/CURRENT.md`.
