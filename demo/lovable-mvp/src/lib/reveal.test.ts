import { describe, expect, it } from "vitest";
import { REVEAL_STAGES, blurFor, clampLevel, isMutual, nextLevel, stageLabel } from "./reveal";

describe("REVEAL_STAGES", () => {
  it("is the five stages 0 → 100 in steps of 25", () => {
    expect([...REVEAL_STAGES]).toEqual([0, 25, 50, 75, 100]);
  });
});

describe("clampLevel", () => {
  it("returns 0 for values below range", () => {
    expect(clampLevel(-1)).toBe(0);
    expect(clampLevel(-1000)).toBe(0);
  });
  it("returns 100 for values above range", () => {
    expect(clampLevel(101)).toBe(100);
    expect(clampLevel(9999)).toBe(100);
  });
  it("keeps exact stage boundaries", () => {
    for (const s of REVEAL_STAGES) expect(clampLevel(s)).toBe(s);
  });
  it("rounds down between stages", () => {
    expect(clampLevel(24)).toBe(0);
    expect(clampLevel(26)).toBe(25);
    expect(clampLevel(49.9)).toBe(25);
    expect(clampLevel(99)).toBe(75);
  });
});

describe("nextLevel", () => {
  it("advances one stage per interaction", () => {
    expect(nextLevel(0)).toBe(25);
    expect(nextLevel(25)).toBe(50);
    expect(nextLevel(50)).toBe(75);
    expect(nextLevel(75)).toBe(100);
  });
  it("saturates at 100", () => {
    expect(nextLevel(100)).toBe(100);
    expect(nextLevel(150)).toBe(100);
  });
});

describe("blurFor", () => {
  it("maps each stage to its blur in px", () => {
    expect(blurFor(0)).toBe(32);
    expect(blurFor(25)).toBe(20);
    expect(blurFor(50)).toBe(11);
    expect(blurFor(75)).toBe(4);
    expect(blurFor(100)).toBe(0);
  });
  it("clamps out-of-range and in-between values", () => {
    expect(blurFor(-5)).toBe(32);
    expect(blurFor(60)).toBe(11);
    expect(blurFor(200)).toBe(0);
  });
});

describe("stageLabel", () => {
  it("labels each stage", () => {
    expect(stageLabel(0)).toBe("Hidden");
    expect(stageLabel(25)).toBe("A glimpse");
    expect(stageLabel(50)).toBe("Halfway");
    expect(stageLabel(75)).toBe("Almost there");
    expect(stageLabel(100)).toBe("Revealed");
  });
});

describe("isMutual", () => {
  it("is true only when fully revealed and they connect back", () => {
    expect(isMutual(100, true)).toBe(true);
    expect(isMutual(100, false)).toBe(false);
    expect(isMutual(75, true)).toBe(false);
    expect(isMutual(0, false)).toBe(false);
  });
});