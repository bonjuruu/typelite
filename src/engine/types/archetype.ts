import type { StatName } from "./stats.ts";
import type { EnneagramNumber } from "./typology.ts";
import type { PassiveTrait } from "./element.ts";

export interface StatBlendStep {
  source: string;
  influence: number;
  modifiers: Partial<Record<StatName, number>>;
}

export interface Archetype {
  className: string;
  description: string;
  enneagramType: EnneagramNumber;
  wing: number;
  /** Stat modifiers applied on top of AP base stats (multipliers) */
  statModifiers: Partial<Record<StatName, number>>;
  /** Buff when character is "empowered" (integration line) */
  empoweredState: StatusEffect;
  /** Debuff when character is "stressed" (disintegration line) */
  stressedState: StatusEffect;
  /** Passive from dominant instinctual variant (sp/so/sx) */
  instinctPassive?: PassiveTrait;
  /** Full instinct stacking passives (dominant + 2nd + blind spot) */
  instinctPassiveList?: PassiveTrait[];
  /** Integration line context, e.g. "1 → 7" */
  integrationLine?: string;
  /** Disintegration line context, e.g. "1 → 4" */
  disintegrationLine?: string;
  /** Step-by-step breakdown of how stat modifiers were blended */
  statBlendChain?: StatBlendStep[];
}

/** Resolve instinct passives from either the stacked list or the single legacy field. */
export function getArchetypePassiveList(archetype: Archetype): PassiveTrait[] {
  return archetype.instinctPassiveList ??
    (archetype.instinctPassive ? [archetype.instinctPassive] : []);
}

export interface StatusEffect {
  name: string;
  description: string;
  statChanges: Partial<Record<StatName, number>>;
}
