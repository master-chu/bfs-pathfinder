import { SearchQueueItem, Vector2 } from './types';

export default function findShortestPath(grid: number[][], start: Vector2, end: Vector2) {
  if (!isWalkable(end, grid)) {
    console.error(`Destination (${end.x}, ${end.y}) is not a walkable tile`);
  }

  const queue: SearchQueueItem[] = [{ tile: start, history: [] }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { tile, history } = dequeue(queue);
    visit(tile, visited);
    history.push(tile);

    if (vectorEquals(tile, end)) {
      return history;
    }

    const neighbors = getNeighbors(tile, start, end)
      .filter((neighbor) => isWalkable(neighbor, grid))
      .filter((neighbor) => !hasBeenVisited(neighbor, visited));

    neighbors.forEach((neighbor) => {
      enqueue({ tile: neighbor, history: [...history] }, queue);
    });
  }
  return [];
}

export function enqueue(value: SearchQueueItem, queue: SearchQueueItem[]): void {
  queue.push(value);
}

export function dequeue<SearchQueueItem>(queue: SearchQueueItem[]): SearchQueueItem {
  const result = queue.shift();
  if (typeof result !== "undefined") {
    return result;
  }
  throw new Error("Tried to dequeue from an empty queue");
}

export function toKey({ x, y }: Vector2) {
  return `${x},${y}`;
}

export function hasBeenVisited(tile: Vector2, visited: Set<string>) {
  return visited.has(toKey(tile));
}
export function visit(tile: Vector2, visited: Set<string>) {
  return visited.add(toKey(tile));
}

export function isWalkable(tile: Vector2, grid: number[][]) {
  return valueAt(tile, grid) === 0;
}

export function valueAt({ x, y }: Vector2, grid: number[][]): number {
  return Array.isArray(grid[y]) ? grid[y][x] : -1;
}

export function getNeighbors({ x, y }: Vector2, start: Vector2, end: Vector2) {
  const up = { x, y: y - 1 };
  const down = { x, y: y + 1 };
  const left = { x: x - 1, y };
  const right = { x: x + 1, y };

  // Weight initial search direction by relative position to end tile
  const dx = start.x - end.x;
  const dy = start.y - end.y;
  const isWiderThanTall = Math.abs(dx) > Math.abs(dy);

  if (isWiderThanTall) {
    if (dx > 0) {
      return [left, down, up, right];
    } else {
      return [right, up, down, left];
    }
  } else {
    if (dy > 0) {
      return [up, left, right, down];
    } else {
      return [down, right, left, up];
    }
  }
}

export function vectorEquals(a: Vector2, b: Vector2) {
  return a.x === b.x && a.y === b.y;
}