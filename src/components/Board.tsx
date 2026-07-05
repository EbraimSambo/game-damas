import { isDark } from "../game/board";
import Square from "./Square";
import type { Board, Pos } from "../game/types";
import type { Move } from "../game/types";

interface BoardProps {
  board: Board;
  selected: Pos | null;
  legalMoves: Move[];
  lastMove: { from: Pos; to: Pos } | null;
  onSquareClick: (r: number, c: number) => void;
}

export default function BoardView({ board, selected, legalMoves, lastMove, onSquareClick }: BoardProps) {
  const targetSet = new Set<string>();
  legalMoves.forEach((m) => targetSet.add(`${m.to[0]}-${m.to[1]}`));

  return (
    <div className="board-frame">
      <div className="board">
        {board.map((row, r) =>
          row.map((cell, c) => (
            <Square
              key={`${r}-${c}`}
              r={r}
              c={c}
              cell={cell}
              isDark={isDark(r, c)}
              isSelected={selected?.[0] === r && selected?.[1] === c}
              isTarget={targetSet.has(`${r}-${c}`)}
              isLast={
                (lastMove?.from[0] === r && lastMove?.from[1] === c) ||
                (lastMove?.to[0] === r && lastMove?.to[1] === c)
              }
              onClick={onSquareClick}
            />
          ))
        )}
      </div>
    </div>
  );
}
