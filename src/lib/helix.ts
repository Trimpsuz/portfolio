export const helixAngle = (progress: number, phase: number, turns: number): number => progress * turns * 2 * Math.PI + phase;

export const depthOf = (angle: number): number => (Math.cos(angle) + 1) / 2;

export const helixTransform = (angle: number, y: number, radius: number, scale = 1, cardScale = 1): string =>
  `translate(-50%, -50%) rotateY(${angle.toFixed(4)}rad) translateZ(${radius}px) translateY(${y.toFixed(1)}px) scale(${(scale / cardScale).toFixed(5)})`;

export const depthFilter = (depth: number, brightnessFloor = 0.23, maxBlur = 20): string => {
  const brightness = brightnessFloor + (1 - brightnessFloor) * depth * depth;
  const blur = (1 - depth) * (1 - depth) * maxBlur;
  return `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
};

export const wrap = (value: number, length: number): number => ((value % length) + length) % length;
