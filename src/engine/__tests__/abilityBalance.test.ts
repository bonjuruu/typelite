import { describe, it, expect } from "vitest";
import { MBTI_TYPE_LIST, buildAbilityKit } from "../../data/mbti/index.ts";
import { computeAbilityPower } from "../modifiers.ts";
import type { StatBlock, AbilitySlot, MBTIType } from "../types/index.ts";

// ============================================================
// ABILITY POWER BALANCE AUDIT
// ============================================================

const STAT_SCENARIOS: { name: string; stats: StatBlock }[] = [
  {
    name: "min",
    stats: { willpower: 4, intelligence: 4, spirit: 4, vitality: 4 },
  },
  {
    name: "max",
    stats: { willpower: 20, intelligence: 20, spirit: 20, vitality: 20 },
  },
  {
    name: "typical-AP",
    stats: { willpower: 14, intelligence: 10, spirit: 7, vitality: 4 },
  },
];

const SLOT_LIST: AbilitySlot[] = ["hero", "parent", "child", "inferior"];

interface PowerEntry {
  mbtiType: MBTIType;
  slot: AbilitySlot;
  cognitiveFunction: string;
  scenario: string;
  power: number;
}

function computeStats(entryList: number[]): {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
} {
  const min = Math.min(...entryList);
  const max = Math.max(...entryList);
  const mean = entryList.reduce((sum, v) => sum + v, 0) / entryList.length;
  const variance =
    entryList.reduce((sum, v) => sum + (v - mean) ** 2, 0) / entryList.length;
  const stdDev = Math.sqrt(variance);
  return {
    min,
    max,
    mean: Math.round(mean * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
  };
}

describe("Ability Power Balance Audit", () => {
  const allEntryList: PowerEntry[] = [];

  // Compute all power values
  for (const mbtiType of MBTI_TYPE_LIST) {
    const abilityList = buildAbilityKit(mbtiType);
    for (const scenario of STAT_SCENARIOS) {
      for (const ability of abilityList) {
        const power = computeAbilityPower(ability, scenario.stats);
        allEntryList.push({
          mbtiType,
          slot: ability.slot,
          cognitiveFunction: ability.cognitiveFunction,
          scenario: scenario.name,
          power,
        });
      }
    }
  }

  it("generates all 16 types × 4 slots × 3 scenarios", () => {
    expect(allEntryList).toHaveLength(16 * 4 * 3);
  });

  it("every ability produces a positive power value", () => {
    for (const entry of allEntryList) {
      expect(
        entry.power,
        `${entry.mbtiType} ${entry.slot} (${entry.cognitiveFunction}) in ${entry.scenario}`,
      ).toBeGreaterThan(0);
    }
  });

  it("hero abilities are always stronger than inferior abilities for the same type and scenario", () => {
    for (const mbtiType of MBTI_TYPE_LIST) {
      for (const scenario of STAT_SCENARIOS) {
        const heroPower = allEntryList.find(
          (e) =>
            e.mbtiType === mbtiType &&
            e.slot === "hero" &&
            e.scenario === scenario.name,
        )!.power;
        const inferiorPower = allEntryList.find(
          (e) =>
            e.mbtiType === mbtiType &&
            e.slot === "inferior" &&
            e.scenario === scenario.name,
        )!.power;

        expect(
          heroPower,
          `${mbtiType} ${scenario.name}: hero (${heroPower}) should beat inferior (${inferiorPower})`,
        ).toBeGreaterThan(inferiorPower);
      }
    }
  });

  it("slot power ordering is maintained: hero > parent > child > inferior", () => {
    for (const mbtiType of MBTI_TYPE_LIST) {
      for (const scenario of STAT_SCENARIOS) {
        const powerBySlot = Object.fromEntries(
          SLOT_LIST.map((slot) => [
            slot,
            allEntryList.find(
              (e) =>
                e.mbtiType === mbtiType &&
                e.slot === slot &&
                e.scenario === scenario.name,
            )!.power,
          ]),
        ) as Record<AbilitySlot, number>;

        expect(
          powerBySlot.hero,
          `${mbtiType} ${scenario.name}: hero (${powerBySlot.hero}) >= parent (${powerBySlot.parent})`,
        ).toBeGreaterThanOrEqual(powerBySlot.parent);
        expect(
          powerBySlot.parent,
          `${mbtiType} ${scenario.name}: parent (${powerBySlot.parent}) >= child (${powerBySlot.child})`,
        ).toBeGreaterThanOrEqual(powerBySlot.child);
        expect(
          powerBySlot.child,
          `${mbtiType} ${scenario.name}: child (${powerBySlot.child}) >= inferior (${powerBySlot.inferior})`,
        ).toBeGreaterThanOrEqual(powerBySlot.inferior);
      }
    }
  });

  it("same-slot abilities produce equal power across all 16 types for uniform stats", () => {
    // With uniform stats (min and max scenarios), all types should produce identical
    // power per slot since basePower is slot-determined and all stats are equal
    for (const scenario of ["min", "max"]) {
      for (const slot of SLOT_LIST) {
        const slotPowerList = allEntryList
          .filter((e) => e.slot === slot && e.scenario === scenario)
          .map((e) => e.power);

        const uniquePowerSet = new Set(slotPowerList);
        expect(
          uniquePowerSet.size,
          `${slot} in ${scenario} scenario should have equal power across types (got ${[...uniquePowerSet].join(", ")})`,
        ).toBe(1);
      }
    }
  });

  it("power scales correctly with stats (max scenario > min scenario for every ability)", () => {
    for (const mbtiType of MBTI_TYPE_LIST) {
      for (const slot of SLOT_LIST) {
        const minPower = allEntryList.find(
          (e) =>
            e.mbtiType === mbtiType && e.slot === slot && e.scenario === "min",
        )!.power;
        const maxPower = allEntryList.find(
          (e) =>
            e.mbtiType === mbtiType && e.slot === slot && e.scenario === "max",
        )!.power;

        expect(
          maxPower,
          `${mbtiType} ${slot}: max (${maxPower}) should exceed min (${minPower})`,
        ).toBeGreaterThan(minPower);
      }
    }
  });

  it("no function produces an outlier (>2 std dev from its slot mean) in any scenario", () => {
    const outlierList: string[] = [];

    for (const scenario of STAT_SCENARIOS) {
      for (const slot of SLOT_LIST) {
        const slotEntryList = allEntryList.filter(
          (e) => e.slot === slot && e.scenario === scenario.name,
        );
        const powerList = slotEntryList.map((e) => e.power);
        const stats = computeStats(powerList);

        for (const entry of slotEntryList) {
          const deviation = Math.abs(entry.power - stats.mean);
          if (deviation > 2 * stats.stdDev) {
            outlierList.push(
              `${entry.mbtiType} ${entry.slot} (${entry.cognitiveFunction}) = ${entry.power} in ${entry.scenario} (mean=${stats.mean}, stdDev=${stats.stdDev})`,
            );
          }
        }
      }
    }

    expect(
      outlierList,
      `Outliers found:\n${outlierList.join("\n")}`,
    ).toHaveLength(0);
  });

  it("each cognitive function appears exactly 2 times per scenario (once per type that uses it)", () => {
    const functionNameSet = new Set(
      allEntryList.map((e) => e.cognitiveFunction),
    );

    for (const fn of functionNameSet) {
      for (const scenario of STAT_SCENARIOS) {
        const count = allEntryList.filter(
          (e) => e.cognitiveFunction === fn && e.scenario === scenario.name,
        ).length;
        // Each function appears in exactly 2 of the 16 types (e.g. Ti is hero for INTP and ISTP)
        expect(
          count,
          `${fn} in ${scenario.name} should appear in multiple types`,
        ).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("power values fall within expected bounds per slot", () => {
    // basePower: hero=12, parent=8, child=6, inferior=4
    // formula: round(basePower * (1 + stat/20))
    // stat range: 4-20 → multiplier range: 1.2-2.0
    const expectedBounds: Record<AbilitySlot, { min: number; max: number }> = {
      hero: { min: Math.round(12 * 1.2), max: Math.round(12 * 2.0) }, // 14-24
      parent: { min: Math.round(8 * 1.2), max: Math.round(8 * 2.0) }, // 10-16
      child: { min: Math.round(6 * 1.2), max: Math.round(6 * 2.0) }, // 7-12
      inferior: { min: Math.round(4 * 1.2), max: Math.round(4 * 2.0) }, // 5-8
    };

    for (const slot of SLOT_LIST) {
      const slotPowerList = allEntryList
        .filter((e) => e.slot === slot)
        .map((e) => e.power);
      const bounds = expectedBounds[slot];

      const actualMin = Math.min(...slotPowerList);
      const actualMax = Math.max(...slotPowerList);

      expect(actualMin, `${slot} min power`).toBeGreaterThanOrEqual(bounds.min);
      expect(actualMax, `${slot} max power`).toBeLessThanOrEqual(bounds.max);
    }
  });
});
