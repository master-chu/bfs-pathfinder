/* eslint-disable @typescript-eslint/no-use-before-define*/
import { useState } from "react";
import update from "immutability-helper";

import "./App.css";
import Controls from './Controls';
import Legend from './Legend';
import SolutionGrid from './SolutionGrid';
import { Vector2 } from './types';
import findShortestPath from './findShortestPath';

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