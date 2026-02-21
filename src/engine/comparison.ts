import type { Character, StatName, CognitiveFunction } from "./types/index.ts";
import { computeAbilityPower } from "./modifiers.ts";
import type {
  AbilityComparison,
  CharacterDiff,
  PassiveDiff,
} from "../types/comparison.ts";

export type {
  AbilityComparison,
  CharacterDiff,
  PassiveDiff,
} from "../types/comparison.ts";

// ============================================================
// DIFF COMPUTATION
// ============================================================

const STAT_KEY_LIST: StatName[] = [
  "willpower",
  "intelligence",
  "spirit",
  "vitality",
];

export function computeCharacterDiff(
  a: Character,
  b: Character,
): CharacterDiff {
  // Stat diffs (positive = A higher)
  const statDiffMap = {} as Record<StatName, number>;
  for (const key of STAT_KEY_LIST) {
    statDiffMap[key] = a.stats[key] - b.stats[key];
  }

  // Ability comparison by cognitive function
  const fnMapA = new Map(a.abilities.map((ab) => [ab.cognitiveFunction, ab]));
  const fnMapB = new Map(b.abilities.map((ab) => [ab.cognitiveFunction, ab]));

  const allFunctionSet = new Set([...fnMapA.keys(), ...fnMapB.keys()]);
  const abilityComparisonList: AbilityComparison[] = [];
  const sharedFunctionList: CognitiveFunction[] = [];
  const uniqueToA: CognitiveFunction[] = [];
  const uniqueToB: CognitiveFunction[] = [];

  for (const fn of allFunctionSet) {
    const abilityA = fnMapA.get(fn);
    const abilityB = fnMapB.get(fn);

    abilityComparisonList.push({
      cognitiveFunction: fn,
      slotA: abilityA?.slot ?? null,
      slotB: abilityB?.slot ?? null,
      nameA: abilityA?.name ?? null,
      nameB: abilityB?.name ?? null,
    });

    if (abilityA && abilityB) {
      sharedFunctionList.push(fn);
    } else if (abilityA) {
      uniqueToA.push(fn);
    } else {
      uniqueToB.push(fn);
    }
  }

  // Ability power diffs for shared functions
  const abilityPowerDiffMap: Partial<
    Record<CognitiveFunction, { powerA: number; powerB: number }>
  > = {};
  for (const fn of sharedFunctionList) {
    const abilityA = fnMapA.get(fn);
    const abilityB = fnMapB.get(fn);
    if (!abilityA || !abilityB) continue;
    abilityPowerDiffMap[fn] = {
      powerA: computeAbilityPower(abilityA, a.stats),
      powerB: computeAbilityPower(abilityB, b.stats),
    };
  }

  // Passive comparison - collect all passive names from element + combat
  const passiveNameListA = [
    a.element.passiveTrait.name,
    ...a.combatBehavior.passives.map((p) => p.name),
    ...(a.archetype.instinctPassiveList?.map((p) => p.name) ?? []),
  ];
  const passiveNameListB = [
    b.element.passiveTrait.name,
    ...b.combatBehavior.passives.map((p) => p.name),
    ...(b.archetype.instinctPassiveList?.map((p) => p.name) ?? []),
  ];
  const passiveSetA = new Set(passiveNameListA);
  const passiveSetB = new Set(passiveNameListB);
  const passiveDiff: PassiveDiff = {
    sharedNameList: passiveNameListA.filter((name) => passiveSetB.has(name)),
    uniqueToA: passiveNameListA.filter((name) => !passiveSetB.has(name)),
    uniqueToB: passiveNameListB.filter((name) => !passiveSetA.has(name)),
  };

  return {
    statDiffMap,
    abilityComparisonList,
    sharedFunctionList,
    uniqueToA,
    uniqueToB,
    sameElement: a.element.element === b.element.element,
    sameOrientation:
      a.combatBehavior.combatOrientation === b.combatBehavior.combatOrientation,
    sameArchetype: a.archetype.className === b.archetype.className,
    sameQuadra: a.element.quadra === b.element.quadra,
    sameActivation:
      a.combatBehavior.activationStyle === b.combatBehavior.activationStyle,
    samePositioning:
      a.combatBehavior.positioning === b.combatBehavior.positioning,
    sameRegenSource:
      a.combatBehavior.regenSource === b.combatBehavior.regenSource,
    abilityPowerDiffMap,
    passiveDiff,
  };
}
