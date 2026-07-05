import type { PlayerId } from "../game/types";
import TurnCard from "./TurnCard";
import ScoreCard from "./ScoreCard";

interface SidePanelProps {
  winner: PlayerId | null;
  current: PlayerId;
  thinking: boolean;
  mandatory: boolean;
  aLeft: number;
  bLeft: number;
}

export default function SidePanel({ winner, current, thinking, mandatory, aLeft, bLeft }: SidePanelProps) {
  return (
    <aside className="side-panel">
      <TurnCard
        winner={winner}
        current={current}
        thinking={thinking}
        mandatory={mandatory}
      />
      <ScoreCard aLeft={aLeft} bLeft={bLeft} />
      <p className="rules-note">
        Peças avançam na diagonal; capturam saltando o adversário em
        qualquer diagonal. Ao alcançar a última linha, tornam-se damas e
        passam a mover-se livremente pela diagonal.
      </p>
    </aside>
  );
}
