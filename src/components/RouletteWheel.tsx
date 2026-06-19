import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getBingoLetter } from "../utils/bingo";
import {
  describeDonutSlice,
  getSegmentAngle,
  getTargetRotationForNumber,
  polarToCartesian,
} from "../utils/roulette";

gsap.registerPlugin(useGSAP);

type RouletteWheelProps = {
  visibleNumbers: number[];
  targetNumber: number | null;
  spinId: number;
  isSpinning: boolean;
  onSpinEnd: (number: number) => void;
};

const CX = 250;
const CY = 250;
const OUTER_RADIUS = 220;
const INNER_RADIUS = 72;

const columnColors: Record<string, string> = {
  B: "#ef4444",
  I: "#f59e0b",
  N: "#22c55e",
  G: "#22d3ee",
  O: "#a855f7",
};

export function RouletteWheel({
  visibleNumbers,
  targetNumber,
  spinId,
  isSpinning,
  onSpinEnd,
}: RouletteWheelProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const wheelRef = useRef<SVGGElement | null>(null);
  const pointerRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(0);

  const segmentAngle = getSegmentAngle(visibleNumbers.length);

  const slices = useMemo(() => {
    return visibleNumbers.map((number, index) => {
      const startAngle = -90 + index * segmentAngle;
      const endAngle = startAngle + segmentAngle;
      const centerAngle = startAngle + segmentAngle / 2;

      const labelPosition = polarToCartesian(CX, CY, 188, centerAngle);

      return {
        number,
        index,
        letter: getBingoLetter(number),
        centerAngle,
        labelPosition,
        path: describeDonutSlice({
          cx: CX,
          cy: CY,
          outerRadius: OUTER_RADIUS,
          innerRadius: INNER_RADIUS,
          startAngle,
          endAngle,
        }),
      };
    });
  }, [visibleNumbers, segmentAngle]);

  const shouldShowAllLabels = visibleNumbers.length <= 30;

  useGSAP(
    () => {
      if (!targetNumber || spinId === 0 || !wheelRef.current) return;

      const extraTurns = 6 + Math.floor(Math.random() * 3);

      const nextRotation = getTargetRotationForNumber({
        targetNumber,
        visibleNumbers,
        currentRotation: rotationRef.current,
        extraTurns,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power4.out",
        },
        onComplete: () => {
          rotationRef.current = nextRotation;
          onSpinEnd(targetNumber);
        },
      });

      timeline.to(wheelRef.current, {
        rotate: nextRotation,
        duration: 5.2,
        transformOrigin: "50% 50%",
      });

      if (pointerRef.current) {
        timeline.fromTo(
          pointerRef.current,
          {
            rotate: -5,
            scale: 1,
          },
          {
            rotate: 5,
            scale: 1.08,
            duration: 0.08,
            repeat: 30,
            yoyo: true,
            ease: "sine.inOut",
          },
          0.2
        );

        timeline.to(
          pointerRef.current,
          {
            rotate: 0,
            scale: 1,
            duration: 0.18,
          },
          "-=0.1"
        );
      }

      return () => {
        timeline.kill();
      };
    },
    {
      dependencies: [spinId],
      scope: rootRef,
    }
  );

  return (
    <section className="wheel-zone">
      <div className="roulette-shell" ref={rootRef}>
        <div className="roulette-aura" />

        <div className="roulette-pointer" ref={pointerRef}>
          <div className="pointer-triangle" />
          <div className="pointer-glow" />
        </div>

        <svg
          className={isSpinning ? "roulette-svg is-spinning" : "roulette-svg"}
          viewBox="0 0 500 500"
          role="img"
          aria-label="Ruleta dinámica de bingo"
        >
          <defs>
            <filter id="wheelShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow
                dx="0"
                dy="18"
                stdDeviation="16"
                floodOpacity="0.45"
              />
            </filter>

            <radialGradient id="centerGradient" cx="50%" cy="42%" r="60%">
              <stop offset="0%" stopColor="#fff7ed" />
              <stop offset="35%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#92400e" />
            </radialGradient>
          </defs>

          <g ref={wheelRef} filter="url(#wheelShadow)">
            <circle cx={CX} cy={CY} r={OUTER_RADIUS + 8} className="wheel-rim" />

            {slices.map((slice) => {
              const isTarget = targetNumber === slice.number;
              const shouldShowLabel =
                shouldShowAllLabels || slice.number % 5 === 0 || isTarget;

              return (
                <g key={slice.number}>
                  <path
                    d={slice.path}
                    fill={columnColors[slice.letter]}
                    className={[
                      "wheel-slice",
                      isTarget && isSpinning ? "is-target" : "",
                    ].join(" ")}
                    opacity={slice.index % 2 === 0 ? 0.95 : 0.78}
                    fillRule="evenodd"
                  />

                  {shouldShowLabel && (
                    <text
                      x={slice.labelPosition.x}
                      y={slice.labelPosition.y}
                      className={[
                        "wheel-label",
                        isTarget ? "is-current-label" : "",
                      ].join(" ")}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${slice.centerAngle + 90} ${slice.labelPosition.x} ${slice.labelPosition.y})`}
                    >
                      {slice.number}
                    </text>
                  )}
                </g>
              );
            })}

            <circle cx={CX} cy={CY} r={INNER_RADIUS + 8} className="inner-ring" />
            <circle cx={CX} cy={CY} r={INNER_RADIUS} fill="url(#centerGradient)" />

            <text x={CX} y={CY - 14} textAnchor="middle" className="center-title">
              BINGO
            </text>

            <text x={CX} y={CY + 22} textAnchor="middle" className="center-subtitle">
              {visibleNumbers.length} restantes
            </text>
          </g>
        </svg>
      </div>
    </section>
  );
}