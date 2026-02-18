import type {
  InstinctRealm,
  InstinctCenter,
  ExperientialTriad,
  MovementTriad,
  SourceTriad,
  CombatBehavior,
  PassiveTrait,
} from '../engine/types.ts'

// ============================================================
// REALM DATA
// ============================================================

interface InstinctRealmData {
  realm: InstinctRealm
  name: string
  center: InstinctCenter
  experiential: ExperientialTriad
  movement: MovementTriad
  source: SourceTriad
}

const INSTINCT_REALMS: Record<InstinctRealm, InstinctRealmData> = {
  // SUR (Self-Survival)
  FD: { realm: 'FD', name: 'Fortitude',        center: 'SUR', experiential: 'Immersing',      movement: 'Directing',  source: 'Externalizing' },
  SY: { realm: 'SY', name: 'Security',         center: 'SUR', experiential: 'Distinguishing', movement: 'Escaping',   source: 'Internalizing' },
  SM: { realm: 'SM', name: 'Self-Management',   center: 'SUR', experiential: 'Memorializing',  movement: 'Aligning',   source: 'Exchanging' },

  // INT (Interpersonal)
  AY: { realm: 'AY', name: 'Alchemy',          center: 'INT', experiential: 'Immersing',      movement: 'Escaping',   source: 'Exchanging' },
  CY: { realm: 'CY', name: 'Community',        center: 'INT', experiential: 'Distinguishing', movement: 'Aligning',   source: 'Externalizing' },
  BG: { realm: 'BG', name: 'Bonding',          center: 'INT', experiential: 'Memorializing',  movement: 'Directing',  source: 'Internalizing' },

  // PUR (Purpose)
  SS: { realm: 'SS', name: 'Self-Significance', center: 'PUR', experiential: 'Immersing',      movement: 'Aligning',   source: 'Internalizing' },
  EX: { realm: 'EX', name: 'Existentialism',   center: 'PUR', experiential: 'Distinguishing', movement: 'Directing',  source: 'Exchanging' },
  UN: { realm: 'UN', name: 'Unknown',          center: 'PUR', experiential: 'Memorializing',  movement: 'Escaping',   source: 'Externalizing' },
}

// ============================================================
// CENTER → COMBAT ORIENTATION
// ============================================================

const CENTER_ORIENTATIONS: Record<InstinctCenter, string> = {
  SUR: 'Frontline',
  INT: 'Support',
  PUR: 'Strategist',
}

// ============================================================
// TRIAD → PASSIVES
// ============================================================

const EXPERIENTIAL_PASSIVES: Record<ExperientialTriad, PassiveTrait> = {
  Memorializing: {
    name: 'Afterimage',
    description: 'Abilities leave lingering effects that persist for extra ticks.',
    source: 'Experiential triad (Memorializing)',
  },
  Immersing: {
    name: 'Flow State',
    description: 'Consecutive ability uses build momentum, increasing power.',
    source: 'Experiential triad (Immersing)',
  },
  Distinguishing: {
    name: 'Precision Timing',
    description: 'Abilities have a critical window that deals bonus damage when hit.',
    source: 'Experiential triad (Distinguishing)',
  },
}

const MOVEMENT_PASSIVES: Record<MovementTriad, PassiveTrait> = {
  Escaping: {
    name: 'Evasive',
    description: 'Gains dodge chance and can reposition after taking damage.',
    source: 'Movement triad (Escaping/Yin)',
  },
  Aligning: {
    name: 'Adaptive Stance',
    description: 'Automatically adjusts positioning to match the flow of combat.',
    source: 'Movement triad (Aligning/Neutral)',
  },
  Directing: {
    name: 'Aggressive Advance',
    description: 'Closes distance after attacking. Pressures enemies relentlessly.',
    source: 'Movement triad (Directing/Yang)',
  },
}

const SOURCE_PASSIVES: Record<SourceTriad, PassiveTrait> = {
  Internalizing: {
    name: 'Inner Reserve',
    description: 'Passively regenerates resources over time, independent of combat.',
    source: 'Source triad (Internalizing)',
  },
  Externalizing: {
    name: 'Siphon',
    description: 'Regenerates resources when dealing damage to enemies.',
    source: 'Source triad (Externalizing)',
  },
  Exchanging: {
    name: 'Equilibrium',
    description: 'Regenerates resources from both dealing and receiving damage.',
    source: 'Source triad (Exchanging)',
  },
}

// ============================================================
// TRIAD GAMEPLAY DESCRIPTIONS
// ============================================================

const TRIAD_DESCRIPTIONS = {
  experiential: {
    Memorializing: 'Abilities leave echoes — effects linger past their base duration, stacking pressure over time.',
    Immersing: 'Consecutive casts build flow state — each use ramps power for the next.',
    Distinguishing: 'Perfect timing windows — hit the critical moment for burst damage, miss it for weak output.',
  } as Record<ExperientialTriad, string>,
  movement: {
    Escaping: 'Evasive and reactive — dodge chance increases, repositions after taking damage.',
    Aligning: 'Adaptive flow — positioning auto-adjusts to match the flow of combat.',
    Directing: 'Relentless aggression — closes distance after attacks, applies constant pressure.',
  } as Record<MovementTriad, string>,
  source: {
    Internalizing: 'Passive regen — resources restore slowly over time, independent of combat.',
    Externalizing: 'Damage-fueled — siphon energy from hitting enemies, rewarding aggression.',
    Exchanging: 'Bidirectional flow — gain resources from both dealing and receiving damage.',
  } as Record<SourceTriad, string>,
} as const

