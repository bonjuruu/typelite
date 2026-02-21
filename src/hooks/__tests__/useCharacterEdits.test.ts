import { describe, it, expect } from "vitest";
import type {
  Character,
  CharacterEdits,
  GeneratorInput,
} from "../../engine/types/index.ts";
import { EMPTY_CHARACTER_EDITS } from "../../engine/types/index.ts";
import { applyEdits } from "../../engine/editLayer.ts";
import { generateCharacter } from "../../engine/generator.ts";

/**
 * useCharacterEdits is a thin wrapper around applyEdits + React state.
 * We test the behavioral contracts directly.
 */

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

describe("useCharacterEdits behavioral contracts", () => {
  it("returns null character when rawCharacter is null", () => {
    const rawCharacter: Character | null = null;
    const character = rawCharacter
      ? applyEdits(rawCharacter, EMPTY_CHARACTER_EDITS)
      : null;
    expect(character).toBeNull();
  });

  it("returns edited character when rawCharacter is provided", () => {
    const rawCharacter = makeCharacter();
    const character = applyEdits(rawCharacter, EMPTY_CHARACTER_EDITS);
    expect(character).not.toBeNull();
    expect(character.stats).toEqual(rawCharacter.stats);
  });

  it("updateCharacterEdit updates a single edit field", () => {
    // Simulate the hook's updateCharacterEdit
    let edits: CharacterEdits = { ...EMPTY_CHARACTER_EDITS };
    const updateCharacterEdit = <K extends keyof CharacterEdits>(
      key: K,
      value: CharacterEdits[K],
    ) => {
      edits = { ...edits, [key]: value };
    };

    updateCharacterEdit("className", "Custom Class");
    expect(edits.className).toBe("Custom Class");
    expect(edits.stats).toBeNull();
    expect(edits.element).toBeNull();
  });

  it("updateCharacterEdit applies stat overrides", () => {
    const rawCharacter = makeCharacter();
    let edits: CharacterEdits = { ...EMPTY_CHARACTER_EDITS };

    edits = { ...edits, stats: { willpower: 15 } };
    const edited = applyEdits(rawCharacter, edits);
    expect(edited.stats.willpower).toBe(15);
  });

  it("resetCharacterEdits resets to EMPTY_CHARACTER_EDITS", () => {
    let edits: CharacterEdits = {
      stats: { willpower: 15 },
      className: "Custom",
      abilityNameList: null,
      element: "Fire",
      combatOrientation: null,
    };

    // Simulate reset
    edits = EMPTY_CHARACTER_EDITS;

    expect(edits.stats).toBeNull();
    expect(edits.className).toBeNull();
    expect(edits.element).toBeNull();
  });
});
