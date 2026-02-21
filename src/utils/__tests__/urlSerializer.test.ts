import { describe, it, expect } from "vitest";
import { serializeToUrl, deserializeFromUrl } from "../urlSerializer/index.ts";
import type {
  ManualOverrides,
  CharacterEdits,
} from "../../engine/types/index.ts";
import { EMPTY_CHARACTER_EDITS } from "../../engine/types/index.ts";
import type { BuilderSelections, EnabledSystems } from "../../types/builder.ts";

// ============================================================
// HELPERS
// ============================================================

function makeAllEnabled(): EnabledSystems {
  return {
    attitudinal: true,
    enneagram: true,
    mbti: true,
    socionics: true,
    instincts: true,
  };
}

function makeAllDisabled(): EnabledSystems {
  return {
    attitudinal: false,
    enneagram: false,
    mbti: false,
    socionics: false,
    instincts: false,
  };
}

function makeEmptySelections(): BuilderSelections {
  return {
    attitudinal: null,
    enneagramType: null,
    enneagramWing: null,
    enneagramInstinct: null,
    instinctStackEnabled: false,
    instinctSecond: null,
    tritypeEnabled: false,
    tritypeSecondFix: null,
    tritypeSecondFixWing: null,
    tritypeThirdFix: null,
    tritypeThirdFixWing: null,
    mbti: null,
    socionics: null,
    instinctRealm: null,
    instinctTritypeEnabled: false,
    instinctSecondRealm: null,
    instinctThirdRealm: null,
  };
}

function makeEmptyOverrides(): ManualOverrides {
  return {
    stats: null,
    archetype: null,
    abilities: null,
    element: null,
    combatOrientation: null,
  };
}

function roundTrip(
  enabledSystems: EnabledSystems,
  selections: BuilderSelections,
  overrides: ManualOverrides,
  characterName?: string,
) {
  const params = serializeToUrl(
    enabledSystems,
    selections,
    overrides,
    characterName,
  );
  return deserializeFromUrl(params);
}

// ============================================================
// ROUND-TRIP TESTS
// ============================================================

describe("urlSerializer round-trip", () => {
  it("preserves full state with all 5 systems enabled and all selections populated", () => {
    const enabledSystems = makeAllEnabled();
    const selections: BuilderSelections = {
      attitudinal: "VELF",
      enneagramType: 5,
      enneagramWing: 4,
      enneagramInstinct: "sp",
      instinctStackEnabled: true,
      instinctSecond: "so",
      tritypeEnabled: true,
      tritypeSecondFix: 2,
      tritypeSecondFixWing: 1,
      tritypeThirdFix: 9,
      tritypeThirdFixWing: 8,
      mbti: "INTJ",
      socionics: "ILI",
      instinctRealm: "FD",
      instinctTritypeEnabled: true,
      instinctSecondRealm: "AY",
      instinctThirdRealm: "SS",
    };
    const overrides: ManualOverrides = {
      stats: { willpower: 15, intelligence: 12, spirit: 10, vitality: 8 },
      archetype: "Sage",
      abilities: { hero: "Ni", parent: "Te", child: "Fi", inferior: "Se" },
      element: "Metal",
      combatOrientation: "Frontline",
    };

    const result = roundTrip(enabledSystems, selections, overrides, "Tharion");

    expect(result).not.toBeNull();
    expect(result!.enabledSystems).toEqual(enabledSystems);
    expect(result!.selections).toEqual(selections);
    expect(result!.overrides).toEqual(overrides);
    expect(result!.characterName).toBe("Tharion");
  });

  it("preserves minimal state with only 1 system enabled", () => {
    const enabledSystems: EnabledSystems = {
      attitudinal: true,
      enneagram: false,
      mbti: false,
      socionics: false,
      instincts: false,
    };
    const selections = makeEmptySelections();
    selections.attitudinal = "ELFV";
    const overrides = makeEmptyOverrides();

    const result = roundTrip(enabledSystems, selections, overrides);

    expect(result).not.toBeNull();
    expect(result!.enabledSystems).toEqual(enabledSystems);
    expect(result!.selections.attitudinal).toBe("ELFV");
    expect(result!.characterName).toBeUndefined();
  });

  it("preserves enneagram tritype with wings and instinct tritype", () => {
    const enabledSystems = makeAllEnabled();
    const selections: BuilderSelections = {
      attitudinal: "VELF",
      enneagramType: 4,
      enneagramWing: 3,
      enneagramInstinct: "sx",
      instinctStackEnabled: false,
      instinctSecond: null,
      tritypeEnabled: true,
      tritypeSecondFix: 7,
      tritypeSecondFixWing: 6,
      tritypeThirdFix: 1,
      tritypeThirdFixWing: 2,
      mbti: "INFP",
      socionics: "EII",
      instinctRealm: "SS",
      instinctTritypeEnabled: true,
      instinctSecondRealm: "BG",
      instinctThirdRealm: "FD",
    };
    const overrides = makeEmptyOverrides();

    const result = roundTrip(enabledSystems, selections, overrides);

    expect(result).not.toBeNull();
    expect(result!.selections).toEqual(selections);
  });

  it("preserves overrides-only state when all systems are disabled", () => {
    const enabledSystems = makeAllDisabled();
    const selections = makeEmptySelections();
    const overrides: ManualOverrides = {
      stats: { willpower: 18, intelligence: 5, spirit: 12, vitality: 20 },
      archetype: "Berserker",
      abilities: { hero: "Se", parent: "Ti", child: "Fe", inferior: "Ni" },
      element: "Fire",
      combatOrientation: "Strategist",
    };

    const result = roundTrip(enabledSystems, selections, overrides);

    expect(result).not.toBeNull();
    expect(result!.enabledSystems).toEqual(enabledSystems);
    expect(result!.overrides).toEqual(overrides);
  });

  it("handles empty state with no systems enabled and no selections", () => {
    const enabledSystems = makeAllDisabled();
    const selections = makeEmptySelections();
    const overrides = makeEmptyOverrides();

    const result = roundTrip(enabledSystems, selections, overrides);

    expect(result).not.toBeNull();
    expect(result!.enabledSystems).toEqual(enabledSystems);
    expect(result!.overrides.stats).toBeNull();
    expect(result!.overrides.archetype).toBeNull();
    expect(result!.overrides.abilities).toBeNull();
    expect(result!.overrides.element).toBeNull();
    expect(result!.overrides.combatOrientation).toBeNull();
  });

  it("preserves stat boundary values at min (1) and max (20)", () => {
    const enabledSystems = makeAllDisabled();
    const selections = makeEmptySelections();
    const overrides: ManualOverrides = {
      stats: { willpower: 1, intelligence: 20, spirit: 1, vitality: 20 },
      archetype: null,
      abilities: null,
      element: null,
      combatOrientation: null,
    };

    const result = roundTrip(enabledSystems, selections, overrides);

    expect(result).not.toBeNull();
    expect(result!.overrides.stats).toEqual({
      willpower: 1,
      intelligence: 20,
      spirit: 1,
      vitality: 20,
    });
  });

  it("returns null for invalid system bitmask", () => {
    const params = new URLSearchParams();
    params.set("s", "111"); // only 3 bits instead of 5

    expect(deserializeFromUrl(params)).toBeNull();
  });

  it("returns null when system bitmask is missing", () => {
    const params = new URLSearchParams();

    expect(deserializeFromUrl(params)).toBeNull();
  });
});

