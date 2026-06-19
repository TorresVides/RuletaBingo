import { useEffect, useRef } from "react";
import gsap from "gsap";
import { formatBingoNumber } from "../utils/bingo";

type WinnerDisplayProps = {
  currentNumber: number | null;
};

export function WinnerDisplay({ currentNumber }: WinnerDisplayProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    if (!currentNumber || !cardRef.current || !numberRef.current) return;

    const timeline = gsap.timeline();

    timeline.fromTo(
      cardRef.current,
      {
        boxShadow: "0 0 0 rgba(250, 204, 21, 0)",
      },
      {
        boxShadow: "0 0 70px rgba(250, 204, 21, 0.45)",
        duration: 0.28,
        ease: "power2.out",
      }
    );

    timeline.fromTo(
      numberRef.current,
      {
        scale: 0.72,
        opacity: 0,
        filter: "blur(14px)",
        y: 18,
      },
      {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.72,
        ease: "back.out(1.8)",
      },
      0
    );

    timeline.to(cardRef.current, {
      boxShadow: "0 24px 90px rgba(0, 0, 0, 0.42)",
      duration: 0.7,
      ease: "power2.out",
    });

    return () => {
      timeline.kill();
    };
  }, [currentNumber]);

  return (
    <section className="winner-card" ref={cardRef}>
      <p className="eyebrow">Número ganador</p>

      {currentNumber ? (
        <>
          <h2 className="winner-number" ref={numberRef}>
            {formatBingoNumber(currentNumber)}
          </h2>
          <p className="winner-caption">Marca este número en tu tabla.</p>
        </>
      ) : (
        <>
          <h2 className="winner-placeholder">--</h2>
          <p className="winner-caption">Gira la ruleta para comenzar.</p>
        </>
      )}
    </section>
  );
}