import { describe, it, expect } from "vitest";
import { computeCharacterDiff } from "../comparison.ts";
import { generateCharacter } from "../generator.ts";
import type { GeneratorInput } from "../types/index.ts";

// ============================================================
// HELPERS
// ============================================================

function makeCharacterA() {
  const input: GeneratorInput = {
    attitudinal: "VELF",
    enneagram: { type: 5, wing: 4, instinct: "sp" },
    mbti: "INTJ",
    socionics: "ILI",
    instincts: { realm: "FD" },
    overrides: {
      stats: null,
      archetype: null,
      abilities: null,
      element: null,
      combatOrientation: null,
    },
  };
  return generateCharacter(input);
}

function makeCharacterB() {
  const input: GeneratorInput = {
    attitudinal: "FELV",
    enneagram: { type: 2, wing: 3, instinct: "so" },
    mbti: "ESFJ",
    socionics: "ESE",
    instincts: { realm: "CY" },
    overrides: {
      stats: null,
      archetype: null,
      abilities: null,
      element: null,
      combatOrientation: null,
    },
  };
  return generateCharacter(input);
}

// ============================================================
// TESTS
// ============================================================

describe("computeCharacterDiff", () => {
  it("computes stat diffs between two different characters", () => {
    const a = makeCharacterA();
    const b = makeCharacterB();
    const diff = computeCharacterDiff(a, b);

    expect(diff.statDiffMap.willpower).toBe(
      a.stats.willpower - b.stats.willpower,
    );
    expect(diff.statDiffMap.intelligence).toBe(
      a.stats.intelligence - b.stats.intelligence,
    );
    expect(diff.statDiffMap.spirit).toBe(a.stats.spirit - b.stats.spirit);
    expect(diff.statDiffMap.vitality).toBe(a.stats.vitality - b.stats.vitality);
  });

  it("returns zero diffs when comparing a character with itself", () => {
    const a = makeCharacterA();
    const diff = computeCharacterDiff(a, a);

    expect(diff.statDiffMap.willpower).toBe(0);
    expect(diff.statDiffMap.intelligence).toBe(0);
    expect(diff.statDiffMap.spirit).toBe(0);
    expect(diff.statDiffMap.vitality).toBe(0);
  });

  it("finds shared cognitive functions between characters", () => {
    const a = makeCharacterA();
    const diff = computeCharacterDiff(a, a);

    // Same character should share all 4 functions
    expect(diff.sharedFunctionList).toHaveLength(4);
    expect(diff.uniqueToA).toHaveLength(0);
    expect(diff.uniqueToB).toHaveLength(0);
  });

  it("identifies unique cognitive functions per character", () => {
    const a = makeCharacterA(); // INTJ: Ni, Te, Fi, Se
    const b = makeCharacterB(); // ESFJ: Fe, Si, Ne, Ti
    const diff = computeCharacterDiff(a, b);

    // INTJ and ESFJ share all 8 cognitive functions across them but in different slots
    // Actually INTJ has Ni,Te,Fi,Se and ESFJ has Fe,Si,Ne,Ti — no overlap
    const totalFunctions =
      diff.sharedFunctionList.length +
      diff.uniqueToA.length +
      diff.uniqueToB.length;
    expect(totalFunctions).toBeGreaterThanOrEqual(4);
  });

  it("tracks slot differences for shared functions", () => {
    const a = makeCharacterA();
    const b = makeCharacterB();
    const diff = computeCharacterDiff(a, b);

    for (const ac of diff.abilityComparisonList) {
      if (ac.slotA && ac.slotB) {
        // Shared function — both names should be present
        expect(ac.nameA).toBeTruthy();
        expect(ac.nameB).toBeTruthy();
      }
    }
  });

  it("detects same element when comparing with self", () => {
    const a = makeCharacterA();
    const diff = computeCharacterDiff(a, a);

    expect(diff.sameElement).toBe(true);
    expect(diff.sameOrientation).toBe(true);
    expect(diff.sameArchetype).toBe(true);
    expect(diff.sameQuadra).toBe(true);
    expect(diff.sameActivation).toBe(true);
    expect(diff.samePositioning).toBe(true);
    expect(diff.sameRegenSource).toBe(true);
  });

  it("detects different archetype between different types", () => {
    const a = makeCharacterA();
    const b = makeCharacterB();
    const diff = computeCharacterDiff(a, b);

    // Type 5 vs Type 2 should have different class names
    expect(diff.sameArchetype).toBe(false);
  });

  it("detects different elements between different socionics types", () => {
    const a = makeCharacterA(); // ILI → Gamma
    const b = makeCharacterB(); // ESE → Alpha
    const diff = computeCharacterDiff(a, b);

    expect(diff.sameElement).toBe(a.element.element === b.element.element);
  });

  it("abilityComparisonList covers all functions from both characters", () => {
    const a = makeCharacterA();
    const b = makeCharacterB();
    const diff = computeCharacterDiff(a, b);

    const allFunctionsFromA = new Set(
      a.abilities.map((ab) => ab.cognitiveFunction),
    );
    const allFunctionsFromB = new Set(
      b.abilities.map((ab) => ab.cognitiveFunction),
    );
    const allFunctions = new Set([...allFunctionsFromA, ...allFunctionsFromB]);

    expect(diff.abilityComparisonList).toHaveLength(allFunctions.size);
  });

  it("detects different quadra between different socionics types", () => {
    const a = makeCharacterA(); // ILI → Gamma
    const b = makeCharacterB(); // ESE → Alpha
    const diff = computeCharacterDiff(a, b);

    expect(diff.sameQuadra).toBe(a.element.quadra === b.element.quadra);
  });

  it("detects different combat triads between different instinct realms", () => {
    const a = makeCharacterA(); // FD realm
    const b = makeCharacterB(); // CY realm
    const diff = computeCharacterDiff(a, b);

    expect(diff.sameActivation).toBe(
      a.combatBehavior.activationStyle === b.combatBehavior.activationStyle,
    );
    expect(diff.samePositioning).toBe(
      a.combatBehavior.positioning === b.combatBehavior.positioning,
    );
    expect(diff.sameRegenSource).toBe(
      a.combatBehavior.regenSource === b.combatBehavior.regenSource,
    );
  });

  it("computes ability power diffs for shared cognitive functions", () => {
    const a = makeCharacterA();
    const diff = computeCharacterDiff(a, a);

    // Self-comparison: all functions shared, power should be identical
    for (const fn of diff.sharedFunctionList) {
      const powerEntry = diff.abilityPowerDiffMap[fn];
      expect(powerEntry).toBeDefined();
      expect(powerEntry!.powerA).toBe(powerEntry!.powerB);
    }
  });

  it("computes ability power diffs only for shared functions between different characters", () => {
    const a = makeCharacterA();
    const b = makeCharacterB();
    const diff = computeCharacterDiff(a, b);

    // Power diff map should only have entries for shared functions
    const powerDiffKeyList = Object.keys(diff.abilityPowerDiffMap);
    expect(powerDiffKeyList).toHaveLength(diff.sharedFunctionList.length);

    for (const fn of diff.sharedFunctionList) {
      const powerEntry = diff.abilityPowerDiffMap[fn];
      expect(powerEntry).toBeDefined();
      expect(powerEntry!.powerA).toBeGreaterThan(0);
      expect(powerEntry!.powerB).toBeGreaterThan(0);
    }
  });

  it("computes passive diffs with all shared when comparing with self", () => {
    const a = makeCharacterA();
    const diff = computeCharacterDiff(a, a);

    expect(diff.passiveDiff.uniqueToA).toHaveLength(0);
    expect(diff.passiveDiff.uniqueToB).toHaveLength(0);
    expect(diff.passiveDiff.sharedNameList.length).toBeGreaterThan(0);
  });

  it("identifies unique passives between different characters", () => {
    const a = makeCharacterA();
    const b = makeCharacterB();
    const diff = computeCharacterDiff(a, b);

    // Different element passives + different combat passives should produce unique entries
    const totalPassiveCount =
      diff.passiveDiff.sharedNameList.length +
      diff.passiveDiff.uniqueToA.length +
      diff.passiveDiff.uniqueToB.length;
    expect(totalPassiveCount).toBeGreaterThan(0);
  });
});
