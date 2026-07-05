import type { Piece as PieceType } from "../game/types";

interface PieceProps {
  piece: PieceType;
}

export default function Piece({ piece }: PieceProps) {
  return (
    <div className={`piece piece-${piece.player} ${piece.king ? "king" : ""}`}>
      {piece.king && <span className="crown">♛</span>}
    </div>
  );
}
