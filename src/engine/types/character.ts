import type { StatBlock, StatBreakdown } from "./stats.ts";
import type {
  MBTIType,
  APType,
  SocionicsType,
  EnneagramNumber,
  EnneagramInstinct,
} from "./typology.ts";
import type { Ability, AbilitySlot, AbilityOverrides } from "./abilities.ts";
import type { Archetype } from "./archetype.ts";
import type { Element, ElementAffinity } from "./element.ts";
import type { CombatBehavior, InstinctRealm } from "./combat.ts";

export interface GeneratorInput {
  mbti: MBTIType | null;
  enneagram: {
    type: EnneagramNumber;
    wing: EnneagramNumber;
    instinct: EnneagramInstinct;
    instinctStack?: [EnneagramInstinct, EnneagramInstinct, EnneagramInstinct];
    tritype?: [EnneagramNumber, EnneagramNumber, EnneagramNumber];
    tritypeWings?: [EnneagramNumber, EnneagramNumber];
  } | null;
  attitudinal: APType | null;
  socionics: SocionicsType | null;
  instincts: {
    realm: InstinctRealm;
    tritype?: [InstinctRealm, InstinctRealm, InstinctRealm];
  } | null;
  overrides: ManualOverrides;
}

export interface ManualOverrides {
  stats: Partial<StatBlock> | null;
  archetype: string | null;
  abilities: AbilityOverrides | null;
  element: Element | null;
  combatOrientation: string | null;
}

export type SystemId =
  | "mbti"
  | "enneagram"
  | "attitudinal"
  | "socionics"
  | "instincts";

export interface CharacterEdits {
  stats: Partial<StatBlock> | null;
  className: string | null;
  abilityNameList: Partial<Record<AbilitySlot, string>> | null;
  element: Element | null;
  combatOrientation: string | null;
}

export const EMPTY_CHARACTER_EDITS: CharacterEdits = {
  stats: null,
  className: null,
  abilityNameList: null,
  element: null,
  combatOrientation: null,
};

export interface SystemConfig {
  id: SystemId;
  name: string;
  description: string;
  enabled: boolean;
}

export interface TypologySource {
  attitudinal: APType | null;
  mbti: MBTIType | null;
  socionics: SocionicsType | null;
  enneagram: {
    type: EnneagramNumber;
    wing: EnneagramNumber;
    instinct: EnneagramInstinct;
    tritype?: [EnneagramNumber, EnneagramNumber, EnneagramNumber];
  } | null;
  instincts: {
    realm: InstinctRealm;
    tritype?: [InstinctRealm, InstinctRealm, InstinctRealm];
  } | null;
}

export interface Character {
  name: string;
  title: string;
  stats: StatBlock;
  statBreakdown: StatBreakdown;
  archetype: Archetype;
  abilities: Ability[];
  element: ElementAffinity;
  combatBehavior: CombatBehavior;
  /** Track which systems contributed to this character */
  activeSystems: SystemId[];
  /** Raw typology inputs used to generate this character */
  typologySource: TypologySource;
}
