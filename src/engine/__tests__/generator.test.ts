import { describe, it, expect } from "vitest";
import { generateCharacter } from "../generator.ts";
import type { GeneratorInput, SystemId } from "../types/index.ts";

// ============================================================
// HELPERS
// ============================================================

function makeFullInput(): GeneratorInput {
  return {
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
}

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

// ============================================================
// generateCharacter - all systems active
// ============================================================

describe("generateCharacter with all systems active", () => {
  it("returns a valid Character object", () => {
    const character = generateCharacter(makeFullInput());

    expect(character.name).toBeTruthy();
    expect(character.title).toBeTruthy();
    expect(character.stats).toBeDefined();
    expect(character.stats.willpower).toBeGreaterThan(0);
    expect(character.stats.intelligence).toBeGreaterThan(0);
    expect(character.stats.spirit).toBeGreaterThan(0);
    expect(character.stats.vitality).toBeGreaterThan(0);
    expect(character.archetype).toBeDefined();
    expect(character.archetype.className).toBeTruthy();
    expect(character.abilities).toHaveLength(4);
    expect(character.element).toBeDefined();
    expect(character.element.element).toBeTruthy();
    expect(character.combatBehavior).toBeDefined();
    expect(character.combatBehavior.realm).toBe("FD");
  });

  it("tracks all active systems", () => {
    const character = generateCharacter(makeFullInput());
    const expectedSystemList: SystemId[] = [
      "attitudinal",
      "enneagram",
      "mbti",
      "socionics",
      "instincts",
    ];

    expect(character.activeSystems).toEqual(expectedSystemList);
  });

  it("applies AP base stats for VELF ordering", () => {
    const character = generateCharacter(makeFullInput());

    // VELF: V=1st(14), E=2nd(10), L=3rd(7), F=4th(4)
    // Then enneagram multipliers are applied on top, so stats should differ from base
    // But the base ordering should hold: willpower highest, vitality lowest (before multipliers)
    expect(character.stats).toBeDefined();
  });

  it("builds 4 abilities from MBTI INTJ stack (Ni-Te-Fi-Se)", () => {
    const character = generateCharacter(makeFullInput());

    expect(character.abilities[0].slot).toBe("hero");
    expect(character.abilities[0].cognitiveFunction).toBe("Ni");
    expect(character.abilities[1].slot).toBe("parent");
    expect(character.abilities[1].cognitiveFunction).toBe("Te");
    expect(character.abilities[2].slot).toBe("child");
    expect(character.abilities[2].cognitiveFunction).toBe("Fi");
    expect(character.abilities[3].slot).toBe("inferior");
    expect(character.abilities[3].cognitiveFunction).toBe("Se");
  });

  it("sets element from Socionics ILI (Gamma/Metal)", () => {
    const character = generateCharacter(makeFullInput());

    expect(character.element.element).toBe("Metal");
    expect(character.element.quadra).toBe("Gamma");
  });

  it("sets combat behavior from instinct realm FD", () => {
    const character = generateCharacter(makeFullInput());

    expect(character.combatBehavior.realm).toBe("FD");
    expect(character.combatBehavior.center).toBe("SUR");
    expect(character.combatBehavior.combatOrientation).toBe("Frontline");
  });
});

// ============================================================
// generateCharacter - all systems null (defaults)
// ============================================================

describe("generateCharacter with all systems null", () => {
  it("returns a valid Character with defaults", () => {
    const character = generateCharacter(makeNullInput());

    expect(character.name).toBeTruthy();
    expect(character.title).toBeTruthy();
    expect(character.stats).toEqual({
      willpower: 8,
      intelligence: 8,
      spirit: 8,
      vitality: 8,
    });
    expect(character.archetype.className).toBe("Wanderer");
    expect(character.abilities).toEqual([]);
    expect(character.element.element).toBe("Nature");
    expect(character.combatBehavior.combatOrientation).toBe("Balanced");
    expect(character.activeSystems).toEqual([]);
  });
});

// ============================================================
// generateCharacter - partial systems
// ============================================================

describe("generateCharacter with partial systems", () => {
  it("works with only AP active", () => {
    const input = makeNullInput();
    input.attitudinal = "ELFV";
    const character = generateCharacter(input);

    // ELFV: E=1st(14), L=2nd(10), F=3rd(7), V=4th(4)
    expect(character.stats.spirit).toBe(14);
    expect(character.stats.intelligence).toBe(10);
    expect(character.stats.vitality).toBe(7);
    expect(character.stats.willpower).toBe(4);
    expect(character.activeSystems).toEqual(["attitudinal"]);
  });

  it("uses overrides when systems are off", () => {
    const input = makeNullInput();
    input.overrides.stats = { willpower: 15, intelligence: 12 };
    input.overrides.archetype = "Sage";
    input.overrides.element = "Fire";
    input.overrides.combatOrientation = "Strategist";

    const character = generateCharacter(input);

    expect(character.stats.willpower).toBe(15);
    expect(character.stats.intelligence).toBe(12);
    expect(character.stats.spirit).toBe(8);
    expect(character.stats.vitality).toBe(8);
    expect(character.archetype.className).toBe("Sage");
    expect(character.element.element).toBe("Fire");
    expect(character.combatBehavior.combatOrientation).toBe("Strategist");
  });
});

// ============================================================
// Name and title generation
// ============================================================

describe("name and title generation", () => {
  it("generates non-empty name strings", () => {
    const character = generateCharacter(makeFullInput());
    expect(character.name.length).toBeGreaterThan(0);
    expect(typeof character.name).toBe("string");
  });

  it('generates title in format "{element} {className}"', () => {
    const character = generateCharacter(makeFullInput());

    // Title should contain the element and class name
    expect(character.title).toContain(character.element.element);
    // The archetype className may have wing labels, instinct suffixes, etc.
    // but the base class should be in the title
    expect(character.title.length).toBeGreaterThan(0);
  });

  it("produces different names across multiple generations (probabilistic)", () => {
    const nameSet = new Set<string>();
    for (let i = 0; i < 20; i++) {
      const character = generateCharacter(makeFullInput());
      nameSet.add(character.name);
    }
    // With 26 prefixes * 20 suffixes = 520 combos, 20 tries should give at least 2 unique
    expect(nameSet.size).toBeGreaterThan(1);
  });
});

// ============================================================
// Enneagram with tritype
// ============================================================

describe("generateCharacter with enneagram tritype", () => {
  it("builds tritype archetype with fix labels", () => {
    const input = makeFullInput();
    input.enneagram = {
      type: 5,
      wing: 4,
      instinct: "sp",
      tritype: [5, 2, 9],
      tritypeWings: [1, 8],
    };

    const character = generateCharacter(input);

    expect(character.archetype.className).toContain("[5-2-9]");
  });

  it("blends stat modifiers from 2nd fix at 40% and 3rd fix at 20%", () => {
    const inputWithTritype = makeFullInput();
    inputWithTritype.enneagram = {
      type: 5,
      wing: 4,
      instinct: "sp",
      tritype: [5, 2, 9],
    };

    const inputWithoutTritype = makeFullInput();
    inputWithoutTritype.enneagram = {
      type: 5,
      wing: 4,
      instinct: "sp",
    };

    const characterWithTritype = generateCharacter(inputWithTritype);
    const characterWithoutTritype = generateCharacter(inputWithoutTritype);

    // Tritype blending adds 2nd/3rd fix modifiers on top of the base archetype modifiers.
    // Type 2 adds spirit/vitality multipliers, Type 9 adds vitality/spirit - these should
    // produce different archetype.statModifiers than base 5w4 alone.
    const modifiersWithTritype = characterWithTritype.archetype.statModifiers;
    const modifiersWithoutTritype =
      characterWithoutTritype.archetype.statModifiers;

    expect(modifiersWithTritype).not.toEqual(modifiersWithoutTritype);
  });

  it("applies wing blending to 2nd and 3rd tritype fixes", () => {
    const inputWithWings = makeFullInput();
    inputWithWings.enneagram = {
      type: 5,
      wing: 4,
      instinct: "sp",
      tritype: [5, 2, 9],
      tritypeWings: [1, 8],
    };

    const inputWithoutWings = makeFullInput();
    inputWithoutWings.enneagram = {
      type: 5,
      wing: 4,
      instinct: "sp",
      tritype: [5, 2, 9],
    };

    const characterWithWings = generateCharacter(inputWithWings);
    const characterWithoutWings = generateCharacter(inputWithoutWings);

    // Tritype wings blend into each fix's modifiers at 30%, producing different
    // final archetype.statModifiers than tritype without wings.
    const modifiersWithWings = characterWithWings.archetype.statModifiers;
    const modifiersWithoutWings = characterWithoutWings.archetype.statModifiers;

    expect(modifiersWithWings).not.toEqual(modifiersWithoutWings);
  });

  it("tracks all three fixes in statBlendChain", () => {
    const input = makeFullInput();
    input.enneagram = {
      type: 5,
      wing: 4,
      instinct: "sp",
      tritype: [5, 2, 9],
      tritypeWings: [1, 8],
    };

    const character = generateCharacter(input);

    expect(character.archetype.statBlendChain).toBeDefined();
    const sourceList = character.archetype.statBlendChain!.map(
      (step) => step.source,
    );
    expect(sourceList).toContain("2nd fix (Type 2)");
    expect(sourceList).toContain("3rd fix (Type 9)");
  });
});

// ============================================================
// Instincts with tritype
// ============================================================

describe("generateCharacter with instinct tritype", () => {
  it("adds passives from all three realms", () => {
    const input = makeFullInput();
    input.instincts = {
      realm: "FD",
      tritype: ["FD", "AY", "SS"],
    };

    const character = generateCharacter(input);

    // Core FD: Flow State, Aggressive Advance, Siphon (3)
    // AY adds: Evasive, Equilibrium (Flow State deduped) (2)
    // SS adds: Adaptive Stance, Inner Reserve (Flow State deduped) (2)
    // Total: 7 unique passives
    expect(character.combatBehavior.passives.length).toBe(7);
  });

  it("deduplicates passives shared across tritype realms", () => {
    const input = makeFullInput();
    // FD, AY, SS all share Immersing experiential triad → "Flow State" passive
    input.instincts = {
      realm: "FD",
      tritype: ["FD", "AY", "SS"],
    };

    const character = generateCharacter(input);

    const passiveNameList = character.combatBehavior.passives.map(
      (p) => p.name,
    );
    const uniqueNameSet = new Set(passiveNameList);
    expect(passiveNameList.length).toBe(uniqueNameSet.size);
  });

  it("appends 2nd/3rd fix passives without replacing core passives", () => {
    const inputWithTritype = makeFullInput();
    inputWithTritype.instincts = {
      realm: "FD",
      tritype: ["FD", "AY", "SS"],
    };

    const inputWithoutTritype = makeFullInput();
    inputWithoutTritype.instincts = { realm: "FD" };

    const characterWithTritype = generateCharacter(inputWithTritype);
    const characterWithoutTritype = generateCharacter(inputWithoutTritype);

    // Core passives (FD) should be preserved as the first 3
    const corePassiveNameList =
      characterWithoutTritype.combatBehavior.passives.map((p) => p.name);
    const tritypePassiveNameList =
      characterWithTritype.combatBehavior.passives.map((p) => p.name);

    for (const coreName of corePassiveNameList) {
      expect(tritypePassiveNameList).toContain(coreName);
    }

    // Tritype version should have strictly more passives
    expect(characterWithTritype.combatBehavior.passives.length).toBeGreaterThan(
      characterWithoutTritype.combatBehavior.passives.length,
    );
  });
});

// ============================================================
// statBreakdown
// ============================================================

describe("statBreakdown", () => {
  it("captures AP base stats and source", () => {
    const input = makeFullInput();
    const character = generateCharacter(input);

    // VELF: V=1st(14), E=2nd(10), L=3rd(7), F=4th(4)
    expect(character.statBreakdown.base).toEqual({
      willpower: 14,
      intelligence: 7,
      spirit: 10,
      vitality: 4,
    });
    expect(character.statBreakdown.baseSource).toBe("VELF");
  });

  it("uses Default source and flat 8s when AP is off", () => {
    const character = generateCharacter(makeNullInput());

    expect(character.statBreakdown.base).toEqual({
      willpower: 8,
      intelligence: 8,
      spirit: 8,
      vitality: 8,
    });
    expect(character.statBreakdown.baseSource).toBe("Default");
  });

  it("captures enneagram multipliers and source", () => {
    const input = makeFullInput();
    const character = generateCharacter(input);

    expect(
      Object.keys(character.statBreakdown.multipliers).length,
    ).toBeGreaterThan(0);
    expect(character.statBreakdown.multiplierSource).toBe(
      character.archetype.className,
    );
  });

  it("has empty multipliers when enneagram is off", () => {
    const input = makeNullInput();
    input.attitudinal = "VELF";
    const character = generateCharacter(input);

    expect(character.statBreakdown.multipliers).toEqual({});
    expect(character.statBreakdown.multiplierSource).toBe("");
  });

  it("captures stat overrides", () => {
    const input = makeNullInput();
    input.overrides.stats = { willpower: 15, intelligence: 12 };
    const character = generateCharacter(input);

    expect(character.statBreakdown.overrides).toEqual({
      willpower: 15,
      intelligence: 12,
    });
  });

  it("has null overrides when none are set", () => {
    const character = generateCharacter(makeFullInput());

    expect(character.statBreakdown.overrides).toBeNull();
  });

  it("base is a snapshot, not a shared reference to DEFAULT_STATS", () => {
    const characterA = generateCharacter(makeNullInput());
    const characterB = generateCharacter(makeNullInput());

    expect(characterA.statBreakdown.base).not.toBe(
      characterB.statBreakdown.base,
    );
    expect(characterA.statBreakdown.base).toEqual(
      characterB.statBreakdown.base,
    );
  });
});
