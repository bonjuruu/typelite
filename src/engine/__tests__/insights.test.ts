import { describe, it, expect } from "vitest";
import { generateSystemInsights } from "../insights.ts";
import { generateCharacter } from "../generator.ts";
import type { GeneratorInput } from "../types/index.ts";

// ============================================================
// HELPERS
// ============================================================

function makeNullInput(): GeneratorInput {
  return {
    attitudinal: null,
    enneagram: null,
    mbti: null,
    socionics: null,
    instincts: null,
    overrides: {
      stats: null,
      archetype: null,
      abilities: null,
      element: null,
      combatOrientation: null,
    },
  };
}

function buildCharacter(
  overrides: Partial<GeneratorInput>,
): ReturnType<typeof generateCharacter> {
  return generateCharacter({ ...makeNullInput(), ...overrides });
}

// ============================================================
// generateSystemInsights
// ============================================================

describe("generateSystemInsights", () => {
  it("returns empty array when fewer than 2 systems are active", () => {
    const character = buildCharacter({ attitudinal: "VELF" });

    expect(generateSystemInsights(character)).toEqual([]);
  });

  it("returns at most 4 insights", () => {
    const character = buildCharacter({
      attitudinal: "VELF",
      enneagram: { type: 5, wing: 4, instinct: "sp" },
      mbti: "INTJ",
      socionics: "ILI",
      instincts: { realm: "FD" },
    });

    const insightList = generateSystemInsights(character);

    expect(insightList.length).toBeLessThanOrEqual(4);
    expect(insightList.length).toBeGreaterThan(0);
  });

  it("returns insights sorted by priority (highest first)", () => {
    // VELF + INTJ: Ni-Hero scales off willpower, which is highest stat (14)
    // This should trigger both Priority 10 (3-system convergence) and Priority 9 (AP+Hero match)
    const character = buildCharacter({
      attitudinal: "VELF",
      mbti: "INTJ",
      socionics: "ILI",
    });

    const insightList = generateSystemInsights(character);

    // Priority 10 insight (3-system convergence) should appear before lower-priority ones
    expect(insightList.length).toBeGreaterThan(0);
    expect(insightList[0]).toContain("Willpower");
  });

  // Priority 10: 3+ system convergence (AP highest stat = Hero scaling stat + Socionics club)
  it("detects 3-system convergence when Hero scaling stat matches highest AP stat", () => {
    // VELF: willpower=14 (highest). INTJ Ni-Hero scales off willpower. ILI = Gamma Researcher.
    const character = buildCharacter({
      attitudinal: "VELF",
      mbti: "INTJ",
      socionics: "ILI",
    });

    const insightList = generateSystemInsights(character);

    expect(
      insightList.some((i) => i.includes("triple-layered convergence")),
    ).toBe(true);
  });

  // Priority 9: AP 1st stat matches Hero scaling stat
  it("detects AP-Hero stat alignment", () => {
    // VELF: willpower=14 (highest). INTJ Ni-Hero scales off willpower.
    const character = buildCharacter({
      attitudinal: "VELF",
      mbti: "INTJ",
    });

    const insightList = generateSystemInsights(character);

    expect(insightList.some((i) => i.includes("Ni-Hero ability"))).toBe(true);
  });

  // Priority 9.5: Tritype center coverage (all 3 centers)
  it("detects tritype covering all three enneagram centers", () => {
    // 5 = Head, 2 = Heart, 8 = Gut → all three centers
    const character = buildCharacter({
      attitudinal: "VELF",
      enneagram: {
        type: 5,
        wing: 4,
        instinct: "sp",
        tritype: [5, 2, 8],
      },
    });

    const insightList = generateSystemInsights(character);

    expect(insightList.some((i) => i.includes("all three centers"))).toBe(true);
  });

  // Priority 8: Class-function thematic dissonance
  it("detects aggressive class with methodical Hero function", () => {
    // Berserker (type 8) + Ti-Hero (INTP) → aggressive class + methodical function
    const character = buildCharacter({
      enneagram: { type: 8, wing: 7, instinct: "sx" },
      mbti: "INTP",
    });

    const insightList = generateSystemInsights(character);

    expect(insightList.some((i) => i.includes("disciplined chaos agent"))).toBe(
      true,
    );
  });

  it("detects support class with aggressive Hero function", () => {
    // Cleric (type 2) + Se-Hero (ESTP) → support class + aggressive function
    const character = buildCharacter({
      enneagram: { type: 2, wing: 1, instinct: "so" },
      mbti: "ESTP",
    });

    const insightList = generateSystemInsights(character);

    expect(
      insightList.some((i) => i.includes("aggressive primary ability")),
    ).toBe(true);
  });

  // Priority 7: AP 4th stat matches Inferior scaling stat
  it("detects AP lowest stat matching Inferior scaling stat", () => {
    // VELF: F=vitality=4 (lowest). INTJ Se-Inferior scales off vitality.
    const character = buildCharacter({
      attitudinal: "VELF",
      mbti: "INTJ",
    });

    const insightList = generateSystemInsights(character);

    expect(
      insightList.some(
        (i) => i.includes("Inferior") || i.includes("thin base, big spikes"),
      ),
    ).toBe(true);
  });

  // Priority 6: Quadra-class thematic alignment
  it("detects quadra-class alignment", () => {
    // Beta quadra (SLE) + Berserker (type 8) → Beta aligns with Berserker/Warlord
    const character = buildCharacter({
      enneagram: { type: 8, wing: 7, instinct: "sx" },
      socionics: "SLE",
    });

    const insightList = generateSystemInsights(character);

    expect(insightList.some((i) => i.includes("thematic alignment"))).toBe(
      true,
    );
  });

  // Priority 4.5: Instinct tritype cross-center passives
  it("detects instinct tritype cross-center passives", () => {
    const character = buildCharacter({
      attitudinal: "VELF",
      instincts: {
        realm: "FD",
        tritype: ["FD", "AY", "SS"],
      },
    });

    const insightList = generateSystemInsights(character);

    expect(insightList.some((i) => i.includes("cross-center passive"))).toBe(
      true,
    );
  });

  // Priority 4: Combat orientation + class dissonance
  it("detects Frontline orientation with strategist class", () => {
    // SUR realm (Frontline) + Sage (type 5) → frontline intellectual
    const character = buildCharacter({
      enneagram: { type: 5, wing: 4, instinct: "sp" },
      instincts: { realm: "FD" },
    });

    const insightList = generateSystemInsights(character);

    expect(insightList.some((i) => i.includes("frontline intellectual"))).toBe(
      true,
    );
  });

  // Priority 3.5: Tritype stat blending
  it("includes tritype stat blending insight when tritype is active", () => {
    const character = buildCharacter({
      attitudinal: "VELF",
      enneagram: {
        type: 5,
        wing: 4,
        instinct: "sp",
        tritype: [5, 2, 9],
      },
    });

    const insightList = generateSystemInsights(character);

    expect(
      insightList.some((i) => i.includes("40%") && i.includes("20%")),
    ).toBe(true);
  });

  // Priority 3: Club passive + class playstyle synergy
  it("detects club-class synergy", () => {
    // Researcher club (ILI = Gamma Researcher) + Sage (type 5) → Researcher + Sage synergy
    const character = buildCharacter({
      enneagram: { type: 5, wing: 4, instinct: "sp" },
      socionics: "ILI",
    });

    const insightList = generateSystemInsights(character);

    expect(insightList.some((i) => i.includes("Researcher"))).toBe(true);
  });

  it("returns all strings (no undefined or empty entries)", () => {
    const character = buildCharacter({
      attitudinal: "VELF",
      enneagram: { type: 5, wing: 4, instinct: "sp", tritype: [5, 2, 8] },
      mbti: "INTJ",
      socionics: "ILI",
      instincts: { realm: "FD", tritype: ["FD", "AY", "SS"] },
    });

    const insightList = generateSystemInsights(character);

    for (const insight of insightList) {
      expect(typeof insight).toBe("string");
      expect(insight.length).toBeGreaterThan(0);
    }
  });
});
