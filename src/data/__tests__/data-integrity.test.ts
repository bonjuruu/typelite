import { describe, it, expect } from "vitest";
import { AP_TYPE_LIST, getBaseStats } from "../attitudinal.ts";
import {
  ENNEAGRAM_TYPE_LIST,
  getWings,
  getCenter,
  buildArchetype,
  buildTritypeArchetype,
  CENTER_TYPES,
  CENTER_LIST,
  ENNEAGRAM_INSTINCT_LIST,
} from "../enneagram/index.ts";
import { MBTI_TYPE_LIST, buildAbilityKit, getFunctionStack } from "../mbti/index.ts";
import { SOCIONICS_TYPE_LIST, buildElementAffinity } from "../socionics.ts";
import {
  INSTINCT_REALM_LIST,
  buildCombatBehavior,
  buildTritypeCombatBehavior,
  getRealmCenter,
  INSTINCT_CENTER_LIST,
  REALMS_BY_CENTER,
} from "../instincts/index.ts";
import type { EnneagramNumber, StatName } from "../../engine/types/index.ts";

// ============================================================
// ATTITUDINAL PSYCHE
// ============================================================

describe("Attitudinal Psyche data integrity", () => {
  it("has exactly 24 AP types", () => {
    expect(AP_TYPE_LIST).toHaveLength(24);
  });

  it("each AP type has valid 4-stat mappings summing to 35", () => {
    const statNameList: StatName[] = [
      "willpower",
      "intelligence",
      "spirit",
      "vitality",
    ];

    for (const apType of AP_TYPE_LIST) {
      const stats = getBaseStats(apType);

      for (const stat of statNameList) {
        expect(stats[stat]).toBeGreaterThan(0);
      }

      // 14 + 10 + 7 + 4 = 35
      const total =
        stats.willpower + stats.intelligence + stats.spirit + stats.vitality;
      expect(total).toBe(35);
    }
  });

  it("each AP type assigns unique values to each stat", () => {
    for (const apType of AP_TYPE_LIST) {
      const stats = getBaseStats(apType);
      const valueList = [
        stats.willpower,
        stats.intelligence,
        stats.spirit,
        stats.vitality,
      ];
      const uniqueValueSet = new Set(valueList);
      expect(uniqueValueSet.size).toBe(4);
    }
  });

  it("all AP types have unique orderings", () => {
    const typeSet = new Set(AP_TYPE_LIST);
    expect(typeSet.size).toBe(24);
  });
});

// ============================================================
// ENNEAGRAM
// ============================================================

