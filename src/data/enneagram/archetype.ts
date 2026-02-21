import type {
  EnneagramNumber,
  EnneagramInstinct,
  StatName,
  Archetype,
  PassiveTrait,
  StatBlendStep,
} from "../../engine/types/index.ts";
import { ENNEAGRAM_TYPES } from "./types.ts";
import { WING_LABELS } from "./wings.ts";
import { ENNEAGRAM_INSTINCTS, INSTINCT_INFLUENCE } from "./instincts.ts";

// ============================================================
// INFLUENCE CONSTANTS
// ============================================================

/** Wing influence bleeds this fraction of the wing type's stat modifiers into the archetype. */
const WING_INFLUENCE = 0.3;

/** Instinct stacking influence — 2nd instinct is moderate, 3rd (blind spot) is weak. */
const INSTINCT_SECOND_INFLUENCE = 0.15;
const INSTINCT_THIRD_INFLUENCE = 0.05;

/** Tritype influence per position — 2nd fix is stronger than 3rd. Order matters. */
const TRITYPE_SECOND_INFLUENCE = 0.4;
const TRITYPE_THIRD_INFLUENCE = 0.2;

// ============================================================
// STAT BLENDING
// ============================================================

/** Blend wing stat modifiers into the base type's modifiers at a given influence fraction. */
function blendStatModifiers(
  base: Partial<Record<StatName, number>>,
  wing: Partial<Record<StatName, number>>,
  influence: number,
): Partial<Record<StatName, number>> {
  const statNameList: StatName[] = [
    "willpower",
    "intelligence",
    "spirit",
    "vitality",
  ];
  const result: Partial<Record<StatName, number>> = {};

  for (const stat of statNameList) {
    const baseValue = base[stat] ?? 1;
    const wingValue = wing[stat] ?? 1;
    const blended = baseValue + (wingValue - 1) * influence;
    if (blended !== 1) {
      result[stat] = Math.round(blended * 100) / 100;
    }
  }

  return result;
}

// ============================================================
// ARCHETYPE BUILDING
// ============================================================

/** Build a full Archetype from an enneagram type, wing, and optional instinct/stacking. */
export function buildArchetype(
  type: EnneagramNumber,
  wing: EnneagramNumber,
  instinct?: EnneagramInstinct,
  instinctStack?: [EnneagramInstinct, EnneagramInstinct, EnneagramInstinct],
): Archetype {
  const typeData = ENNEAGRAM_TYPES[type];
  const wingData = ENNEAGRAM_TYPES[wing];
  const wingLabel = WING_LABELS[wing];

  // Track stat blend chain
  const statBlendChainList: StatBlendStep[] = [
    {
      source: `Type ${type} (${typeData.className})`,
      influence: 1.0,
      modifiers: typeData.statModifiers,
    },
    {
      source: `Wing ${wing} (${WING_LABELS[wing]})`,
      influence: WING_INFLUENCE,
      modifiers: wingData.statModifiers,
    },
  ];

  let mergedModifiers = blendStatModifiers(
    typeData.statModifiers,
    wingData.statModifiers,
    WING_INFLUENCE,
  );

  // Blend instinct stat modifiers
  const instinctData = instinct ? ENNEAGRAM_INSTINCTS[instinct] : null;
  if (instinctData) {
    mergedModifiers = blendStatModifiers(
      mergedModifiers,
      instinctData.statModifiers,
      INSTINCT_INFLUENCE,
    );
    statBlendChainList.push({
      source: `Instinct (${instinct})`,
      influence: INSTINCT_INFLUENCE,
      modifiers: instinctData.statModifiers,
    });
  }

  // Build passives list from instinct stacking
  const instinctPassiveList: PassiveTrait[] = [];
  if (instinctStack) {
    // Dominant passive (already have data from instinctData)
    if (instinctData) {
      instinctPassiveList.push(instinctData.passive);
    }
    // 2nd instinct
    const secondInstinct = ENNEAGRAM_INSTINCTS[instinctStack[1]];
    mergedModifiers = blendStatModifiers(
      mergedModifiers,
      secondInstinct.statModifiers,
      INSTINCT_SECOND_INFLUENCE,
    );
    statBlendChainList.push({
      source: `2nd instinct (${instinctStack[1]})`,
      influence: INSTINCT_SECOND_INFLUENCE,
      modifiers: secondInstinct.statModifiers,
    });
    instinctPassiveList.push({
      ...secondInstinct.passive,
      source: `2nd instinct (${instinctStack[1]}) — ${secondInstinct.passive.source}`,
    });
    // 3rd instinct (blind spot)
    const thirdInstinct = ENNEAGRAM_INSTINCTS[instinctStack[2]];
    mergedModifiers = blendStatModifiers(
      mergedModifiers,
      thirdInstinct.statModifiers,
      INSTINCT_THIRD_INFLUENCE,
    );
    statBlendChainList.push({
      source: `3rd instinct (${instinctStack[2]})`,
      influence: INSTINCT_THIRD_INFLUENCE,
      modifiers: thirdInstinct.statModifiers,
    });
    instinctPassiveList.push({
      ...thirdInstinct.passive,
      source: `3rd instinct (${instinctStack[2]}) — ${thirdInstinct.passive.source}`,
    });
  } else if (instinctData) {
    instinctPassiveList.push(instinctData.passive);
  }

  const instinctSuffix = instinctStack
    ? ` (${instinctStack.join("/")})`
    : instinct
      ? ` (${instinct})`
      : "";

  return {
    className: `${wingLabel} ${typeData.className}${instinctSuffix}`,
    description: typeData.description,
    enneagramType: type,
    wing,
    statModifiers: mergedModifiers,
    empoweredState: typeData.empoweredState,
    stressedState: typeData.stressedState,
    instinctPassive: instinctPassiveList[0],
    instinctPassiveList:
      instinctPassiveList.length > 0 ? instinctPassiveList : undefined,
    integrationLine: `${type} → ${typeData.integrationTarget}`,
    disintegrationLine: `${type} → ${typeData.disintegrationTarget}`,
    statBlendChain: statBlendChainList,
  };
}

