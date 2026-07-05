import type { Difficulty, Mode } from "../game/types";

interface ControlsProps {
  mode: Mode;
  difficulty: Difficulty;
  onModeChange: (mode: Mode) => void;
  onDifficultyChange: (d: Difficulty) => void;
  onRestart: () => void;
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

export default function Controls({ mode, difficulty, onModeChange, onDifficultyChange, onRestart }: ControlsProps) {
  return (
    <section className="damas-controls">
      <div className="control-group">
        <span className="control-label">Modo</span>
        <div className="segmented">
          <button
            className={mode === "pvp" ? "active" : ""}
            onClick={() => onModeChange("pvp")}
          >
            Dois jogadores
          </button>
          <button
            className={mode === "cpu" ? "active" : ""}
            onClick={() => onModeChange("cpu")}
          >
            Contra o computador
          </button>
        </div>
      </div>

      {mode === "cpu" && (
        <div className="control-group">
          <span className="control-label">Dificuldade</span>
          <div className="segmented">
            {(["facil", "medio", "dificil"] as Difficulty[]).map((d) => (
              <button
                key={d}
                className={difficulty === d ? "active" : ""}
                onClick={() => onDifficultyChange(d)}
              >
                {DIFFICULTY_LABEL[d]}
              </button>
            ))}
          </div>
        </div>
      )}

      <button className="restart-btn" onClick={onRestart}>
        ↻ Reiniciar
      </button>
    </section>
  );
}
