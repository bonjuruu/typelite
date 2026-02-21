import { describe, it, expect } from "vitest";
import type { BuilderSelections, EnabledSystems } from "../../types/builder.ts";
import type {
  GeneratorInput,
  ManualOverrides,
} from "../../engine/types/index.ts";
import { generateCharacter } from "../../engine/generator.ts";
import {
  INITIAL_ENABLED,
  INITIAL_SELECTIONS,
  INITIAL_OVERRIDES,
  pickRandom,
  randomizeEnneagramSelections,
  randomizeInstinctsSelections,
} from "../useBuilderSelections.ts";
import { AP_TYPE_LIST } from "../../data/attitudinal.ts";
import { MBTI_TYPE_LIST } from "../../data/mbti/index.ts";
import { SOCIONICS_TYPE_LIST } from "../../data/socionics.ts";
import { ENNEAGRAM_INSTINCT_LIST } from "../../data/enneagram/index.ts";

/**
 * useCharacterGenerator composes useBuilderSelections + useCharacterEdits + generator.
 * We test the core behavioral contracts by simulating the hook's key logic paths.
 */

function buildGeneratorInput(
  enabledSystems: EnabledSystems,
  selections: BuilderSelections,
  overrides: ManualOverrides,
): GeneratorInput {
  return {
    attitudinal: enabledSystems.attitudinal ? selections.attitudinal : null,
    enneagram:
      enabledSystems.enneagram &&
      selections.enneagramType &&
      selections.enneagramWing &&
      selections.enneagramInstinct
        ? {
            type: selections.enneagramType,
            wing: selections.enneagramWing,
            instinct: selections.enneagramInstinct,
            ...(selections.instinctStackEnabled && selections.instinctSecond
              ? {
                  instinctStack: (() => {
                    const third = ENNEAGRAM_INSTINCT_LIST.find(
                      (i) =>
                        i !== selections.enneagramInstinct &&
                        i !== selections.instinctSecond,
                    );
                    return [
                      selections.enneagramInstinct,
                      selections.instinctSecond,
                      third ?? "sp",
                    ] as [
                      typeof selections.enneagramInstinct,
                      typeof selections.enneagramInstinct,
                      typeof selections.enneagramInstinct,
                    ];
                  })(),
                }
              : {}),
          }
        : null,
    mbti: enabledSystems.mbti ? selections.mbti : null,
    socionics: enabledSystems.socionics ? selections.socionics : null,
    instincts:
      enabledSystems.instincts && selections.instinctRealm
        ? { realm: selections.instinctRealm }
        : null,
    overrides,
  };
}

function checkSelections(
  enabled: EnabledSystems,
  selections: BuilderSelections,
): boolean {
  if (enabled.attitudinal && !selections.attitudinal) return false;
  if (
    enabled.enneagram &&
    (!selections.enneagramType ||
      !selections.enneagramWing ||
      !selections.enneagramInstinct)
  )
    return false;
  if (enabled.mbti && !selections.mbti) return false;
  if (enabled.socionics && !selections.socionics) return false;
  if (enabled.instincts && !selections.instinctRealm) return false;
  return true;
}

describe("useCharacterGenerator behavioral contracts", () => {
  it("generate() produces a character when all selections are filled", () => {
    const selections: BuilderSelections = {
      ...INITIAL_SELECTIONS,
      attitudinal: "VELF",
      enneagramType: 5,
      enneagramWing: 4,
      enneagramInstinct: "sp",
      mbti: "INTJ",
      socionics: "ILI",
      instinctRealm: "FD",
    };

    const input = buildGeneratorInput(
      INITIAL_ENABLED,
      selections,
      INITIAL_OVERRIDES,
    );
    const character = generateCharacter(input);

    expect(character).toBeDefined();
    expect(character.name).toBeTruthy();
    expect(character.stats.willpower).toBeGreaterThan(0);
    expect(character.abilities).toHaveLength(4);
    expect(character.activeSystems).toHaveLength(5);
  });

  it("randomizeAll() fills selections and produces a character", () => {
    const enabledSystems = INITIAL_ENABLED;
    let newSelections: BuilderSelections = { ...INITIAL_SELECTIONS };

    if (enabledSystems.attitudinal) {
      newSelections.attitudinal = pickRandom(AP_TYPE_LIST);
    }
    if (enabledSystems.enneagram) {
      newSelections = {
        ...newSelections,
        ...randomizeEnneagramSelections(newSelections),
      };
    }
    if (enabledSystems.mbti) {
      newSelections.mbti = pickRandom(MBTI_TYPE_LIST);
    }
    if (enabledSystems.socionics) {
      newSelections.socionics = pickRandom(SOCIONICS_TYPE_LIST);
    }
    if (enabledSystems.instincts) {
      newSelections = {
        ...newSelections,
        ...randomizeInstinctsSelections(newSelections),
      };
    }

    expect(newSelections.attitudinal).not.toBeNull();
    expect(newSelections.enneagramType).not.toBeNull();
    expect(newSelections.mbti).not.toBeNull();
    expect(newSelections.socionics).not.toBeNull();
    expect(newSelections.instinctRealm).not.toBeNull();

    const input = buildGeneratorInput(
      enabledSystems,
      newSelections,
      INITIAL_OVERRIDES,
    );
    const character = generateCharacter(input);
    expect(character).toBeDefined();
    expect(character.activeSystems).toHaveLength(5);
  });

  it("hasAllSelections returns false when selections are incomplete", () => {
    expect(checkSelections(INITIAL_ENABLED, INITIAL_SELECTIONS)).toBe(false);
  });

  it("hasAllSelections returns true when all enabled systems have selections", () => {
    const selections: BuilderSelections = {
      ...INITIAL_SELECTIONS,
      attitudinal: "VELF",
      enneagramType: 5,
      enneagramWing: 4,
      enneagramInstinct: "sp",
      mbti: "INTJ",
      socionics: "ILI",
      instinctRealm: "FD",
    };
    expect(checkSelections(INITIAL_ENABLED, selections)).toBe(true);
  });

  it("hasAllSelections returns true when disabled systems have no selections", () => {
    const enabled: EnabledSystems = {
      attitudinal: true,
      enneagram: false,
      mbti: true,
      socionics: false,
      instincts: false,
    };
    const selections: BuilderSelections = {
      ...INITIAL_SELECTIONS,
      attitudinal: "VELF",
      mbti: "INTJ",
    };
    expect(checkSelections(enabled, selections)).toBe(true);
  });
});
