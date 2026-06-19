export function getSegmentAngle(totalSegments: number): number {
  if (totalSegments <= 0) return 360;
  return 360 / totalSegments;
}

export function normalizeDegrees(angle: number): number {
  return ((angle % 360) + 360) % 360;
}

export function getTargetRotationForNumber(params: {
  targetNumber: number;
  visibleNumbers: number[];
  currentRotation: number;
  extraTurns?: number;
}): number {
  const {
    targetNumber,
    visibleNumbers,
    currentRotation,
    extraTurns = 7,
  } = params;

  const targetIndex = visibleNumbers.indexOf(targetNumber);

  if (targetIndex === -1) {
    return currentRotation;
  }

  const segmentAngle = getSegmentAngle(visibleNumbers.length);

  /**
   * La rueda empieza desde arriba.
   * El centro del segmento está a:
   * index * segmentAngle + segmentAngle / 2
   */
  const targetCenterOffset = targetIndex * segmentAngle + segmentAngle / 2;

  /**
   * Para que ese centro quede bajo el puntero superior,
   * la rueda debe rotar en sentido contrario a ese offset.
   */
  const desiredRotationMod = normalizeDegrees(-targetCenterOffset);
  const currentRotationMod = normalizeDegrees(currentRotation);

  const delta = normalizeDegrees(desiredRotationMod - currentRotationMod);

  return currentRotation + extraTurns * 360 + delta;
}

export function polarToCartesian(
  cx: number,
  cy: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;

  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
}

export function describeDonutSlice(params: {
  cx: number;
  cy: number;
  outerRadius: number;
  innerRadius: number;
  startAngle: number;
  endAngle: number;
}): string {
  const { cx, cy, outerRadius, innerRadius, startAngle, endAngle } = params;

  const angleSize = Math.abs(endAngle - startAngle);

  /**
   * Caso especial: cuando solo queda un número,
   * el segmento ocupa toda la ruleta.
   */
  if (angleSize >= 359.99) {
    const outerTop = polarToCartesian(cx, cy, outerRadius, -90);
    const outerBottom = polarToCartesian(cx, cy, outerRadius, 90);
    const innerTop = polarToCartesian(cx, cy, innerRadius, -90);
    const innerBottom = polarToCartesian(cx, cy, innerRadius, 90);

    return [
      `M ${outerTop.x} ${outerTop.y}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${outerBottom.x} ${outerBottom.y}`,
      `A ${outerRadius} ${outerRadius} 0 1 1 ${outerTop.x} ${outerTop.y}`,
      `M ${innerTop.x} ${innerTop.y}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${innerBottom.x} ${innerBottom.y}`,
      `A ${innerRadius} ${innerRadius} 0 1 0 ${innerTop.x} ${innerTop.y}`,
      "Z",
    ].join(" ");
  }

  const outerStart = polarToCartesian(cx, cy, outerRadius, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerRadius, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerRadius, startAngle);
  const innerEnd = polarToCartesian(cx, cy, innerRadius, endAngle);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
}