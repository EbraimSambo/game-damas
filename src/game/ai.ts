import type { Board, Difficulty, FullMove, PlayerId } from "./types";
import { getAllFullMoves, opponent } from "./board";

const SIZE = 8;

function evaluateBoard(board: Board, aiPlayer: PlayerId): number {
  let score = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = board[r][c];
      if (!cell) continue;
      let value = cell.king ? 3 : 1;
      if (!cell.king) {
        const advance = cell.player === "A" ? SIZE - 1 - r : r;
        value += advance * 0.03;
      }
      const centerBonus = 4 - (Math.abs(3.5 - r) + Math.abs(3.5 - c)) * 0.02;
      value += centerBonus * 0.02;
      score += cell.player === aiPlayer ? value : -value;
    }
  }
  return score;
}

function minimax(
  board: Board,
  player: PlayerId,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  aiPlayer: PlayerId
): number {
  const moves = getAllFullMoves(board, player);
  if (moves.length === 0) {
    const sign = player === aiPlayer ? -1 : 1;
    return sign * (500 + depth);
  }
  if (depth === 0) return evaluateBoard(board, aiPlayer);

  const next = opponent(player);
  if (maximizing) {
    let best = -Infinity;
    for (const mv of moves) {
      const val = minimax(mv.board, next, depth - 1, alpha, beta, false, aiPlayer);
      best = Math.max(best, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const mv of moves) {
      const val = minimax(mv.board, next, depth - 1, alpha, beta, true, aiPlayer);
      best = Math.min(best, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return best;
  }
}

const DEPTH_BY_DIFFICULTY: Record<Difficulty, number> = {
  facil: 1,
  medio: 3,
  dificil: 5,
};

export function chooseComputerMove(board: Board, player: PlayerId, difficulty: Difficulty): FullMove | null {
  const moves = getAllFullMoves(board, player);
  if (moves.length === 0) return null;

  const depth = DEPTH_BY_DIFFICULTY[difficulty];
  let scored = moves.map((mv) => ({
    mv,
    score: minimax(mv.board, opponent(player), depth - 1, -Infinity, Infinity, false, player),
  }));

  if (difficulty === "facil") {
    scored = scored.sort(() => Math.random() - 0.5);
    const pick = Math.random() < 0.55 ? scored : scored.sort((a, b) => b.score - a.score);
    return pick[Math.floor(Math.random() * Math.min(3, pick.length))].mv;
  }

  scored.sort((a, b) => b.score - a.score);
  const bestScore = scored[0].score;
  const top = scored.filter((s) => s.score === bestScore);
  return top[Math.floor(Math.random() * top.length)].mv;
}
