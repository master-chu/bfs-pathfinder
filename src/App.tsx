/* eslint-disable @typescript-eslint/no-use-before-define*/
import { useState } from "react";
import update from "immutability-helper";
import "./App.css";

const initialGrid = [
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0],
];

export default function App() {
  const [start, setStart] = useState<Vector2>({ x: 0, y: 0 });
  const [end, setEnd] = useState<Vector2>({
    x: initialGrid[0].length - 1,
    y: initialGrid.length - 1,
  });
  const [grid, setGrid] = useState<number[][]>(initialGrid);

  const shortestPath = findShortestPath(grid, start, end);

  return (
    <div className="App">
      <Controls
        start={start}
        end={end}
        onSetStart={setStart}
        onSetEnd={setEnd}
        maxX={grid[0].length - 1}
        maxY={grid.length - 1}
      />
      <SolutionGrid
        rows={grid}
        start={start}
        end={end}
        path={shortestPath}
        onClickTile={({ x, y }: Vector2) => {
          const updatedGrid = update(grid, {
            [y]: {
              [x]: {
                $set: grid[y][x] === 0 ? 1 : 0,
              },
            },
          });
          setGrid(updatedGrid);
        }}
      />
      <Legend />
    </div>
  );
}

function Controls({
  start,
  end,
  onSetStart,
  onSetEnd,
  maxX,
  maxY,
}: {
  start: Vector2;
  end: Vector2;
  onSetStart: (start: Vector2) => void;
  onSetEnd: (end: Vector2) => void;
  maxX: number;
  maxY: number;
}) {
  return (
    <div>
      <h3> Start </h3>
      <label> X </label>
      <input
        type="number"
        value={start.x}
        min={0}
        max={maxX}
        onChange={(e) =>
          onSetStart({ x: parseInt(e.target.value, 10), y: start.y })
        }
      />
      <label> Y </label>
      <input
        type="number"
        value={start.y}
        min={0}
        max={maxY}
        onChange={(e) =>
          onSetStart({ x: start.x, y: parseInt(e.target.value, 10) })
        }
      />
      <h3> End </h3>
      <label> X </label>
      <input
        type="number"
        value={end.x}
        min={0}
        max={maxX}
        onChange={(e) =>
          onSetEnd({ x: parseInt(e.target.value, 10), y: end.y })
        }
      />
      <label> Y </label>
      <input
        type="number"
        value={end.y}
        min={0}
        max={maxY}
        onChange={(e) =>
          onSetEnd({ x: end.x, y: parseInt(e.target.value, 10) })
        }
      />
    </div>
  );
}

function Legend() {
  const base = {
    border: "1px solid black",
    display: "inline-block",
    width: "20px",
    textAlign: "center" as const,
  };
  return (
    <div>
      <h3> Legend </h3>
      <div>
        <span style={{ ...base, backgroundColor: "white" }}>0</span> - walkable
      </div>
      <div>
        <span style={{ ...base, backgroundColor: "palegreen" }}>0</span> -
        shortest path
      </div>
      <div>
        <span style={{ ...base, backgroundColor: "gray" }}>1</span> -
        obstruction
      </div>
      <div>
        <span style={{ ...base, backgroundColor: "orange" }}>0</span> - start
      </div>
      <div>
        <span style={{ ...base, backgroundColor: "aqua" }}>0</span> - end
      </div>
    </div>
  );
}

function SolutionGrid({
  rows,
  start,
  end,
  path,
  onClickTile,
}: {
  rows: number[][];
  start: Vector2;
  end: Vector2;
  path: Vector2[];
  onClickTile: (tile: Vector2) => void;
}) {
  return (
    <div>
      <h3> Grid </h3>
      {rows.map((cells, y) => (
        <div key={y}>
          {cells.map((cell, x) => (
            <span
              key={x}
              onClick={() => onClickTile({ x, y })}
              style={{
                width: "20px",
                height: "20px",
                display: "inline-block",
                border: "1px solid black",
                margin: "5px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: (() => {
                  const current = { x, y };
                  let color = "white";
                  if (valueAt(current, rows) === 1) {
                    color = "gray";
                  }
                  if (path.find((t) => vectorEquals(t, { x, y }))) {
                    color = "palegreen";
                  }
                  if (vectorEquals(start, current)) {
                    color = "orange";
                  }
                  if (vectorEquals(end, current)) {
                    color = "aqua";
                  }

                  return color;
                })(),
              }}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function findShortestPath(grid: number[][], start: Vector2, end: Vector2) {
  if (!isWalkable(end, grid)) {
    console.error(`Destination (${end.x}, ${end.y}) is not a walkable tile`);
  }

  const queue: SearchQueueItem[] = [{ tile: start, history: [] }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    // Pop item off end of array
    const { tile, history } = dequeue(queue);
    visit(tile, visited);
    history.push(tile);

    if (vectorEquals(tile, end)) {
      console.log("Done");
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

function enqueue(value: SearchQueueItem, queue: SearchQueueItem[]): void {
  queue.push(value);
}

function dequeue<SearchQueueItem>(queue: SearchQueueItem[]): SearchQueueItem {
  const result = queue.shift();
  if (typeof result !== "undefined") {
    return result;
  }
  throw new Error("Tried to dequeue from an empty queue");
}

function toKey({ x, y }: Vector2) {
  return `${x},${y}`;
}

function hasBeenVisited(tile: Vector2, visited: Set<string>) {
  return visited.has(toKey(tile));
}
function visit(tile: Vector2, visited: Set<string>) {
  return visited.add(toKey(tile));
}

function isWalkable(tile: Vector2, grid: number[][]) {
  return valueAt(tile, grid) === 0;
}

function valueAt({ x, y }: Vector2, grid: number[][]): number {
  return Array.isArray(grid[y]) ? grid[y][x] : -1;
}

function getNeighbors({ x, y }: Vector2, start: Vector2, end: Vector2) {
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

  return [up, down, left, right];
}

function vectorEquals(a: Vector2, b: Vector2) {
  return a.x === b.x && a.y === b.y;
}

type SearchQueueItem = {
  tile: Vector2;
  history: Vector2[];
};

type Vector2 = {
  x: number;
  y: number;
};
