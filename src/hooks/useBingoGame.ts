import { useCallback, useMemo, useState } from "react";
import { BINGO_NUMBERS } from "../utils/bingo";

export function useBingoGame() {
  const [availableNumbers, setAvailableNumbers] =
    useState<number[]>(BINGO_NUMBERS);

  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);

  const remainingCount = availableNumbers.length;
  const drawnCount = drawnNumbers.length;
  const isFinished = remainingCount === 0;

  const progress = useMemo(() => {
    return Math.round((drawnCount / BINGO_NUMBERS.length) * 100);
  }, [drawnCount]);

  /**
   * Escoge un número, pero NO lo elimina todavía.
   * Esto es clave para la futura animación:
   * primero se escoge, luego la ruleta gira hacia él,
   * y solo al terminar se confirma.
   */
  const pickNextNumber = useCallback((): number | null => {
    if (availableNumbers.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    return availableNumbers[randomIndex];
  }, [availableNumbers]);

  /**
   * Confirma el número ganador:
   * - lo elimina de availableNumbers
   * - lo pone como número actual
   * - lo agrega al historial
   */
  const commitNumber = useCallback((number: number) => {
    setAvailableNumbers((previousNumbers) =>
      previousNumbers.filter((availableNumber) => availableNumber !== number)
    );

    setCurrentNumber(number);

    setDrawnNumbers((previousNumbers) => {
      if (previousNumbers.includes(number)) return previousNumbers;
      return [number, ...previousNumbers];
    });
  }, []);

  const resetGame = useCallback(() => {
    setAvailableNumbers(BINGO_NUMBERS);
    setDrawnNumbers([]);
    setCurrentNumber(null);
  }, []);

  return {
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
  };
}