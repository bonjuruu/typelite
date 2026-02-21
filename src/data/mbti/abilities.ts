import type {
  MBTIType,
  CognitiveFunction,
  Ability,
  AbilitySlot,
  AbilityTag,
} from "../../engine/types/index.ts";
import {
  FUNCTION_STACKS,
  SLOTS,
  SLOT_BASE_POWER,
  COGNITIVE_FUNCTIONS,
  TAG_GLOSSARY,
} from "./types.ts";

/** Get the description for an ability tag. */
export function getTagDescription(tag: AbilityTag): string {
  return TAG_GLOSSARY[tag];
}

/** Get the essence text for a cognitive function. */
export function getCognitiveFunctionEssence(fn: CognitiveFunction): string {
  return COGNITIVE_FUNCTIONS[fn].essence;
}

// ============================================================
// PUBLIC API
// ============================================================

export const MBTI_TYPE_LIST: readonly MBTIType[] = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

/** Get the 4-function Beebe stack for an MBTI type. */
export function getFunctionStack(
  mbtiType: MBTIType,
): [CognitiveFunction, CognitiveFunction, CognitiveFunction, CognitiveFunction] {
  return FUNCTION_STACKS[mbtiType];
}

/** Get display info for a cognitive function. */
export function getCognitiveFunctionName(fn: CognitiveFunction): string {
  return COGNITIVE_FUNCTIONS[fn].name;
}

/** Build a single ability from a cognitive function and slot. */
export function buildAbility(
  cognitiveFunction: CognitiveFunction,
  slot: AbilitySlot,
): Ability {
  const functionData = COGNITIVE_FUNCTIONS[cognitiveFunction];
  const template = functionData.abilities[slot];

  return {
    name: template.name,
    description: template.description,
    slot,
    cognitiveFunction,
    basePower: SLOT_BASE_POWER[slot],
    scalingStat: functionData.scalingStat,
    tags: template.tags,
  };
}

/** Get the ability name for a given cognitive function at a given slot. */
export function getAbilityName(
  cognitiveFunction: CognitiveFunction,
  slot: AbilitySlot,
): string {
  return COGNITIVE_FUNCTIONS[cognitiveFunction].abilities[slot].name;
}

/** Build the 4-ability kit for an MBTI type. */
export function buildAbilityKit(mbtiType: MBTIType): Ability[] {
  const stack = FUNCTION_STACKS[mbtiType];

  return stack.map((cognitiveFunction, index): Ability => {
    const slot = SLOTS[index];
    const functionData = COGNITIVE_FUNCTIONS[cognitiveFunction];
    const template = functionData.abilities[slot];

    return {
      name: template.name,
      description: template.description,
      slot,
      cognitiveFunction,
      basePower: SLOT_BASE_POWER[slot],
      scalingStat: functionData.scalingStat,
      tags: template.tags,
    };
  });
}
