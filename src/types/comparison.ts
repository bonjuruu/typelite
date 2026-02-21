import type {
  Character,
  StatName,
  CognitiveFunction,
  AbilitySlot,
} from "../engine/types/index.ts";

export interface ComparisonSlot {
  character: Character;
  name: string;
}

export interface AbilityComparison {
  cognitiveFunction: CognitiveFunction;
  slotA: AbilitySlot | null;
  slotB: AbilitySlot | null;
  nameA: string | null;
  nameB: string | null;
}

export interface PassiveDiff {
  sharedNameList: string[];
  uniqueToA: string[];
  uniqueToB: string[];
}

export interface CharacterDiff {
  statDiffMap: Record<StatName, number>;
  abilityComparisonList: AbilityComparison[];
  sharedFunctionList: CognitiveFunction[];
  uniqueToA: CognitiveFunction[];
  uniqueToB: CognitiveFunction[];
  sameElement: boolean;
  sameOrientation: boolean;
  sameArchetype: boolean;
  sameQuadra: boolean;
  sameActivation: boolean;
  samePositioning: boolean;
  sameRegenSource: boolean;
  abilityPowerDiffMap: Partial<
    Record<CognitiveFunction, { powerA: number; powerB: number }>
  >;
  passiveDiff: PassiveDiff;
}
