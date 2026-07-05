import Piece from "./Piece";
import type { Cell } from "../game/types";

interface SquareProps {
  r: number;
  c: number;
  cell: Cell;
  isDark: boolean;
  isSelected: boolean;
  isTarget: boolean;
  isLast: boolean;
  onClick: (r: number, c: number) => void;
}

export default function Square({ r, c, cell, isDark, isSelected, isTarget, isLast, onClick }: SquareProps) {
  return (
    <div
      className={[
        "square",
        isDark ? "dark" : "light",
        isSelected ? "selected" : "",
        isLast ? "last-move" : "",
      ].filter(Boolean).join(" ")}
      onClick={() => onClick(r, c)}
    >
      {isTarget && <span className="target-dot" />}
      {cell && <Piece piece={cell} />}
    </div>
  );
}
