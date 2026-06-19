import { getColumnNumbers, type BingoLetter } from "../utils/bingo";


type HistoryBoardProps = {
  drawnNumbers: number[];
};

const letters: BingoLetter[] = ["B", "I", "N", "G", "O"];

export function HistoryBoard({ drawnNumbers }: HistoryBoardProps) {
  const drawnSet = new Set(drawnNumbers);
  const latestNumber = drawnNumbers[0] ?? null;

  return (
    <section className="history-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">Historial</p>
          <h2>Números sorteados</h2>
        </div>

        <span className="history-count">{drawnNumbers.length}/75</span>
      </div>

      <div className="bingo-grid">
        {letters.map((letter) => (
          <div className="bingo-column" key={letter}>
            <div className={`bingo-letter letter-${letter}`}>{letter}</div>

            <div className="bingo-numbers">
              {getColumnNumbers(letter).map((number) => {
                const isDrawn = drawnSet.has(number);
                const isLatest = latestNumber === number;

                return (
                  <span
                    key={number}
                    className={[
                      "history-number",
                      isDrawn ? "is-drawn" : "",
                      isLatest ? "is-latest" : "",
                    ].join(" ")}
                  >
                    {number}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}