/**
 * Build an Archetype with tritype influences.
 * Tritype array is ordered: [core, 2nd fix, 3rd fix].
 * 2nd fix has stronger stat bleed than 3rd.
 */
export function buildTritypeArchetype(
  coreType: EnneagramNumber,
  wing: EnneagramNumber,
  tritype: [EnneagramNumber, EnneagramNumber, EnneagramNumber],
  tritypeWings?: [EnneagramNumber, EnneagramNumber],
  instinct?: EnneagramInstinct,
  instinctStack?: [EnneagramInstinct, EnneagramInstinct, EnneagramInstinct],
): Archetype {
  const baseArchetype = buildArchetype(coreType, wing, instinct, instinctStack);

  const secondFix = tritype[1];
  const thirdFix = tritype[2];

  // Build blended modifiers for each fix (incorporating their wing if provided)
  const secondFixModifiers = tritypeWings
    ? blendStatModifiers(
        ENNEAGRAM_TYPES[secondFix].statModifiers,
        ENNEAGRAM_TYPES[tritypeWings[0]].statModifiers,
        WING_INFLUENCE,
      )
    : ENNEAGRAM_TYPES[secondFix].statModifiers;
  const thirdFixModifiers = tritypeWings
    ? blendStatModifiers(
        ENNEAGRAM_TYPES[thirdFix].statModifiers,
        ENNEAGRAM_TYPES[tritypeWings[1]].statModifiers,
        WING_INFLUENCE,
      )
    : ENNEAGRAM_TYPES[thirdFix].statModifiers;

  let modifiers = baseArchetype.statModifiers;
  modifiers = blendStatModifiers(
    modifiers,
    secondFixModifiers,
    TRITYPE_SECOND_INFLUENCE,
  );
  modifiers = blendStatModifiers(
    modifiers,
    thirdFixModifiers,
    TRITYPE_THIRD_INFLUENCE,
  );

  const tritypeLabel = tritype.join("-");

  // Extend blend chain with tritype fix steps
  const tritypeBlendChainList: StatBlendStep[] = [
    ...(baseArchetype.statBlendChain ?? []),
    {
      source: `2nd fix (Type ${secondFix})`,
      influence: TRITYPE_SECOND_INFLUENCE,
      modifiers: secondFixModifiers,
    },
    {
      source: `3rd fix (Type ${thirdFix})`,
      influence: TRITYPE_THIRD_INFLUENCE,
      modifiers: thirdFixModifiers,
    },
  ];

  return {
    ...baseArchetype,
    className: `${baseArchetype.className} [${tritypeLabel}]`,
    statModifiers: modifiers,
    statBlendChain: tritypeBlendChainList,
  };
}
