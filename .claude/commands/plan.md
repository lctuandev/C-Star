# Plan Command

Create a development plan for the requested task.

## Instructions

1. Read `CLAUDE.md`.
2. Read `.project/CURRENT.md`.
3. Inspect relevant existing code.
4. Search for related implementations.
5. Identify whether this is:
   - FEATURE
   - BUG
   - REFACTOR
   - TECHNICAL
6. Generate the next appropriate Task ID.
7. Create the task directory under:
   `.tasks/active/<TASK-ID>/`
8. Create the required documentation files.
9. Update `.project/CURRENT.md`.
10. Do not implement code unless explicitly requested.

The plan must include:

- objective
- scope
- non-goals
- affected systems
- implementation steps
- acceptance criteria
- risks
- dependencies

For bugs also create:

- investigation.md
- fix.md
