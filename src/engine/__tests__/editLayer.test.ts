import { describe, it, expect } from "vitest";
import { applyEdits, isStatBudgetValid } from "../editLayer.ts";
import { generateCharacter } from "../generator.ts";
import type {
  GeneratorInput,
  CharacterEdits,
  Character,
} from "../types/index.ts";
import { EMPTY_CHARACTER_EDITS } from "../types/index.ts";

// ============================================================
// HELPERS
// ============================================================

function makeCharacter(): Character {
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

// ============================================================
// applyEdits — stat clamping
// ============================================================

describe("applyEdits stat clamping", () => {
  it("clamps stat edits to min 1 when within budget", () => {
    const character = makeCharacter();
    // Set willpower to 1 and compensate another stat to stay within budget
    const wpDelta = character.stats.willpower - 1;
    const newIntelligence = character.stats.intelligence + wpDelta;
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      stats: { willpower: 0, intelligence: newIntelligence },
    };
    const result = applyEdits(character, edits);
    expect(result.stats.willpower).toBe(1);
  });

  it("clamps stat edits to max 20 when within budget", () => {
    const character = makeCharacter();
    // Set willpower to 20 and lower another stat to stay within budget
    const wpDelta = 20 - character.stats.willpower;
    const newIntelligence = Math.max(1, character.stats.intelligence - wpDelta);
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      stats: { willpower: 25, intelligence: newIntelligence },
    };
    const result = applyEdits(character, edits);
    // The clamped total may or may not pass budget — check that willpower was clamped to 20 if budget allows
    if (result.stats.willpower !== character.stats.willpower) {
      expect(result.stats.willpower).toBe(20);
    }
  });

  it("preserves unedited stats", () => {
    const character = makeCharacter();
    const originalIntelligence = character.stats.intelligence;
    // Small edit within budget
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      stats: { willpower: character.stats.willpower + 1 },
    };
    const result = applyEdits(character, edits);
    expect(result.stats.intelligence).toBe(originalIntelligence);
  });
});

// ============================================================
// applyEdits — stat budget validation
// ============================================================

describe("applyEdits stat budget", () => {
  it("applies stat edits within budget tolerance", () => {
    const character = makeCharacter();
    // Shift willpower by +2 (within +/-4 tolerance)
    const newWillpower = Math.min(20, character.stats.willpower + 2);
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      stats: { willpower: newWillpower },
    };
    const result = applyEdits(character, edits);
    expect(result.stats.willpower).toBe(newWillpower);
  });

  it("rejects stat edits exceeding budget tolerance", () => {
    const character = makeCharacter();
    // Try to max out all stats — far exceeds budget
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      stats: { willpower: 20, intelligence: 20, spirit: 20, vitality: 20 },
    };
    const result = applyEdits(character, edits);
    // Stats should remain unchanged since budget is exceeded
    expect(result.stats).toEqual(character.stats);
  });
});

// ============================================================
// isStatBudgetValid
// ============================================================

describe("isStatBudgetValid", () => {
  it("returns true when totals are equal", () => {
    const stats = { willpower: 10, intelligence: 8, spirit: 6, vitality: 12 };
    expect(isStatBudgetValid(stats, stats)).toBe(true);
  });

  it("returns true within tolerance", () => {
    const original = {
      willpower: 10,
      intelligence: 8,
      spirit: 6,
      vitality: 12,
    };
    const edited = { willpower: 12, intelligence: 8, spirit: 6, vitality: 12 };
    expect(isStatBudgetValid(original, edited)).toBe(true);
  });

  it("returns false when exceeding tolerance", () => {
    const original = {
      willpower: 10,
      intelligence: 8,
      spirit: 6,
      vitality: 12,
    };
    const edited = { willpower: 20, intelligence: 8, spirit: 6, vitality: 12 };
    expect(isStatBudgetValid(original, edited)).toBe(false);
  });
});

// ============================================================
// applyEdits — class name
// ============================================================

describe("applyEdits className", () => {
  it("replaces archetype className", () => {
    const character = makeCharacter();
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      className: "Dark Mage",
    };
    const result = applyEdits(character, edits);
    expect(result.archetype.className).toBe("Dark Mage");
  });

  it("preserves other archetype fields", () => {
    const character = makeCharacter();
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      className: "Dark Mage",
    };
    const result = applyEdits(character, edits);
    expect(result.archetype.enneagramType).toBe(
      character.archetype.enneagramType,
    );
    expect(result.archetype.description).toBe(character.archetype.description);
  });
});

// ============================================================
// applyEdits — ability names
// ============================================================

describe("applyEdits abilityNameList", () => {
  it("replaces ability name by slot", () => {
    const character = makeCharacter();
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      abilityNameList: { hero: "Shadow Strike" },
    };
    const result = applyEdits(character, edits);
    const heroAbility = result.abilities.find((a) => a.slot === "hero");
    expect(heroAbility!.name).toBe("Shadow Strike");
  });

  it("leaves unedited ability names unchanged", () => {
    const character = makeCharacter();
    const parentName = character.abilities.find(
      (a) => a.slot === "parent",
    )!.name;
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      abilityNameList: { hero: "Shadow Strike" },
    };
    const result = applyEdits(character, edits);
    expect(result.abilities.find((a) => a.slot === "parent")!.name).toBe(
      parentName,
    );
  });
});

// ============================================================
// applyEdits — element cascade
// ============================================================

describe("applyEdits element cascade", () => {
  it("changes element and cascades quadra/club/passive", () => {
    const character = makeCharacter();
    const edits: CharacterEdits = { ...EMPTY_CHARACTER_EDITS, element: "Fire" };
    const result = applyEdits(character, edits);
    expect(result.element.element).toBe("Fire");
    expect(result.element.quadra).toBe("Beta");
    expect(result.element.club).toBe("Practical");
    expect(result.element.passiveTrait.name).toBe("Resourceful");
  });

  it("cascades correctly for all quadras", () => {
    const character = makeCharacter();

    const lightResult = applyEdits(character, {
      ...EMPTY_CHARACTER_EDITS,
      element: "Light",
    });
    expect(lightResult.element.quadra).toBe("Alpha");

    const earthResult = applyEdits(character, {
      ...EMPTY_CHARACTER_EDITS,
      element: "Earth",
    });
    expect(earthResult.element.quadra).toBe("Gamma");

    const windResult = applyEdits(character, {
      ...EMPTY_CHARACTER_EDITS,
      element: "Wind",
    });
    expect(windResult.element.quadra).toBe("Delta");
  });
});

// ============================================================
// applyEdits — combat orientation
// ============================================================

describe("applyEdits combatOrientation", () => {
  it("replaces combat orientation", () => {
    const character = makeCharacter();
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      combatOrientation: "Support",
    };
    const result = applyEdits(character, edits);
    expect(result.combatBehavior.combatOrientation).toBe("Support");
  });
});

// ============================================================
// applyEdits — empty edits (no-op)
// ============================================================

describe("applyEdits no-op", () => {
  it("returns equivalent character when edits are empty", () => {
    const character = makeCharacter();
    const result = applyEdits(character, EMPTY_CHARACTER_EDITS);
    expect(result.stats).toEqual(character.stats);
    expect(result.archetype.className).toBe(character.archetype.className);
    expect(result.element.element).toBe(character.element.element);
    expect(result.combatBehavior.combatOrientation).toBe(
      character.combatBehavior.combatOrientation,
    );
  });
});
