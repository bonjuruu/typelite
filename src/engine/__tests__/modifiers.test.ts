import { describe, it, expect } from "vitest";
import {
  applyStatMultipliers,
  applyStatOverrides,
  applyStatChanges,
  computeAbilityPower,
  DEFAULT_STATS,
} from "../modifiers.ts";
import type { StatBlock, Ability, AbilitySlot } from "../types/index.ts";

// ============================================================
// HELPERS
// ============================================================

function makeAbility(overrides: Partial<Ability> = {}): Ability {
  return {
    name: "Test Ability",
    description: "A test ability.",
    slot: "hero" as AbilitySlot,
    cognitiveFunction: "Ti",
    basePower: 12,
    scalingStat: "intelligence",
    tags: ["damage"],
    ...overrides,
  };
}

// ============================================================
// applyStatMultipliers
// ============================================================

describe("applyStatMultipliers", () => {
  it("multiplies stats correctly and rounds to integers", () => {
    const base: StatBlock = {
      willpower: 14,
      intelligence: 10,
      spirit: 7,
      vitality: 4,
    };
    const multipliers = { willpower: 1.15, intelligence: 1.05 };
    const result = applyStatMultipliers(base, multipliers);

    expect(result.willpower).toBe(Math.round(14 * 1.15));
    expect(result.intelligence).toBe(Math.round(10 * 1.05));
    expect(result.spirit).toBe(7);
    expect(result.vitality).toBe(4);
  });

  it("leaves stats unchanged when multipliers are empty", () => {
    const base: StatBlock = {
      willpower: 10,
      intelligence: 10,
      spirit: 10,
      vitality: 10,
    };
    const result = applyStatMultipliers(base, {});

    expect(result).toEqual(base);
  });

  it("handles zero stats", () => {
    const base: StatBlock = {
      willpower: 0,
      intelligence: 0,
      spirit: 0,
      vitality: 0,
    };
    const result = applyStatMultipliers(base, { willpower: 1.5 });

    expect(result.willpower).toBe(0);
  });

  it("handles max stats (20)", () => {
    const base: StatBlock = {
      willpower: 20,
      intelligence: 20,
      spirit: 20,
      vitality: 20,
    };
    const result = applyStatMultipliers(base, {
      willpower: 1.2,
      vitality: 1.1,
    });

    expect(result.willpower).toBe(Math.round(20 * 1.2));
    expect(result.vitality).toBe(Math.round(20 * 1.1));
  });
});

// ============================================================
// applyStatOverrides
// ============================================================

describe("applyStatOverrides", () => {
  it("replaces only specified stats, leaves others unchanged", () => {
    const base: StatBlock = {
      willpower: 14,
      intelligence: 10,
      spirit: 7,
      vitality: 4,
    };
    const result = applyStatOverrides(base, { willpower: 20 });

    expect(result.willpower).toBe(20);
    expect(result.intelligence).toBe(10);
    expect(result.spirit).toBe(7);
    expect(result.vitality).toBe(4);
  });

  it("returns original stats when overrides is null", () => {
    const base: StatBlock = {
      willpower: 14,
      intelligence: 10,
      spirit: 7,
      vitality: 4,
    };
    const result = applyStatOverrides(base, null);

    expect(result).toBe(base);
  });

  it("replaces all stats when all are overridden", () => {
    const base: StatBlock = {
      willpower: 14,
      intelligence: 10,
      spirit: 7,
      vitality: 4,
    };
    const result = applyStatOverrides(base, {
      willpower: 1,
      intelligence: 2,
      spirit: 3,
      vitality: 4,
    });

    expect(result).toEqual({
      willpower: 1,
      intelligence: 2,
      spirit: 3,
      vitality: 4,
    });
  });
});

// ============================================================
// applyStatChanges
// ============================================================

describe("applyStatChanges", () => {
  it("adds flat changes to stats", () => {
    const base: StatBlock = {
      willpower: 10,
      intelligence: 10,
      spirit: 10,
      vitality: 10,
    };
    const result = applyStatChanges(base, { spirit: 3 });

    expect(result.spirit).toBe(13);
    expect(result.willpower).toBe(10);
  });

  it("handles negative changes", () => {
    const base: StatBlock = {
      willpower: 10,
      intelligence: 10,
      spirit: 10,
      vitality: 10,
    };
    const result = applyStatChanges(base, { intelligence: -3 });

    expect(result.intelligence).toBe(7);
  });
});

// ============================================================
// computeAbilityPower
// ============================================================

describe("computeAbilityPower", () => {
  it("computes power with formula: basePower * (1 + statValue / 20)", () => {
    const stats: StatBlock = {
      willpower: 14,
      intelligence: 10,
      spirit: 7,
      vitality: 4,
    };
    const ability = makeAbility({ basePower: 12, scalingStat: "intelligence" });
    const power = computeAbilityPower(ability, stats);

    expect(power).toBe(Math.round(12 * (1 + 10 / 20)));
  });

  it("returns basePower when stat is zero", () => {
    const stats: StatBlock = {
      willpower: 0,
      intelligence: 0,
      spirit: 0,
      vitality: 0,
    };
    const ability = makeAbility({ basePower: 12, scalingStat: "willpower" });
    const power = computeAbilityPower(ability, stats);

    expect(power).toBe(12);
  });

  it("scales correctly at max stat (20)", () => {
    const stats: StatBlock = {
      willpower: 20,
      intelligence: 20,
      spirit: 20,
      vitality: 20,
    };
    const ability = makeAbility({ basePower: 12, scalingStat: "vitality" });
    const power = computeAbilityPower(ability, stats);

    expect(power).toBe(Math.round(12 * (1 + 20 / 20)));
    expect(power).toBe(24);
  });

  it("scales different abilities off their respective stats", () => {
    const stats: StatBlock = {
      willpower: 14,
      intelligence: 4,
      spirit: 10,
      vitality: 7,
    };
    const niAbility = makeAbility({ basePower: 12, scalingStat: "willpower" });
    const tiAbility = makeAbility({
      basePower: 8,
      scalingStat: "intelligence",
    });

    expect(computeAbilityPower(niAbility, stats)).toBe(
      Math.round(12 * (1 + 14 / 20)),
    );
    expect(computeAbilityPower(tiAbility, stats)).toBe(
      Math.round(8 * (1 + 4 / 20)),
    );
  });
});

// ============================================================
// DEFAULT_STATS
// ============================================================

describe("DEFAULT_STATS", () => {
  it("has all four stats set to 8", () => {
    expect(DEFAULT_STATS).toEqual({
      willpower: 8,
      intelligence: 8,
      spirit: 8,
      vitality: 8,
    });
  });
});
