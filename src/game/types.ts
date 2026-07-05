export type PlayerId = "A" | "B";
export type Pos = [number, number];

export interface Piece {
  player: PlayerId;
  king: boolean;
}

export type Cell = Piece | null;
export type Board = Cell[][];

export interface Move {
  to: Pos;
  capture?: Pos;
}

export interface FullMove {
  board: Board;
  path: Pos[];
  captured: Pos[];
}

export type Mode = "pvp" | "cpu";
export type Difficulty = "facil" | "medio" | "dificil";
