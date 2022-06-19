import { Vector2 } from './types';

export default function Controls({
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