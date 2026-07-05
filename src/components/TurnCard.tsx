import type { PlayerId } from "../game/types";

interface HeaderProps {
  thinking: boolean;
  mandatory: boolean;
  winner: PlayerId | null;
  current: PlayerId;
}

const PLAYER_LABEL: Record<PlayerId, string> = {
  A: "Marfim",
  B: "Ébano",
};

export default function TurnCard({ thinking, mandatory, winner, current }: HeaderProps) {
  return (
    <div className={`turn-card ${winner ? "done" : ""}`}>
      {winner ? (
        <>
          <span className="turn-title">Fim de jogo</span>
          <span className="turn-value">
            {PLAYER_LABEL[winner]} vence
          </span>
        </>
      ) : (
        <>
          <span className="turn-title">Vez de</span>
          <span className={`turn-value player-${current}`}>
            {PLAYER_LABEL[current]}
            {thinking && " · pensando…"}
          </span>
          {mandatory && (
            <span className="hint">Captura obrigatória</span>
          )}
        </>
      )}
    </div>
  );
}
