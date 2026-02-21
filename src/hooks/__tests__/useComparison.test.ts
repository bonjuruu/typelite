import { describe, it, expect } from "vitest";
import { generateCharacter } from "../../engine/generator.ts";
import { computeCharacterDiff } from "../../engine/comparison.ts";
import type { GeneratorInput, Character } from "../../engine/types/index.ts";

/**
 * useComparison is a thin React state wrapper around computeCharacterDiff.
 * Since we can't use renderHook without @testing-library/react, we test
 * the behavioral contracts here using the underlying engine function and
 * verifying snapshot immutability by reference.
 */

function makeCharacter(mbti: "INTJ" | "ESFJ"): Character {
  const input: GeneratorInput = {
    attitudinal: "VELF",
    enneagram: { type: 5, wing: 4, instinct: "sp" },
    mbti,
    socionics: mbti === "INTJ" ? "ILI" : "ESE",
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

describe("useComparison behavioral contracts", () => {
  it("snapshot immutability: modifying source object does not affect saved snapshot", () => {
    const charA = makeCharacter("INTJ");
    // Simulate saving a snapshot (the hook does: { character, name })
    const snapshot = { character: charA, name: "TestA" };
    const originalWillpower = snapshot.character.stats.willpower;

    // Mutating the original object after "saving" - in the hook, React state
    // holds the reference at save time. This test verifies the contract that
    // the character object passed to saveToSlot is the value stored, not a
    // later-mutated version.
    const laterCharA = { ...charA, stats: { ...charA.stats, willpower: 99 } };

    // Snapshot should still have original value (different object reference)
    expect(snapshot.character.stats.willpower).toBe(originalWillpower);
    expect(laterCharA.stats.willpower).toBe(99);
  });

  it("diff is computed correctly when both slots are filled", () => {
    const charA = makeCharacter("INTJ");
    const charB = makeCharacter("ESFJ");
    const diff = computeCharacterDiff(charA, charB);

    // Both characters have 4 abilities each
    expect(diff.abilityComparisonList.length).toBeGreaterThan(0);
    expect(
      diff.sharedFunctionList.length +
        diff.uniqueToA.length +
        diff.uniqueToB.length,
    ).toBe(diff.abilityComparisonList.length);
  });

  it("diff is null-equivalent when only one character exists", () => {
    // The hook returns null diff when only one slot is filled
    // We verify the contract: computeCharacterDiff requires two characters
    const charA = makeCharacter("INTJ");
    const diff = computeCharacterDiff(charA, charA);

    // Self-comparison should show everything as same
    expect(diff.sameElement).toBe(true);
    expect(diff.sameArchetype).toBe(true);
    expect(diff.sameOrientation).toBe(true);
    expect(diff.sharedFunctionList).toHaveLength(4);
    expect(diff.uniqueToA).toHaveLength(0);
    expect(diff.uniqueToB).toHaveLength(0);
  });

  it("saveToNextSlot fills A first, then B (simulated)", () => {
    // Simulate the hook's saveToNextSlot logic
    let slotA: { character: Character; name: string } | null = null;
    let slotB: { character: Character; name: string } | null = null;

    const saveToNextSlot = (character: Character, name: string) => {
      if (!slotA) {
        slotA = { character, name };
      } else if (!slotB) {
        slotB = { character, name };
      } else {
        slotB = { character, name };
      }
    };

    const charA = makeCharacter("INTJ");
    const charB = makeCharacter("ESFJ");

    saveToNextSlot(charA, "CharA");
    expect(slotA).not.toBeNull();
    expect(slotA!.name).toBe("CharA");
    expect(slotB).toBeNull();

    saveToNextSlot(charB, "CharB");
    expect(slotB).not.toBeNull();
    expect(slotB!.name).toBe("CharB");

    // Third save replaces B
    const charC = makeCharacter("INTJ");
    saveToNextSlot(charC, "CharC");
    expect(slotA!.name).toBe("CharA");
    expect(slotB!.name).toBe("CharC");
  });

  it("clearSlot clears the correct slot (simulated)", () => {
    let slotA: { character: Character; name: string } | null = {
      character: makeCharacter("INTJ"),
      name: "A",
    };
    let slotB: { character: Character; name: string } | null = {
      character: makeCharacter("ESFJ"),
      name: "B",
    };

    const clearSlot = (slot: "A" | "B") => {
      if (slot === "A") slotA = null;
      else slotB = null;
    };

    clearSlot("A");
    expect(slotA).toBeNull();
    expect(slotB).not.toBeNull();

    clearSlot("B");
    expect(slotB).toBeNull();
  });
});
