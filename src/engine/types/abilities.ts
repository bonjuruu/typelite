import type { CognitiveFunction } from "./typology.ts";
import type { StatName } from "./stats.ts";

export type AbilitySlot = "hero" | "parent" | "child" | "inferior";

export interface Ability {
  name: string;
  description: string;
  slot: AbilitySlot;
  cognitiveFunction: CognitiveFunction;
  /** Base power before stat scaling */
  basePower: number;
  /** Which stat this ability scales off */
  scalingStat: StatName;
  /** Tags for flavor/categorization */
  tags: AbilityTag[];
}

export type AbilityTag =
  | "damage"
  | "heal"
  | "buff"
  | "debuff"
  | "utility"
  | "aoe"
  | "single-target"
  | "self"
  | "chaotic"
  | "defensive"
  | "reactive";

export interface AbilityOverrides {
  hero: CognitiveFunction;
  parent: CognitiveFunction;
  child: CognitiveFunction;
  inferior: CognitiveFunction;
}
