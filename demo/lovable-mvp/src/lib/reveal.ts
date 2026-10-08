/**
 * Reveal engine (MVP).
 * Deterministic: each meaningful interaction moves reveal one stage forward.
 * Replace `nextLevel` / `blurFor` with a richer rules engine later — UI only
 * depends on the exported functions below.
 *
 * NOTE: This is a visual prototype. The full image is still sent to the
 * browser; a production version must serve pre-blurred images server-side.
 */
export const REVEAL_STAGES = [0, 25, 50, 75, 100] as const;
export type RevealLevel = (typeof REVEAL_STAGES)[number];

export function clampLevel(n: number): RevealLevel {
  const found = [...REVEAL_STAGES].reverse().find((s) => n >= s);
  return (found ?? 0) as RevealLevel;
}

export function nextLevel(level: number): RevealLevel {
  return clampLevel(Math.min(100, level + 25));
}

const BLUR: Record<RevealLevel, number> = { 0: 32, 25: 20, 50: 11, 75: 4, 100: 0 };

export function blurFor(level: number): number {
  return BLUR[clampLevel(level)];
}

export function stageLabel(level: number): string {
  switch (clampLevel(level)) {
    case 0: return "Hidden";
    case 25: return "A glimpse";
    case 50: return "Halfway";
    case 75: return "Almost there";
    default: return "Revealed";
  }
}

/** Mutual connection happens once both sides have fully revealed. */
export function isMutual(level: number, theyConnect: boolean): boolean {
  return theyConnect && clampLevel(level) === 100;
}