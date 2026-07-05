import { useCallback, useEffect, useMemo, useState } from "react";
import type { Board, Difficulty, Mode, PlayerId, Pos } from "../game/types";
import type { Move } from "../game/types";
import {
  applyMove,
  createInitialBoard,
  getCaptureMoves,
  getSimpleMoves,
  hasAnyMove,
  isDark,
  opponent,
  piecesWithCaptures,
} from "../game/board";
import { chooseComputerMove } from "../game/ai";
import Header from "./Header";
import Controls from "./Controls";
import BoardView from "./Board";
import SidePanel from "./SidePanel";
import "../styles/damas.css";

export default function Damas() {
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [current, setCurrent] = useState<PlayerId>("A");
  const [selected, setSelected] = useState<Pos | null>(null);
  const [mode, setMode] = useState<Mode>("pvp");
  const [difficulty, setDifficulty] = useState<Difficulty>("medio");
  const [winner, setWinner] = useState<PlayerId | null>(null);
  const [thinking, setThinking] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: Pos; to: Pos } | null>(null);

  const computerPlayer: PlayerId = "B";
  const isComputerTurn = mode === "cpu" && current === computerPlayer && !winner;

  const mandatoryCapturers = useMemo(
    () => piecesWithCaptures(board, current),
    [board, current]
  );

  const legalMovesForSelected: Move[] = useMemo(() => {
    if (!selected) return [];
    const [r, c] = selected;
    if (mandatoryCapturers.length > 0) return getCaptureMoves(board, r, c);
    return getSimpleMoves(board, r, c);
  }, [board, selected, mandatoryCapturers]);

  const captured = useMemo(() => {
    let a = 0;
    let b = 0;
    for (const row of board)
      for (const cell of row) {
        if (cell?.player === "A") a++;
        if (cell?.player === "B") b++;
      }
    return { aLeft: a, bLeft: b };
  }, [board]);

  const resetGame = useCallback((nextMode?: Mode) => {
    setBoard(createInitialBoard());
    setCurrent("A");
    setSelected(null);
    setWinner(null);
    setLastMove(null);
    if (nextMode) setMode(nextMode);
  }, []);

  const finishTurn = useCallback(
    (nb: Board, path: Pos[]) => {
      const next = opponent(current);
      setBoard(nb);
      setLastMove({ from: path[0], to: path[path.length - 1] });
      setSelected(null);
      if (!hasAnyMove(nb, next)) {
        setWinner(current);
        return;
      }
      setCurrent(next);
    },
    [current]
  );

  const handleSquareClick = (r: number, c: number) => {
    if (winner || isComputerTurn || !isDark(r, c)) return;
    const cell = board[r][c];

    if (cell && cell.player === current) {
      if (mandatoryCapturers.length > 0 && !mandatoryCapturers.some(([pr, pc]) => pr === r && pc === c)) {
        return;
      }
      setSelected([r, c]);
      return;
    }

    if (selected) {
      const move = legalMovesForSelected.find((m) => m.to[0] === r && m.to[1] === c);
      if (!move) return;
      const { board: afterBoard, promoted } = applyMove(board, selected, move);
      const furtherCaptures = !promoted ? getCaptureMoves(afterBoard, r, c) : [];
      if (move.capture && furtherCaptures.length > 0) {
        setBoard(afterBoard);
        setSelected([r, c]);
        setLastMove({ from: selected, to: [r, c] });
        return;
      }
      finishTurn(afterBoard, [selected, [r, c]]);
    }
  };

  useEffect(() => {
    if (!isComputerTurn) return;
    setThinking(true);
    const timer = setTimeout(() => {
      const fullMove = chooseComputerMove(board, computerPlayer, difficulty);
      setThinking(false);
      if (!fullMove) {
        setWinner(opponent(computerPlayer));
        return;
      }
      const next = opponent(current);
      setBoard(fullMove.board);
      setLastMove({ from: fullMove.path[0], to: fullMove.path[fullMove.path.length - 1] });
      if (!hasAnyMove(fullMove.board, next)) {
        setWinner(current);
      } else {
        setCurrent(next);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [isComputerTurn, board, difficulty]);

  return (
    <div className="damas-root">
      <Header />

      <Controls
        mode={mode}
        difficulty={difficulty}
        onModeChange={(m) => resetGame(m)}
        onDifficultyChange={setDifficulty}
        onRestart={() => resetGame()}
      />

      <div className="damas-layout">
        <BoardView
          board={board}
          selected={selected}
          legalMoves={legalMovesForSelected}
          lastMove={lastMove}
          onSquareClick={handleSquareClick}
        />

        <SidePanel
          winner={winner}
          current={current}
          thinking={thinking}
          mandatory={mandatoryCapturers.length > 0}
          aLeft={captured.aLeft}
          bLeft={captured.bLeft}
        />
      </div>
    </div>
  );
}
