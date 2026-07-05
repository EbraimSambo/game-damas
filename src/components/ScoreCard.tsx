interface ScoreCardProps {
  aLeft: number;
  bLeft: number;
}

export default function ScoreCard({ aLeft, bLeft }: ScoreCardProps) {
  return (
    <div className="score-card">
      <div className="score-row">
        <span className="dot piece-A" /> Marfim
        <span className="score-num">{aLeft} em jogo</span>
      </div>
      <div className="score-row">
        <span className="dot piece-B" /> Ébano
        <span className="score-num">{bLeft} em jogo</span>
      </div>
    </div>
  );
}