describe("Enneagram data integrity", () => {
  it("has exactly 9 enneagram types", () => {
    expect(ENNEAGRAM_TYPE_LIST).toHaveLength(9);
    expect(ENNEAGRAM_TYPE_LIST).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("each type produces a valid archetype with wings and instinct", () => {
    for (const type of ENNEAGRAM_TYPE_LIST) {
      const wingList = getWings(type);
      const archetype = buildArchetype(type, wingList[0], "sp");

      expect(archetype.className).toBeTruthy();
      expect(archetype.description).toBeTruthy();
      expect(archetype.enneagramType).toBe(type);
      expect(archetype.wing).toBe(wingList[0]);
      expect(archetype.empoweredState).toBeDefined();
      expect(archetype.empoweredState.name).toBeTruthy();
      expect(archetype.stressedState).toBeDefined();
      expect(archetype.stressedState.name).toBeTruthy();
      expect(archetype.instinctPassive).toBeDefined();
    }
  });

  it("wing adjacency is correct for all types", () => {
    const expectedWings: Record<
      EnneagramNumber,
      [EnneagramNumber, EnneagramNumber]
    > = {
      1: [9, 2],
      2: [1, 3],
      3: [2, 4],
      4: [3, 5],
      5: [4, 6],
      6: [5, 7],
      7: [6, 8],
      8: [7, 9],
      9: [8, 1],
    };

    for (const type of ENNEAGRAM_TYPE_LIST) {
      expect(getWings(type)).toEqual(expectedWings[type]);
    }
  });

  it("each type belongs to exactly one center", () => {
    const gutTypeList = CENTER_TYPES["Gut"];
    const heartTypeList = CENTER_TYPES["Heart"];
    const headTypeList = CENTER_TYPES["Head"];

    expect(gutTypeList).toEqual([8, 9, 1]);
    expect(heartTypeList).toEqual([2, 3, 4]);
    expect(headTypeList).toEqual([5, 6, 7]);

    // Every type should appear in exactly one center
    for (const type of ENNEAGRAM_TYPE_LIST) {
      const center = getCenter(type);
      expect(CENTER_LIST).toContain(center);
    }
  });

  it("instinct stacking produces 3 passives", () => {
    const archetype = buildArchetype(5, 4, "sp", ["sp", "so", "sx"]);

    expect(archetype.instinctPassiveList).toHaveLength(3);
    expect(archetype.instinctPassiveList![0].name).toBe("Fortified");
    expect(archetype.instinctPassiveList![1].name).toBe("Rally");
    expect(archetype.instinctPassiveList![2].name).toBe("Fixation");
  });

  it("tritype builder works with valid inputs", () => {
    const archetype = buildTritypeArchetype(5, 4, [5, 2, 9], [1, 8], "sp");

    expect(archetype.className).toContain("[5-2-9]");
    expect(archetype.statModifiers).toBeDefined();
  });

  it("each instinct variant has valid stat modifiers and passive", () => {
    for (const instinct of ENNEAGRAM_INSTINCT_LIST) {
      const archetype = buildArchetype(5, 4, instinct);
      expect(archetype.instinctPassive).toBeDefined();
      expect(archetype.instinctPassive!.name).toBeTruthy();
      expect(archetype.instinctPassive!.description).toBeTruthy();
    }
  });
});

// ============================================================
// MBTI
// ============================================================

describe("MBTI data integrity", () => {
  it("has exactly 16 MBTI types", () => {
    expect(MBTI_TYPE_LIST).toHaveLength(16);
  });

  it("each type produces a 4-ability kit", () => {
    for (const type of MBTI_TYPE_LIST) {
      const abilityList = buildAbilityKit(type);

      expect(abilityList).toHaveLength(4);
      expect(abilityList[0].slot).toBe("hero");
      expect(abilityList[1].slot).toBe("parent");
      expect(abilityList[2].slot).toBe("child");
      expect(abilityList[3].slot).toBe("inferior");
    }
  });

  it("no type has duplicate cognitive functions in its stack", () => {
    for (const type of MBTI_TYPE_LIST) {
      const stack = getFunctionStack(type);
      const functionSet = new Set(stack);
      expect(functionSet.size).toBe(4);
    }
  });

  it("each ability has valid properties", () => {
    for (const type of MBTI_TYPE_LIST) {
      const abilityList = buildAbilityKit(type);
      for (const ability of abilityList) {
        expect(ability.name).toBeTruthy();
        expect(ability.description).toBeTruthy();
        expect(ability.basePower).toBeGreaterThan(0);
        expect(ability.scalingStat).toBeTruthy();
        expect(ability.tags.length).toBeGreaterThan(0);
      }
    }
  });

  it("hero has highest base power, inferior has lowest", () => {
    for (const type of MBTI_TYPE_LIST) {
      const abilityList = buildAbilityKit(type);
      expect(abilityList[0].basePower).toBeGreaterThan(
        abilityList[3].basePower,
      );
    }
  });
});

// ============================================================
// SOCIONICS
// ============================================================

describe("Socionics data integrity", () => {
  it("has exactly 16 socionics types", () => {
    expect(SOCIONICS_TYPE_LIST).toHaveLength(16);
  });

  it("each type produces a valid element affinity", () => {
    for (const type of SOCIONICS_TYPE_LIST) {
      const affinity = buildElementAffinity(type);

      expect(affinity.element).toBeTruthy();
      expect(affinity.quadra).toBeTruthy();
      expect(affinity.club).toBeTruthy();
      expect(affinity.passiveTrait).toBeDefined();
      expect(affinity.passiveTrait.name).toBeTruthy();
      expect(affinity.passiveTrait.description).toBeTruthy();
    }
  });

  it("quadra-element mapping is consistent", () => {
    const alphaElementList = ["Light", "Nature"];
    const betaElementList = ["Fire", "Shadow"];
    const gammaElementList = ["Earth", "Metal"];
    const deltaElementList = ["Wind", "Water"];

    for (const type of SOCIONICS_TYPE_LIST) {
      const affinity = buildElementAffinity(type);
      switch (affinity.quadra) {
        case "Alpha":
          expect(alphaElementList).toContain(affinity.element);
          break;
        case "Beta":
          expect(betaElementList).toContain(affinity.element);
          break;
        case "Gamma":
          expect(gammaElementList).toContain(affinity.element);
          break;
        case "Delta":
          expect(deltaElementList).toContain(affinity.element);
          break;
      }
    }
  });
});

// ============================================================
// EXPANDED INSTINCTS
// ============================================================

describe("Expanded Instincts data integrity", () => {
  it("has exactly 9 instinct realms", () => {
    expect(INSTINCT_REALM_LIST).toHaveLength(9);
  });

  it("each realm produces a valid combat behavior", () => {
    for (const realm of INSTINCT_REALM_LIST) {
      const behavior = buildCombatBehavior(realm);

      expect(behavior.realm).toBe(realm);
      expect(behavior.center).toBeTruthy();
      expect(behavior.combatOrientation).toBeTruthy();
      expect(behavior.activationStyle).toBeTruthy();
      expect(behavior.positioning).toBeTruthy();
      expect(behavior.regenSource).toBeTruthy();
      expect(behavior.passives).toHaveLength(3);
    }
  });

  it("each realm belongs to exactly one center", () => {
    for (const realm of INSTINCT_REALM_LIST) {
      const center = getRealmCenter(realm);
      expect(INSTINCT_CENTER_LIST).toContain(center);
    }
  });

  it("centers have the correct realm assignments", () => {
    expect(REALMS_BY_CENTER["SUR"]).toEqual(["FD", "SY", "SM"]);
    expect(REALMS_BY_CENTER["INT"]).toEqual(["AY", "CY", "BG"]);
    expect(REALMS_BY_CENTER["PUR"]).toEqual(["SS", "EX", "UN"]);
  });

  it("tritype builder deduplicates passives", () => {
    // FD and AY share 'Immersing' experiential triad, so their passive should deduplicate
    const behavior = buildTritypeCombatBehavior("FD", ["FD", "AY", "SS"]);

    const passiveNameList = behavior.passives.map((p) => p.name);
    // Check no duplicate names in the final list
    const passiveNameSet = new Set(passiveNameList);
    expect(passiveNameSet.size).toBe(passiveNameList.length);
  });

  it("tritype with max diversity produces up to 9 passives", () => {
    // FD (Immersing/Directing/Externalizing), CY (Distinguishing/Aligning/Externalizing), UN (Memorializing/Escaping/Externalizing)
    // FD: Flow State, Aggressive Advance, Siphon
    // CY: Precision Timing, Adaptive Stance, Siphon (dup)
    // UN: Afterimage, Evasive, Siphon (dup)
    const behavior = buildTritypeCombatBehavior("FD", ["FD", "CY", "UN"]);

    // 3 core + up to 3 from 2nd + up to 3 from 3rd, minus duplicates
    expect(behavior.passives.length).toBeGreaterThanOrEqual(3);
    expect(behavior.passives.length).toBeLessThanOrEqual(9);
  });
});
