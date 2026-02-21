import { describe, it, expect, vi, afterEach } from "vitest";
import { generateName, generateTitle } from "../nameGenerator.ts";
import type { Archetype, ElementAffinity } from "../types/index.ts";

// ============================================================
// Helpers
// ============================================================

const HARSH_PREFIXES = [
  "Krag",
  "Vex",
  "Brok",
  "Drak",
  "Thorn",
  "Grim",
  "Skar",
  "Rok",
  "Vor",
  "Zul",
  "Gor",
  "Brak",
  "Kael",
  "Mord",
  "Rax",
  "Durn",
];

const FLOWING_PREFIXES = [
  "Ael",
  "Lumi",
  "Syl",
  "Eira",
  "Thel",
  "Ari",
  "Cel",
  "Ilya",
  "Mael",
  "Nai",
  "Sera",
  "Vel",
  "Wyn",
  "Elara",
  "Fael",
  "Liora",
];

const DEFAULT_PREFIXES = [
  "Ar",
  "Bel",
  "Cas",
  "Dor",
  "El",
  "Fen",
  "Gal",
  "Hal",
  "Ir",
  "Jas",
  "Kel",
  "Lor",
  "Mir",
  "Nor",
  "Or",
  "Pel",
  "Quin",
  "Ras",
  "Sol",
  "Thar",
  "Ul",
  "Vel",
  "Wen",
  "Xan",
  "Yor",
  "Zen",
];

function startsWithAny(value: string, prefixList: string[]): boolean {
  return prefixList.some((prefix) => value.startsWith(prefix));
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ============================================================
// generateName
// ============================================================

describe("generateName", () => {
  it("returns a non-empty string with no args", () => {
    const name = generateName();
    expect(name.length).toBeGreaterThan(0);
  });

  it("uses default pool when no args provided", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const name = generateName();
    expect(startsWithAny(name, DEFAULT_PREFIXES)).toBe(true);
  });

  it("uses harsh pool for harsh class + non-flowing element", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const name = generateName("Berserker", "Earth");
    expect(startsWithAny(name, HARSH_PREFIXES)).toBe(true);
  });

  it("uses flowing pool for flowing class + non-harsh element", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const name = generateName("Druid", "Earth");
    expect(startsWithAny(name, FLOWING_PREFIXES)).toBe(true);
  });

  it("falls back to default pool when class and element conflict", () => {
    // Harsh class + flowing element → both flags true → default
    vi.spyOn(Math, "random").mockReturnValue(0);
    const name = generateName("Berserker", "Light");
    expect(startsWithAny(name, DEFAULT_PREFIXES)).toBe(true);
  });

  it("uses harsh pool for harsh element + neutral class", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const name = generateName("Ranger", "Fire");
    expect(startsWithAny(name, HARSH_PREFIXES)).toBe(true);
  });

  it("uses flowing pool for flowing element + neutral class", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const name = generateName("Ranger", "Nature");
    expect(startsWithAny(name, FLOWING_PREFIXES)).toBe(true);
  });
});

// ============================================================
// generateTitle
// ============================================================

describe("generateTitle", () => {
  it("returns element + className format", () => {
    const title = generateTitle(
      { className: "Berserker" } as unknown as Archetype,
      { element: "Fire" } as unknown as ElementAffinity,
    );
    expect(title).toBe("Fire Berserker");
  });

  it("works with different archetype and element", () => {
    const title = generateTitle(
      { className: "Sage" } as unknown as Archetype,
      { element: "Shadow" } as unknown as ElementAffinity,
    );
    expect(title).toBe("Shadow Sage");
  });
});
