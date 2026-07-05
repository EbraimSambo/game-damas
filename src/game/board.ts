import type { Board, Cell, Move, PlayerId, Pos, FullMove } from "./types";

export const SIZE = 8;
export const DIRS: Pos[] = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

export const PLAYER_LABEL: Record<PlayerId, string> = {
  A: "Marfim",
  B: "Ébano",
};

export function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

export function isDark(r: number, c: number): boolean {
  return (r + c) % 2 === 1;
}

export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, (): Cell => null)
  );
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!isDark(r, c)) continue;
      if (r <= 2) board[r][c] = { player: "B", king: false };
      else if (r >= 5) board[r][c] = { player: "A", king: false };
    }
  }
  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export function opponent(p: PlayerId): PlayerId {
  return p === "A" ? "B" : "A";
}

export function forwardDir(p: PlayerId): number {
  return p === "A" ? -1 : 1;
}

export function backRow(p: PlayerId): number {
  return p === "A" ? 0 : SIZE - 1;
}

export function getCaptureMoves(board: Board, r: number, c: number): Move[] {
  const piece = board[r][c];
  if (!piece) return [];
  const moves: Move[] = [];

  if (piece.king) {
    for (const [dr, dc] of DIRS) {
      let cr = r + dr;
      let cc = c + dc;
      while (inBounds(cr, cc) && !board[cr][cc]) {
        cr += dr;
        cc += dc;
      }
      if (inBounds(cr, cc) && board[cr][cc] && board[cr][cc]!.player !== piece.player) {
        let lr = cr + dr;
        let lc = cc + dc;
        while (inBounds(lr, lc) && !board[lr][lc]) {
          moves.push({ to: [lr, lc], capture: [cr, cc] });
          lr += dr;
          lc += dc;
        }
      }
    }
  } else {
    for (const [dr, dc] of DIRS) {
      const mr = r + dr;
      const mc = c + dc;
      const lr = r + 2 * dr;
      const lc = c + 2 * dc;
      if (
        inBounds(lr, lc) &&
        board[mr][mc] &&
        board[mr][mc]!.player !== piece.player &&
        !board[lr][lc]
      ) {
        moves.push({ to: [lr, lc], capture: [mr, mc] });
      }
    }
  }
  return moves;
}

export function getSimpleMoves(board: Board, r: number, c: number): Move[] {
  const piece = board[r][c];
  if (!piece) return [];
  const moves: Move[] = [];

  if (piece.king) {
    for (const [dr, dc] of DIRS) {
      let cr = r + dr;
      let cc = c + dc;
      while (inBounds(cr, cc) && !board[cr][cc]) {
        moves.push({ to: [cr, cc] });
        cr += dr;
        cc += dc;
      }
    }
  } else {
    const dr = forwardDir(piece.player);
    for (const dc of [-1, 1]) {
      const nr = r + dr;
      const nc = c + dc;
      if (inBounds(nr, nc) && !board[nr][nc]) moves.push({ to: [nr, nc] });
    }
  }
  return moves;
}

export function playerPieces(board: Board, player: PlayerId): Pos[] {
  const list: Pos[] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) {
      const cell = board[r][c];
      if (cell && cell.player === player) list.push([r, c]);
    }
  return list;
}

export function piecesWithCaptures(board: Board, player: PlayerId): Pos[] {
  return playerPieces(board, player).filter(
    ([r, c]) => getCaptureMoves(board, r, c).length > 0
  );
}

export function applyMove(board: Board, from: Pos, move: Move): { board: Board; promoted: boolean } {
  const nb = cloneBoard(board);
  const piece = nb[from[0]][from[1]];
  if (!piece) return { board: nb, promoted: false };
  nb[from[0]][from[1]] = null;
  if (move.capture) nb[move.capture[0]][move.capture[1]] = null;
  const [tr, tc] = move.to;
  let promoted = false;
  if (!piece.king && tr === backRow(piece.player)) {
    piece.king = true;
    promoted = true;
  }
  nb[tr][tc] = piece;
  return { board: nb, promoted };
}

export function getAllFullMoves(board: Board, player: PlayerId): FullMove[] {
  const capturers = piecesWithCaptures(board, player);
  const results: FullMove[] = [];

  if (capturers.length > 0) {
    const expand = (bd: Board, pos: Pos, path: Pos[], captured: Pos[]) => {
      const caps = getCaptureMoves(bd, pos[0], pos[1]);
      if (caps.length === 0) {
        results.push({ board: bd, path, captured });
        return;
      }
      for (const mv of caps) {
        const { board: nb, promoted } = applyMove(bd, pos, mv);
        const newPath = [...path, mv.to];
        const newCaptured = [...captured, mv.capture as Pos];
        if (promoted) {
          results.push({ board: nb, path: newPath, captured: newCaptured });
        } else {
          expand(nb, mv.to, newPath, newCaptured);
        }
      }
    };
    for (const pos of capturers) expand(board, pos, [pos], []);
  } else {
    for (const pos of playerPieces(board, player)) {
      for (const mv of getSimpleMoves(board, pos[0], pos[1])) {
        const { board: nb } = applyMove(board, pos, mv);
        results.push({ board: nb, path: [pos, mv.to], captured: [] });
      }
    }
  }
  return results;
}

export function hasAnyMove(board: Board, player: PlayerId): boolean {
  return getAllFullMoves(board, player).length > 0;
}
