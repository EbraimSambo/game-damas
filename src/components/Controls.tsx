import type { Difficulty, Mode } from "../game/types";

interface ControlsProps {
  mode: Mode;
  difficulty: Difficulty;
  onModeChange: (mode: Mode) => void;
  onDifficultyChange: (d: Difficulty) => void;
  onStart: () => void;
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

export default function Controls({ mode, difficulty, onModeChange, onDifficultyChange, onStart }: ControlsProps) {
  return (
    <section className="damas-menu">
      <div className="menu-controls">
        <div className="control-group">
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

        <button className="start-btn" onClick={onStart}>
          Jogar
        </button>
      </div>
    </section>
  );
}
