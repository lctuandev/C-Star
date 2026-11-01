import type { Vec3 } from './office-layout';
import plan from './office-plan.json';

type Solid = readonly [number, number, number, number];

const CELL = 0.2;
/** Half a person: keeps shoulders off the furniture. */
const BODY = 0.2;
const X0 = -6;
const Z0 = -5;
const COLUMNS = 60;
const ROWS = 50;
const NEIGHBOURS = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, Math.SQRT2],
  [1, -1, Math.SQRT2],
  [-1, 1, Math.SQRT2],
  [-1, -1, Math.SQRT2],
] as const;

const cellOf = (x: number, z: number) => [Math.floor((x - X0) / CELL), Math.floor((z - Z0) / CELL)];
const centreOf = (column: number, row: number) =>
  [X0 + (column + 0.5) * CELL, Z0 + (row + 0.5) * CELL] as const;
const inGrid = (column: number, row: number) =>
  column >= 0 && row >= 0 && column < COLUMNS && row < ROWS;
const indexOf = (column: number, row: number) => row * COLUMNS + column;

/** Every cell a person could not stand in. Shared by every search: the office does not move. */
export const walkableGrid = (solids: readonly Solid[]): Uint8Array => {
  const grid = new Uint8Array(COLUMNS * ROWS).fill(1);
  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const [x, z] = centreOf(column, row);
      const blocked = solids.some(
        ([x0, z0, x1, z1]) => x > x0 - BODY && x < x1 + BODY && z > z0 - BODY && z < z1 + BODY,
      );
      if (blocked) {
        grid[indexOf(column, row)] = 0;
      }
    }
  }
  return grid;
};

const GRID = walkableGrid(plan.solids as unknown as Solid[]);

/** Someone sitting in a cubicle starts in a blocked cell: the nearest open one is the way out. */
const nearestOpen = (column: number, row: number): number | null => {
  for (let radius = 0; radius < 12; radius += 1) {
    for (let dz = -radius; dz <= radius; dz += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        const c = column + dx;
        const r = row + dz;
        if (inGrid(c, r) && GRID[indexOf(c, r)] === 1) {
          return indexOf(c, r);
        }
      }
    }
  }
  return null;
};

const isInOffice = (point: Vec3) =>
  point[0] > X0 && point[0] < -X0 && point[2] > Z0 && point[2] < -Z0;

/** Straight lines wherever the floor allows: a grid's zigzag looks like a robot. */
const canSee = (a: readonly [number, number], b: readonly [number, number]) => {
  const steps = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / (CELL / 2));
  for (let step = 0; step <= steps; step += 1) {
    const t = steps === 0 ? 0 : step / steps;
    const [column, row] = cellOf(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t);
    if (GRID[indexOf(column as number, row as number)] !== 1) {
      return false;
    }
  }
  return true;
};

const smooth = (points: readonly (readonly [number, number])[]) => {
  const kept: (readonly [number, number])[] = [];
  let from = 0;
  while (from < points.length - 1) {
    let next = points.length - 1;
    while (next > from + 1 && !canSee(points[from] as never, points[next] as never)) {
      next -= 1;
    }
    kept.push(points[next] as never);
    from = next;
  }
  return kept;
};

const search = (start: number, goal: number): number[] | null => {
  const cost = new Float32Array(GRID.length).fill(Infinity);
  const cameFrom = new Int32Array(GRID.length).fill(-1);
  const open = new Set([start]);
  const guess = (index: number) =>
    Math.hypot(
      (index % COLUMNS) - (goal % COLUMNS),
      Math.floor(index / COLUMNS) - Math.floor(goal / COLUMNS),
    );
  const score = new Map([[start, guess(start)]]);
  cost[start] = 0;

  while (open.size > 0) {
    let current = -1;
    let best = Infinity;
    for (const index of open) {
      const value = score.get(index) ?? Infinity;
      if (value < best) {
        best = value;
        current = index;
      }
    }
    if (current === goal) {
      const path = [goal];
      while (cameFrom[path[0] as number] !== -1) {
        path.unshift(cameFrom[path[0] as number] as number);
      }
      return path;
    }
    open.delete(current);
    const column = current % COLUMNS;
    const row = Math.floor(current / COLUMNS);
    for (const [dx, dz, length] of NEIGHBOURS) {
      const c = column + dx;
      const r = row + dz;
      // Never across a corner: the two cells beside a diagonal step must both be free.
      const open2 =
        inGrid(c, r) &&
        GRID[indexOf(c, r)] === 1 &&
        GRID[indexOf(c, row)] === 1 &&
        GRID[indexOf(column, r)] === 1;
      if (open2) {
        const next = indexOf(c, r);
        const tried = (cost[current] as number) + length;
        if (tried < (cost[next] as number)) {
          cost[next] = tried;
          cameFrom[next] = current;
          score.set(next, tried + guess(next));
          open.add(next);
        }
      }
    }
  }
  return null;
};

/**
 * The way from one point to another, ending exactly at `to`. Home is another place, reached by a
 * cut, and so is anywhere no path leads to: the player must never be left waiting for an action.
 */
export const findPath = (from: Vec3, to: Vec3): readonly Vec3[] => {
  if (!isInOffice(from) || !isInOffice(to)) {
    return [to];
  }
  const [fromColumn, fromRow] = cellOf(from[0], from[2]) as [number, number];
  const [toColumn, toRow] = cellOf(to[0], to[2]) as [number, number];
  const start = nearestOpen(fromColumn, fromRow);
  const goal = nearestOpen(toColumn, toRow);
  const cells = start !== null && goal !== null ? search(start, goal) : null;
  if (!cells) {
    return [to];
  }
  const points = cells.map((index) => centreOf(index % COLUMNS, Math.floor(index / COLUMNS)));
  const path = smooth(points).map(([x, z]): Vec3 => [x, 0, z]);
  return [...(points.length === 1 ? [] : path), to];
};