type TriadCategory = keyof typeof TRIAD_DESCRIPTIONS

/** Get the gameplay description for a specific triad value. */
export function getTriadDescription(category: TriadCategory, triadValue: string): string {
  const descriptions = TRIAD_DESCRIPTIONS[category]
  return (descriptions as Record<string, string>)[triadValue] ?? ''
}

// ============================================================
// PUBLIC API
// ============================================================

export const INSTINCT_REALM_LIST: readonly InstinctRealm[] = [
  'FD', 'SY', 'SM',
  'AY', 'CY', 'BG',
  'SS', 'EX', 'UN',
] as const

export const INSTINCT_CENTER_LIST: readonly InstinctCenter[] = ['SUR', 'INT', 'PUR'] as const

export const REALMS_BY_CENTER: Record<InstinctCenter, readonly InstinctRealm[]> = {
  SUR: ['FD', 'SY', 'SM'],
  INT: ['AY', 'CY', 'BG'],
  PUR: ['SS', 'EX', 'UN'],
}

/** Get the center a realm belongs to. */
export function getRealmCenter(realm: InstinctRealm): InstinctCenter {
  return INSTINCT_REALMS[realm].center
}

/** Get the core data for an instinct realm. */
export function getInstinctRealm(realm: InstinctRealm): InstinctRealmData {
  return INSTINCT_REALMS[realm]
}

/** Get the full display name for a realm (e.g. "FD" → "Fortitude"). */
export function getRealmName(realm: InstinctRealm): string {
  return INSTINCT_REALMS[realm].name
}

/** Build the full CombatBehavior from a realm selection. */
export function buildCombatBehavior(realm: InstinctRealm): CombatBehavior {
  const realmData = INSTINCT_REALMS[realm]

  return {
    realm,
    center: realmData.center,
    combatOrientation: CENTER_ORIENTATIONS[realmData.center],
    activationStyle: realmData.experiential,
    positioning: realmData.movement,
    regenSource: realmData.source,
    passives: [
      EXPERIENTIAL_PASSIVES[realmData.experiential],
      MOVEMENT_PASSIVES[realmData.movement],
      SOURCE_PASSIVES[realmData.source],
    ],
  }
}

/**
 * Build CombatBehavior with tritype influences.
 * Tritype array is ordered: [core, 2nd fix, 3rd fix].
 * 2nd and 3rd fix add their passives (deduplicated by name).
 */
export function buildTritypeCombatBehavior(
  coreRealm: InstinctRealm,
  tritype: [InstinctRealm, InstinctRealm, InstinctRealm],
): CombatBehavior {
  const coreBehavior = buildCombatBehavior(coreRealm)

  const secondFixRealm = INSTINCT_REALMS[tritype[1]]
  const thirdFixRealm = INSTINCT_REALMS[tritype[2]]

  const secondFixPassiveList: PassiveTrait[] = [
    { ...EXPERIENTIAL_PASSIVES[secondFixRealm.experiential], source: `2nd fix — ${EXPERIENTIAL_PASSIVES[secondFixRealm.experiential].source}` },
    { ...MOVEMENT_PASSIVES[secondFixRealm.movement], source: `2nd fix — ${MOVEMENT_PASSIVES[secondFixRealm.movement].source}` },
    { ...SOURCE_PASSIVES[secondFixRealm.source], source: `2nd fix — ${SOURCE_PASSIVES[secondFixRealm.source].source}` },
  ]

  const thirdFixPassiveList: PassiveTrait[] = [
    { ...EXPERIENTIAL_PASSIVES[thirdFixRealm.experiential], source: `3rd fix — ${EXPERIENTIAL_PASSIVES[thirdFixRealm.experiential].source}` },
    { ...MOVEMENT_PASSIVES[thirdFixRealm.movement], source: `3rd fix — ${MOVEMENT_PASSIVES[thirdFixRealm.movement].source}` },
    { ...SOURCE_PASSIVES[thirdFixRealm.source], source: `3rd fix — ${SOURCE_PASSIVES[thirdFixRealm.source].source}` },
  ]

  // Deduplicate by passive name (keep core version when duplicate)
  const corePassiveNameSet = new Set(coreBehavior.passives.map((p) => p.name))
  const filteredSecondFixPassiveList = secondFixPassiveList.filter((p) => !corePassiveNameSet.has(p.name))

  const allPassiveNameSet = new Set([...corePassiveNameSet, ...filteredSecondFixPassiveList.map((p) => p.name)])
  const filteredThirdFixPassiveList = thirdFixPassiveList.filter((p) => !allPassiveNameSet.has(p.name))

  return {
    ...coreBehavior,
    passives: [
      ...coreBehavior.passives,
      ...filteredSecondFixPassiveList,
      ...filteredThirdFixPassiveList,
    ],
  }
}

/** Get all realms in a given center. */
export function getRealmsByCenter(center: InstinctCenter): InstinctRealmData[] {
  return Object.values(INSTINCT_REALMS).filter((realmData) => realmData.center === center)
}
