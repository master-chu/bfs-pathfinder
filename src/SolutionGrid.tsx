import { valueAt, vectorEquals } from './findShortestPath';
import { Vector2 } from './types';

export default function SolutionGrid({
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