/** Part of the build: content the validator refuses never ships (CLAUDE.md §7). */
import { characters, validateWorld, world } from '../dist/index.js';

const issues = validateWorld(world, { characters });
for (const { scene, node, message } of issues) {
  console.error(`${scene}${node ? `/${node}` : ''}: ${message}`);
}
if (issues.length > 0) {
  console.error(`The story has ${issues.length} problem(s).`);
  process.exit(1);
}
console.log(`Story OK: ${Object.keys(world.story.scenes).length} scenes.`);
