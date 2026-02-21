import { describe, it, expect } from "vitest";
import { exportCharacterToText } from "../characterExporter.ts";
import type { Character } from "../../engine/types/index.ts";

// ============================================================
// FIXTURE
// ============================================================

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
      description: "A cerebral class driven by the need to understand.",
      enneagramType: 5,
      wing: 4,
      statModifiers: {},
      empoweredState: {
        name: "Clarity",
        description: "Gains focus under pressure.",
        statChanges: { intelligence: 2 },
      },
      stressedState: {
        name: "Withdrawal",
        description: "Retreats into isolation.",
        statChanges: { spirit: -2 },
      },
      instinctPassive: {
        name: "Self-Preservation Focus",
        description: "Conserves energy in combat.",
        source: "dominant instinct (sp)",
      },
    },
    abilities: [
      {
        name: "Analyze",
        description: "Breaks down enemy defenses.",
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
        description: "Reduces incoming damage in darkness.",
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
          description: "Reduces damage taken when stationary.",
          source: "combat",
        },
      ],
    },
    activeSystems: ["attitudinal", "enneagram", "mbti"],
    typologySource: {
      attitudinal: "VLEF",
      mbti: "INTP",
      socionics: null,
      enneagram: { type: 5, wing: 4, instinct: "sp" },
      instincts: null,
    },
    ...overrides,
  };
}

// ============================================================
// TESTS
// ============================================================

describe("exportCharacterToText", () => {
  it("includes header with character name and title", () => {
    const result = exportCharacterToText(makeCharacter(), "Aldric");
    expect(result).toContain("Aldric — Shadow Analyst");
  });

  it("includes all four stats", () => {
    const result = exportCharacterToText(makeCharacter(), "Aldric");
    expect(result).toContain("Willpower:");
    expect(result).toContain("Intelligence:");
    expect(result).toContain("Spirit:");
    expect(result).toContain("Vitality:");
    expect(result).toContain("12");
    expect(result).toContain("15");
  });

  it("includes archetype class name and description", () => {
    const result = exportCharacterToText(makeCharacter(), "Aldric");
    expect(result).toContain("ARCHETYPE: Investigator");
    expect(result).toContain("A cerebral class driven by the need to understand.");
  });

  it("includes instinct passive from single legacy field", () => {
    const result = exportCharacterToText(makeCharacter(), "Aldric");
    expect(result).toContain("Passive — Self-Preservation Focus: Conserves energy in combat.");
  });

  it("includes instinct passives from stacked list when present", () => {
    const character = makeCharacter({
      archetype: {
        ...makeCharacter().archetype,
        instinctPassive: undefined,
        instinctPassiveList: [
          { name: "Primary", description: "First passive.", source: "dominant" },
          { name: "Secondary", description: "Second passive.", source: "2nd instinct" },
        ],
      },
    });
    const result = exportCharacterToText(character, "Aldric");
    expect(result).toContain("Passive — Primary: First passive.");
    expect(result).toContain("Passive — Secondary: Second passive.");
  });

  it("includes empowered and stressed states", () => {
    const result = exportCharacterToText(makeCharacter(), "Aldric");
    expect(result).toContain("Empowered: Clarity — Gains focus under pressure.");
    expect(result).toContain("Stressed: Withdrawal — Retreats into isolation.");
  });

  it("includes abilities section with slot labels and power", () => {
    const result = exportCharacterToText(makeCharacter(), "Aldric");
    expect(result).toContain("ABILITIES");
    expect(result).toContain("[Hero — Ti] Analyze");
    expect(result).toContain("Tags: debuff, single-target");
    expect(result).toContain("Breaks down enemy defenses.");
  });

  it("omits abilities section when abilities list is empty", () => {
    const character = makeCharacter({ abilities: [] });
    const result = exportCharacterToText(character, "Aldric");
    expect(result).not.toContain("ABILITIES");
  });

  it("includes element and its passive", () => {
    const result = exportCharacterToText(makeCharacter(), "Aldric");
    expect(result).toContain("ELEMENT: Shadow (Alpha quadra)");
    expect(result).toContain("Passive — Umbral Veil: Reduces incoming damage in darkness.");
  });

  it("includes combat behavior", () => {
    const result = exportCharacterToText(makeCharacter(), "Aldric");
    expect(result).toContain("COMBAT: Tactical");
    expect(result).toContain("Activation: Memorializing | Positioning: Escaping | Regen: Internalizing");
    expect(result).toContain("Passive — Fortress: Reduces damage taken when stationary.");
  });

  it("ends with footer", () => {
    const result = exportCharacterToText(makeCharacter(), "Aldric");
    expect(result).toContain("Generated by Typelite");
  });
});
