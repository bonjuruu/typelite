import type { StatBlock, StatName, Ability } from "./types/index.ts";

/** Maximum value any single stat can reach. */
export const MAX_STAT = 20;

// ============================================================
// STAT MODIFIERS
// ============================================================

/** Apply multiplier-based modifiers to a stat block (e.g. Enneagram class modifiers). */
export function applyStatMultipliers(
  baseStats: StatBlock,
  multipliers: Partial<Record<StatName, number>>,
): StatBlock {
  return {
    willpower: Math.round(baseStats.willpower * (multipliers.willpower ?? 1)),
    intelligence: Math.round(
      baseStats.intelligence * (multipliers.intelligence ?? 1),
    ),
    spirit: Math.round(baseStats.spirit * (multipliers.spirit ?? 1)),
    vitality: Math.round(baseStats.vitality * (multipliers.vitality ?? 1)),
  };
}

/** Apply flat additive changes to a stat block (e.g. empowered/stressed state). */
export function applyStatChanges(
  stats: StatBlock,
  changes: Partial<Record<StatName, number>>,
): StatBlock {
  return {
    willpower: stats.willpower + (changes.willpower ?? 0),
    intelligence: stats.intelligence + (changes.intelligence ?? 0),
    spirit: stats.spirit + (changes.spirit ?? 0),
    vitality: stats.vitality + (changes.vitality ?? 0),
  };
}

/** Override specific stats with manual values, keeping the rest unchanged. */
export function applyStatOverrides(
  stats: StatBlock,
  overrides: Partial<StatBlock> | null,
): StatBlock {
  if (!overrides) return stats;

  return {
    willpower: overrides.willpower ?? stats.willpower,
    intelligence: overrides.intelligence ?? stats.intelligence,
    spirit: overrides.spirit ?? stats.spirit,
    vitality: overrides.vitality ?? stats.vitality,
  };
}

// ============================================================
// ABILITY SCALING
// ============================================================

/** Scale an ability's base power using the character's stats. Returns the computed power value. */
export function computeAbilityPower(
  ability: Ability,
  stats: StatBlock,
): number {
  const statValue = stats[ability.scalingStat];
  const scalingFactor = 1 + statValue / MAX_STAT;
  return Math.round(ability.basePower * scalingFactor);
}

// ============================================================
// DEFAULTS (for when systems are toggled off)
// ============================================================

const DEFAULT_BASE_VALUE = 8;

export const DEFAULT_STATS: StatBlock = {
  willpower: DEFAULT_BASE_VALUE,
  intelligence: DEFAULT_BASE_VALUE,
  spirit: DEFAULT_BASE_VALUE,
  vitality: DEFAULT_BASE_VALUE,
};
