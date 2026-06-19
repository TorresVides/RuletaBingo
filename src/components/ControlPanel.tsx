type ControlPanelProps = {
  isFinished: boolean;
  isSpinning: boolean;
  remainingCount: number;
  drawnCount: number;
  progress: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onSpin: () => void;
  onReset: () => void;
};

export function ControlPanel({
  isFinished,
  isSpinning,
  remainingCount,
  drawnCount,
  progress,
  soundEnabled,
  onToggleSound,
  onSpin,
  onReset,
}: ControlPanelProps) {
  return (
    <section className="control-card">
      <div className="stats-row">
        <div>
          <span className="stat-label">Salidos</span>
          <strong>{drawnCount}</strong>
        </div>

        <div>
          <span className="stat-label">Restantes</span>
          <strong>{remainingCount}</strong>
        </div>
      </div>

      <div className="progress-shell">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <button
        className="primary-button"
        onClick={onSpin}
        disabled={isFinished || isSpinning}
      >
        {isSpinning
          ? "Girando..."
          : isFinished
            ? "Partida completa"
            : "Girar ruleta"}
      </button>

      <button
        className="secondary-button"
        onClick={onReset}
        disabled={isSpinning}
      >
        Reiniciar partida
      </button>

      <button
        className="sound-button"
        onClick={onToggleSound}
        disabled={isSpinning}
      >
        Sonido: {soundEnabled ? "ON" : "OFF"}
      </button>
    </section>
  );
}