// ============================================================
// CHARACTER EDITS ROUND-TRIP
// ============================================================

describe("urlSerializer edits round-trip", () => {
  function roundTripEdits(edits: CharacterEdits) {
    const params = serializeToUrl(
      makeAllDisabled(),
      makeEmptySelections(),
      makeEmptyOverrides(),
      undefined,
      edits,
    );
    return deserializeFromUrl(params);
  }

  it("preserves stat edits", () => {
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      stats: { willpower: 15, intelligence: 12, spirit: 8, vitality: 10 },
    };
    const result = roundTripEdits(edits);
    expect(result!.edits!.stats).toEqual({
      willpower: 15,
      intelligence: 12,
      spirit: 8,
      vitality: 10,
    });
  });

  it("preserves className edit", () => {
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      className: "Shadow Knight",
    };
    const result = roundTripEdits(edits);
    expect(result!.edits!.className).toBe("Shadow Knight");
  });

  it("preserves ability name edits", () => {
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      abilityNameList: { hero: "Dark Strike", child: "Mend" },
    };
    const result = roundTripEdits(edits);
    expect(result!.edits!.abilityNameList).toEqual({
      hero: "Dark Strike",
      child: "Mend",
    });
  });

  it("preserves element edit", () => {
    const edits: CharacterEdits = { ...EMPTY_CHARACTER_EDITS, element: "Fire" };
    const result = roundTripEdits(edits);
    expect(result!.edits!.element).toBe("Fire");
  });

  it("preserves combatOrientation edit", () => {
    const edits: CharacterEdits = {
      ...EMPTY_CHARACTER_EDITS,
      combatOrientation: "Support",
    };
    const result = roundTripEdits(edits);
    expect(result!.edits!.combatOrientation).toBe("Support");
  });

  it("preserves all edits together", () => {
    const edits: CharacterEdits = {
      stats: { willpower: 18, vitality: 5 },
      className: "Arcane Healer",
      abilityNameList: { hero: "Radiant Burst", parent: "Shield Wall" },
      element: "Light",
      combatOrientation: "Strategist",
    };
    const result = roundTripEdits(edits);
    expect(result!.edits!.stats).toEqual({ willpower: 18, vitality: 5 });
    expect(result!.edits!.className).toBe("Arcane Healer");
    expect(result!.edits!.abilityNameList).toEqual({
      hero: "Radiant Burst",
      parent: "Shield Wall",
    });
    expect(result!.edits!.element).toBe("Light");
    expect(result!.edits!.combatOrientation).toBe("Strategist");
  });

  it("returns no edits when none were serialized", () => {
    const params = serializeToUrl(
      makeAllDisabled(),
      makeEmptySelections(),
      makeEmptyOverrides(),
    );
    const result = deserializeFromUrl(params);
    expect(result!.edits).toBeUndefined();
  });
});
