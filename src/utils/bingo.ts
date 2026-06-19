export type BingoLetter = "B" | "I" | "N" | "G" | "O";

export const TOTAL_BINGO_NUMBERS = 75;

export const BINGO_NUMBERS = Array.from(
  { length: TOTAL_BINGO_NUMBERS },
  (_, index) => index + 1
);

export function getBingoLetter(number: number): BingoLetter {
  if (number >= 1 && number <= 15) return "B";
  if (number >= 16 && number <= 30) return "I";
  if (number >= 31 && number <= 45) return "N";
  if (number >= 46 && number <= 60) return "G";
  return "O";
}

export function formatBingoNumber(number: number): string {
  return `${getBingoLetter(number)}-${number}`;
}

export function getColumnNumbers(letter: BingoLetter): number[] {
  const ranges: Record<BingoLetter, [number, number]> = {
    B: [1, 15],
    I: [16, 30],
    N: [31, 45],
    G: [46, 60],
    O: [61, 75],
  };

  const [start, end] = ranges[letter];

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}