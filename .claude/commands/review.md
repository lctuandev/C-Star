# Review Command

Review the current task before completion.

Check:

## Scope

- Does implementation match the plan?
- Was unrelated code changed?

## Code

- duplicated logic?
- unnecessary abstraction?
- unsafe state handling?
- error handling?
- race conditions?
- invalid state transitions?

## Story & Save

- is every rule in `game-core`, not in a React component?
- can the content validator reach every branch of the changed content?
- does an old save still load (version bump + migration)?
- same seed + same choices = same result?
- does it still work offline?

## Fiction

- anything that could identify a real company or person?
- does the change respect `.project/contracts/content.md`?

## Testing

- happy path?
- edge cases?
- invalid cases?
- regression?
- save / reload / offline behavior?

## Documentation

- progress updated?
- tests updated?
- decisions documented?
- CURRENT.md updated?

## Final Decision

Return:

APPROVED

or

CHANGES REQUIRED

If changes are required, list them explicitly.
