import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { ControlPanel } from "./components/ControlPanel";
import { HistoryBoard } from "./components/HistoryBoard";
import { RouletteWheel } from "./components/RouletteWheel";
import { WinnerDisplay } from "./components/WinnerDisplay";
import { useBingoGame } from "./hooks/useBingoGame";

export default function App() {
  const {
    availableNumbers,
    drawnNumbers,
    currentNumber,
    remainingCount,
    drawnCount,
    isFinished,
    progress,
    pickNextNumber,
    commitNumber,
    resetGame,
  } = useBingoGame();

  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [spinId, setSpinId] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    spinAudioRef.current = new Audio("/sounds/spin.mp3");
    winAudioRef.current = new Audio("/sounds/win.mp3");

    spinAudioRef.current.volume = 0.35;
    winAudioRef.current.volume = 0.55;
  }, []);

  function playSound(type: "spin" | "win") {
    if (!soundEnabled) return;

    const audio =
      type === "spin" ? spinAudioRef.current : winAudioRef.current;

    if (!audio) return;

    audio.currentTime = 0;

    audio.play().catch(() => {
      /**
       * Si el navegador bloquea el audio o el archivo no existe,
       * ignoramos el error para no romper la app.
       */
    });
  }

  function fireWinnerConfetti() {
    confetti({
      particleCount: 120,
      spread: 80,
      startVelocity: 38,
      origin: { y: 0.58 },
    });

    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 120,
        startVelocity: 28,
        origin: { y: 0.72 },
      });
      removeNumber(winner);
    }, 180);
  }

  function handleSpin() {
    if (isSpinning || isFinished) return;

    const nextNumber = pickNextNumber();

    if (!nextNumber) return;

    setTargetNumber(nextNumber);
    setIsSpinning(true);
    setSpinId((previous) => previous + 1);

    playSound("spin");
  }

  function handleSpinEnd(number: number) {
    commitNumber(number);
    setIsSpinning(false);
    fireWinnerConfetti();
    playSound("win");
  }

  function handleReset() {
    resetGame();
    setTargetNumber(null);
    setSpinId(0);
    setIsSpinning(false);
  }

  const removeNumber = (number) => {
    setNumbers(prev => prev.filter(n => n !== number));
  };

  return (
    <main className="app-shell">
      <div className="background-orb orb-one" />
      <div className="background-orb orb-two" />

      <header className="hero compact-hero">
        <p className="eyebrow">Interactive Bingo Experience</p>
        <h1>Ruleta Bingo 1-75</h1>
        <p>
          Ruleta dinámica con animación real, historial, confeti y sonido
          opcional.
        </p>
      </header>

      <section className="game-layout">
        <RouletteWheel
          visibleNumbers={availableNumbers}
          targetNumber={targetNumber}
          spinId={spinId}
          isSpinning={isSpinning}
          onSpinEnd={handleSpinEnd}
        />

        <aside className="side-zone">
          <WinnerDisplay currentNumber={currentNumber} />

          <ControlPanel
            isFinished={isFinished}
            isSpinning={isSpinning}
            remainingCount={remainingCount}
            drawnCount={drawnCount}
            progress={progress}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((previous) => !previous)}
            onSpin={handleSpin}
            onReset={handleReset}
          />
        </aside>
      </section>

      <HistoryBoard drawnNumbers={drawnNumbers} />
    </main>
  );
}
