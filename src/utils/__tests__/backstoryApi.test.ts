import { describe, it, expect } from "vitest";
import {
  buildTypologySection,
  buildCharacterSummary,
} from "../backstoryApi.ts";
import type { Character, TypologySource } from "../../engine/types/index.ts";

// ============================================================
// FIXTURES
// ============================================================

function makeTypologySource(
  overrides?: Partial<TypologySource>,
): TypologySource {
  return {
    attitudinal: null,
    mbti: null,
    socionics: null,
    enneagram: null,
    instincts: null,
    ...overrides,
  };
}

function makeCharacter(overrides?: Partial<Character>): Character {
  return {
    name: "test",
    title: "Shadow Analyst",
    stats: {
      willpower: 12,
      intelligence: 15,
      spirit: 8,
      vitality: 10,
    },
    statBreakdown: {
      base: { willpower: 10, intelligence: 10, spirit: 10, vitality: 10 },
      baseSource: "VLEF",
      multipliers: {},
      multiplierSource: "5w4",
      overrides: null,
    },
    archetype: {
      className: "Investigator",
      description: "A cerebral class.",
      enneagramType: 5,
      wing: 4,
      statModifiers: {},
      empoweredState: {
        name: "Clarity",
        description: "Gains focus.",
        statChanges: {},
      },
      stressedState: {
        name: "Withdrawal",
        description: "Retreats.",
        statChanges: {},
      },
      instinctPassive: {
        name: "SP Focus",
        description: "Conserves energy.",
        source: "dominant instinct (sp)",
      },
    },
    abilities: [
      {
        name: "Analyze",
        description: "Breaks down defenses.",
        slot: "hero",
        cognitiveFunction: "Ti",
        basePower: 20,
        scalingStat: "intelligence",
        tags: ["debuff", "single-target"],
      },
    ],
    element: {
      element: "Shadow",
      quadra: "Alpha",
      club: "Researcher",
      passiveTrait: {
        name: "Umbral Veil",
        description: "Reduces damage.",
        source: "element",
      },
    },
    combatBehavior: {
      realm: "FD",
      center: "SUR",
      combatOrientation: "Tactical",
      activationStyle: "Memorializing",
      positioning: "Escaping",
      regenSource: "Internalizing",
      passives: [
        {
          name: "Fortress",
          description: "Reduces damage taken.",
          source: "combat",
        },
      ],
    },
    activeSystems: ["attitudinal", "enneagram", "mbti"],
    typologySource: makeTypologySource({
      attitudinal: "VLEF",
      mbti: "INTP",
      enneagram: { type: 5, wing: 4, instinct: "sp" },
    }),
    ...overrides,
  };
}

// ============================================================
// buildTypologySection
// ============================================================

describe("buildTypologySection", () => {
  it("returns empty string when no systems are set", () => {
    const result = buildTypologySection(makeTypologySource());
    expect(result).toBe("");
  });

  it("includes AP type line with aspect details", () => {
    const result = buildTypologySection(
      makeTypologySource({ attitudinal: "VLEF" }),
    );
    expect(result).toContain("AP Type: VLEF");
    expect(result).toContain("V");
  });

  it("includes enneagram line with type, wing, and instinct", () => {
    const result = buildTypologySection(
      makeTypologySource({
        enneagram: { type: 5, wing: 4, instinct: "sp" },
      }),
    );
    expect(result).toContain("Enneagram: Type 5w4 sp");
  });

  it("includes tritype when present", () => {
    const result = buildTypologySection(
      makeTypologySource({
        enneagram: { type: 5, wing: 4, instinct: "sp", tritype: [5, 1, 3] },
      }),
    );
    expect(result).toContain("tritype 5-1-3");
  });

  it("includes Jungian type line", () => {
    const result = buildTypologySection(
      makeTypologySource({ mbti: "INTP" }),
    );
    expect(result).toContain("Jungian Type: INTP");
  });

  it("includes socionics line", () => {
    const result = buildTypologySection(
      makeTypologySource({ socionics: "LII" }),
    );
    expect(result).toContain("Socionics: LII");
  });

  it("includes instincts realm line", () => {
    const result = buildTypologySection(
      makeTypologySource({ instincts: { realm: "FD" } }),
    );
    expect(result).toContain("Expanded Instincts: FD");
  });

  it("includes instinct tritype when present", () => {
    const result = buildTypologySection(
      makeTypologySource({
        instincts: { realm: "FD", tritype: ["FD", "AY", "SS"] },
      }),
    );
    expect(result).toContain("tritype FD/AY/SS");
  });

  it("combines multiple system lines", () => {
    const result = buildTypologySection(
      makeTypologySource({
        attitudinal: "VLEF",
        mbti: "INTP",
        enneagram: { type: 5, wing: 4, instinct: "sp" },
      }),
    );
    const lineList = result.split("\n");
    expect(lineList.length).toBe(3);
  });
});

// ============================================================
// buildCharacterSummary
// ============================================================

describe("buildCharacterSummary", () => {
  it("includes character name", () => {
    const result = buildCharacterSummary(makeCharacter(), "Aldric");
    expect(result).toContain("Name: Aldric");
  });

  it("includes title", () => {
    const result = buildCharacterSummary(makeCharacter(), "Aldric");
    expect(result).toContain("Title: Shadow Analyst");
  });

  it("includes class and description", () => {
    const result = buildCharacterSummary(makeCharacter(), "Aldric");
    expect(result).toContain("Class: Investigator");
    expect(result).toContain("Class Description: A cerebral class.");
  });

  it("includes stats", () => {
    const result = buildCharacterSummary(makeCharacter(), "Aldric");
    expect(result).toContain("Stats: Willpower 12, Intelligence 15, Spirit 8, Vitality 10");
  });

  it("includes element", () => {
    const result = buildCharacterSummary(makeCharacter(), "Aldric");
    expect(result).toContain("Element: Shadow (Alpha quadra)");
  });

  it("includes combat behavior", () => {
    const result = buildCharacterSummary(makeCharacter(), "Aldric");
    expect(result).toContain("Combat: Tactical");
    expect(result).toContain("Memorializing activation");
  });

  it("includes archetype passives from legacy single field", () => {
    const result = buildCharacterSummary(makeCharacter(), "Aldric");
    expect(result).toContain("Archetype Passives: SP Focus: Conserves energy.");
  });

  it("includes abilities with power values", () => {
    const result = buildCharacterSummary(makeCharacter(), "Aldric");
    expect(result).toContain("Analyze");
    expect(result).toContain("hero");
    expect(result).toContain("Ti");
    expect(result).toContain("Breaks down defenses.");
  });

  it("omits archetype passives line when none present", () => {
    const character = makeCharacter({
      archetype: {
        ...makeCharacter().archetype,
        instinctPassive: undefined,
        instinctPassiveList: undefined,
      },
    });
    const result = buildCharacterSummary(character, "Aldric");
    expect(result).not.toContain("Archetype Passives:");
  });

  it("includes typology section", () => {
    const result = buildCharacterSummary(makeCharacter(), "Aldric");
    expect(result).toContain("TYPOLOGY INPUTS");
    expect(result).toContain("AP Type: VLEF");
    expect(result).toContain("Jungian Type: INTP");
  });
});
