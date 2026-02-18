import type { EnneagramNumber, EnneagramInstinct, StatName, Archetype, StatusEffect, PassiveTrait, StatBlendStep } from '../engine/types.ts'

// ============================================================
// CORE TYPE DATA
// ============================================================

interface EnneagramTypeData {
  type: EnneagramNumber
  name: string
  className: string
  description: string
  wings: [EnneagramNumber, EnneagramNumber]
  integrationTarget: EnneagramNumber
  disintegrationTarget: EnneagramNumber
  statModifiers: Partial<Record<StatName, number>>
  empoweredState: StatusEffect
  stressedState: StatusEffect
}

const ENNEAGRAM_TYPES: Record<EnneagramNumber, EnneagramTypeData> = {
  1: {
    type: 1,
    name: 'The Reformer',
    className: 'Justicar',
    description: 'Wreathed in cold judgment, every strike is a verdict — precise, final, and without mercy. Inner conviction burns hotter than any flame.',
    wings: [9, 2],
    integrationTarget: 7,
    disintegrationTarget: 4,
    statModifiers: { willpower: 1.15, intelligence: 1.05 },
    empoweredState: {
      name: 'Liberated',
      description: 'Gains the spontaneity of 7 — becomes joyful and open.',
      statChanges: { spirit: 3 },
    },
    stressedState: {
      name: 'Melancholic',
      description: 'Falls into the moodiness of 4 — becomes withdrawn and envious.',
      statChanges: { spirit: -3 },
    },
  },
  2: {
    type: 2,
    name: 'The Helper',
    className: 'Cleric',
    description: 'Binds wounds with devotion and breaks curses with sacrifice. Power swells with every ally shielded — and every debt left unpaid.',
    wings: [1, 3],
    integrationTarget: 4,
    disintegrationTarget: 8,
    statModifiers: { spirit: 1.15, vitality: 1.05 },
    empoweredState: {
      name: 'Self-Aware',
      description: 'Gains the depth of 4 — becomes emotionally honest and creative.',
      statChanges: { intelligence: 3 },
    },
    stressedState: {
      name: 'Domineering',
      description: 'Falls into the aggression of 8 — becomes controlling and confrontational.',
      statChanges: { intelligence: -3 },
    },
  },
  3: {
    type: 3,
    name: 'The Achiever',
    className: 'Warlord',
    description: 'Born to conquer, reads the battlefield like a ledger and always comes out ahead. Victory itself is worn as armor, every stance reshaped to exploit the next weakness.',
    wings: [2, 4],
    integrationTarget: 6,
    disintegrationTarget: 9,
    statModifiers: { willpower: 1.1, intelligence: 1.1 },
    empoweredState: {
      name: 'Devoted',
      description: 'Gains the loyalty of 6 — becomes cooperative and committed.',
      statChanges: { vitality: 3 },
    },
    stressedState: {
      name: 'Disengaged',
      description: 'Falls into the apathy of 9 — becomes passive and numb.',
      statChanges: { willpower: -3 },
    },
  },
  4: {
    type: 4,
    name: 'The Individualist',
    className: 'Bard',
    description: 'Grief, longing, and fury are the only instruments needed — each note a spell that warps reality. Most dangerous when the ache runs deepest.',
    wings: [3, 5],
    integrationTarget: 1,
    disintegrationTarget: 2,
    statModifiers: { spirit: 1.2 },
    empoweredState: {
      name: 'Disciplined',
      description: 'Gains the principle of 1 — becomes focused and purposeful.',
      statChanges: { willpower: 3 },
    },
    stressedState: {
      name: 'Dependent',
      description: 'Falls into the neediness of 2 — becomes clingy and resentful.',
      statChanges: { willpower: -3 },
    },
  },
  5: {
    type: 5,
    name: 'The Investigator',
    className: 'Sage',
    description: 'Devours forbidden knowledge and waits in silence until the perfect moment to unleash it. One carefully hoarded secret can unravel an entire army.',
    wings: [4, 6],
    integrationTarget: 8,
    disintegrationTarget: 7,
    statModifiers: { intelligence: 1.2 },
    empoweredState: {
      name: 'Assertive',
      description: 'Gains the confidence of 8 — becomes decisive and powerful.',
      statChanges: { willpower: 3 },
    },
    stressedState: {
      name: 'Scattered',
      description: 'Falls into the excess of 7 — becomes impulsive and unfocused.',
      statChanges: { intelligence: -3 },
    },
  },
  6: {
    type: 6,
    name: 'The Loyalist',
    className: 'Sentinel',
    description: 'Has already mapped every ambush, every trap, every betrayal that could befall the party. Vigilance is a fortress — and paranoia, a weapon.',
    wings: [5, 7],
    integrationTarget: 9,
    disintegrationTarget: 3,
    statModifiers: { vitality: 1.15, willpower: 1.05 },
    empoweredState: {
      name: 'Serene',
      description: 'Gains the peace of 9 — becomes calm and receptive.',
      statChanges: { spirit: 3 },
    },
    stressedState: {
      name: 'Performative',
      description: 'Falls into the image-focus of 3 — becomes competitive and hollow.',
      statChanges: { vitality: -3 },
    },
  },
  7: {
    type: 7,
    name: 'The Enthusiast',
    className: 'Trickster',
    description: 'Dances through ruin with a grin, turning every catastrophe into an opportunity. Probability bends in their wake — fortune favors the unhinged.',
    wings: [6, 8],
    integrationTarget: 5,
    disintegrationTarget: 1,
    statModifiers: { spirit: 1.1, intelligence: 1.1 },
    empoweredState: {
      name: 'Focused',
      description: 'Gains the depth of 5 — becomes contemplative and masterful.',
      statChanges: { intelligence: 3 },
    },
    stressedState: {
      name: 'Rigid',
      description: 'Falls into the perfectionism of 1 — becomes critical and inflexible.',
      statChanges: { spirit: -3 },
    },
  },
  8: {
    type: 8,
    name: 'The Challenger',
    className: 'Berserker',
    description: 'Does not strategize — only annihilates. Sheer willpower replaces armor, and every wound taken only deepens the fury that makes the next blow unstoppable.',
    wings: [7, 9],
    integrationTarget: 2,
    disintegrationTarget: 5,
    statModifiers: { willpower: 1.2 },
    empoweredState: {
      name: 'Compassionate',
      description: 'Gains the warmth of 2 — becomes protective and magnanimous.',
      statChanges: { spirit: 3 },
    },
    stressedState: {
      name: 'Withdrawn',
      description: 'Falls into the isolation of 5 — becomes secretive and detached.',
      statChanges: { vitality: -3 },
    },
  },
  9: {
    type: 9,
    name: 'The Peacemaker',
    className: 'Druid',
    description: 'Still as ancient stone, draws power from the land itself and channels it through those nearby. Allies endure, enemies slowly wither, and the earth remembers.',
    wings: [8, 1],
    integrationTarget: 3,
    disintegrationTarget: 6,
    statModifiers: { vitality: 1.1, spirit: 1.1 },
    empoweredState: {
      name: 'Driven',
      description: 'Gains the ambition of 3 — becomes energetic and effective.',
      statChanges: { willpower: 3 },
    },
    stressedState: {
      name: 'Anxious',
      description: 'Falls into the worry of 6 — becomes suspicious and reactive.',
      statChanges: { spirit: -3 },
    },
  },
}

// ============================================================
// CENTERS (for tritype)
// ============================================================

export type EnneagramCenter = 'Gut' | 'Heart' | 'Head'

const TYPE_TO_CENTER: Record<EnneagramNumber, EnneagramCenter> = {
  8: 'Gut', 9: 'Gut', 1: 'Gut',
  2: 'Heart', 3: 'Heart', 4: 'Heart',
  5: 'Head', 6: 'Head', 7: 'Head',
}

export const CENTER_TYPES: Record<EnneagramCenter, readonly EnneagramNumber[]> = {
  Gut: [8, 9, 1],
  Heart: [2, 3, 4],
  Head: [5, 6, 7],
}

export const CENTER_LIST: readonly EnneagramCenter[] = ['Gut', 'Heart', 'Head'] as const

/** Get the center a type belongs to. */
export function getCenter(type: EnneagramNumber): EnneagramCenter {
  return TYPE_TO_CENTER[type]
}

// ============================================================
// WING LABELS
// ============================================================

/** Subclass flavor a wing adds to the base class. */
const WING_LABELS: Record<EnneagramNumber, string> = {
  1: 'Principled',
  2: 'Compassionate',
  3: 'Ambitious',
  4: 'Expressive',
  5: 'Cerebral',
  6: 'Vigilant',
  7: 'Chaotic',
  8: 'Fierce',
  9: 'Serene',
}

// ============================================================
// WING FLAVOR
// ============================================================

interface WingFlavor {
  label: string
  description: string
}

const WING_FLAVOR: Record<EnneagramNumber, WingFlavor> = {
  1: { label: 'Principled', description: 'Adds rigorous structure and moral clarity — every action is measured against an internal code.' },
  2: { label: 'Compassionate', description: 'Softens edges with warmth and generosity — power is wielded in service of connection.' },
  3: { label: 'Ambitious', description: 'Injects competitive drive and image-consciousness — success becomes both goal and armor.' },
  4: { label: 'Expressive', description: 'Deepens emotional intensity and aesthetic vision — combat becomes an art form.' },
  5: { label: 'Cerebral', description: 'Withdraws into analysis and resource hoarding — knowledge is weaponized with precision.' },
  6: { label: 'Vigilant', description: 'Heightens threat detection and preparedness — every scenario has been war-gamed.' },
  7: { label: 'Chaotic', description: 'Embraces spontaneity and possibility — constraint is the only true enemy.' },
  8: { label: 'Fierce', description: 'Amplifies raw intensity and dominance — power flows without hesitation or apology.' },
  9: { label: 'Serene', description: 'Mellows conflict with acceptance and calm — battles are won through endurance, not force.' },
}

/** Get the flavor text for a wing type. */
export function getWingFlavor(wing: EnneagramNumber): WingFlavor {
  return WING_FLAVOR[wing]
}

// ============================================================
// INSTINCTUAL VARIANTS (sp/so/sx)
// ============================================================

interface InstinctData {
  variant: EnneagramInstinct
  label: string
  fullName: string
  statModifiers: Partial<Record<StatName, number>>
  passive: PassiveTrait
}

const ENNEAGRAM_INSTINCTS: Record<EnneagramInstinct, InstinctData> = {
  sp: {
    variant: 'sp',
    label: 'Guardian',
    fullName: 'Self-Preservation',
    statModifiers: { vitality: 1.08 },
    passive: {
      name: 'Fortified',
      description: 'Passively regenerates a small amount of health over time.',
      source: 'Instinctual variant (sp)',
    },
  },
  so: {
    variant: 'so',
    label: 'Herald',
    fullName: 'Social',
    statModifiers: { spirit: 1.08 },
    passive: {
      name: 'Rally',
      description: 'Nearby allies gain a minor stat boost when grouped.',
      source: 'Instinctual variant (so)',
    },
  },
  sx: {
    variant: 'sx',
    label: 'Intense',
    fullName: 'Sexual',
    statModifiers: { willpower: 1.08 },
    passive: {
      name: 'Fixation',
      description: 'Damage against a single target increases with consecutive hits.',
      source: 'Instinctual variant (sx)',
    },
  },
}

const INSTINCT_INFLUENCE = 0.3

// ============================================================
// PUBLIC API
// ============================================================

export const ENNEAGRAM_TYPE_LIST: readonly EnneagramNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export const ENNEAGRAM_INSTINCT_LIST: readonly EnneagramInstinct[] = ['sp', 'so', 'sx'] as const

/** Get the display label for an instinctual variant. */
export function getInstinctLabel(instinct: EnneagramInstinct): string {
  return ENNEAGRAM_INSTINCTS[instinct].label
}

/** Get the full name for an instinctual variant. */
export function getInstinctFullName(instinct: EnneagramInstinct): string {
  return ENNEAGRAM_INSTINCTS[instinct].fullName
}

/** Get the core data for an enneagram type. */
export function getEnneagramType(type: EnneagramNumber): EnneagramTypeData {
  return ENNEAGRAM_TYPES[type]
}

/** Get the valid wings for a given enneagram type. */
export function getWings(type: EnneagramNumber): [EnneagramNumber, EnneagramNumber] {
  return ENNEAGRAM_TYPES[type].wings
}

/** Wing influence bleeds this fraction of the wing type's stat modifiers into the archetype. */
const WING_INFLUENCE = 0.3

/** Instinct stacking influence — 2nd instinct is moderate, 3rd (blind spot) is weak. */
const INSTINCT_SECOND_INFLUENCE = 0.15
const INSTINCT_THIRD_INFLUENCE = 0.05

/** Build a full Archetype from an enneagram type, wing, and optional instinct/stacking. */
export function buildArchetype(
  type: EnneagramNumber,
  wing: EnneagramNumber,
  instinct?: EnneagramInstinct,
  instinctStack?: [EnneagramInstinct, EnneagramInstinct, EnneagramInstinct],
): Archetype {
  const typeData = ENNEAGRAM_TYPES[type]
  const wingData = ENNEAGRAM_TYPES[wing]
  const wingLabel = WING_LABELS[wing]

  // Track stat blend chain
  const statBlendChainList: StatBlendStep[] = [
    { source: `Type ${type} (${typeData.className})`, influence: 1.0, modifiers: typeData.statModifiers },
    { source: `Wing ${wing} (${WING_LABELS[wing]})`, influence: WING_INFLUENCE, modifiers: wingData.statModifiers },
  ]

  let mergedModifiers = blendStatModifiers(typeData.statModifiers, wingData.statModifiers, WING_INFLUENCE)

  // Blend instinct stat modifiers
  const instinctData = instinct ? ENNEAGRAM_INSTINCTS[instinct] : null
  if (instinctData) {
    mergedModifiers = blendStatModifiers(mergedModifiers, instinctData.statModifiers, INSTINCT_INFLUENCE)
    statBlendChainList.push({ source: `Instinct (${instinct})`, influence: INSTINCT_INFLUENCE, modifiers: instinctData.statModifiers })
  }

  // Build passives list from instinct stacking
  const instinctPassiveList: PassiveTrait[] = []
  if (instinctStack) {
    // Dominant passive (already have data from instinctData)
    if (instinctData) {
      instinctPassiveList.push(instinctData.passive)
    }
    // 2nd instinct
    const secondInstinct = ENNEAGRAM_INSTINCTS[instinctStack[1]]
    mergedModifiers = blendStatModifiers(mergedModifiers, secondInstinct.statModifiers, INSTINCT_SECOND_INFLUENCE)
    statBlendChainList.push({ source: `2nd instinct (${instinctStack[1]})`, influence: INSTINCT_SECOND_INFLUENCE, modifiers: secondInstinct.statModifiers })
    instinctPassiveList.push({
      ...secondInstinct.passive,
      source: `2nd instinct (${instinctStack[1]}) — ${secondInstinct.passive.source}`,
    })
    // 3rd instinct (blind spot)
    const thirdInstinct = ENNEAGRAM_INSTINCTS[instinctStack[2]]
    mergedModifiers = blendStatModifiers(mergedModifiers, thirdInstinct.statModifiers, INSTINCT_THIRD_INFLUENCE)
    statBlendChainList.push({ source: `3rd instinct (${instinctStack[2]})`, influence: INSTINCT_THIRD_INFLUENCE, modifiers: thirdInstinct.statModifiers })
    instinctPassiveList.push({
      ...thirdInstinct.passive,
      source: `3rd instinct (${instinctStack[2]}) — ${thirdInstinct.passive.source}`,
    })
  } else if (instinctData) {
    instinctPassiveList.push(instinctData.passive)
  }

  const instinctSuffix = instinctStack
    ? ` (${instinctStack.join('/')})`
    : instinct ? ` (${instinct})` : ''

  return {
    className: `${wingLabel} ${typeData.className}${instinctSuffix}`,
    description: typeData.description,
    enneagramType: type,
    wing,
    statModifiers: mergedModifiers,
    empoweredState: typeData.empoweredState,
    stressedState: typeData.stressedState,
    instinctPassive: instinctPassiveList[0],
    instinctPassiveList: instinctPassiveList.length > 0 ? instinctPassiveList : undefined,
    integrationLine: `${type} → ${typeData.integrationTarget}`,
    disintegrationLine: `${type} → ${typeData.disintegrationTarget}`,
    statBlendChain: statBlendChainList,
  }
}

/** Tritype influence per position — 2nd fix is stronger than 3rd. Order matters. */
const TRITYPE_SECOND_INFLUENCE = 0.4
const TRITYPE_THIRD_INFLUENCE = 0.2

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
  const baseArchetype = buildArchetype(coreType, wing, instinct, instinctStack)

  const secondFix = tritype[1]
  const thirdFix = tritype[2]

  // Build blended modifiers for each fix (incorporating their wing if provided)
  const secondFixModifiers = tritypeWings
    ? blendStatModifiers(ENNEAGRAM_TYPES[secondFix].statModifiers, ENNEAGRAM_TYPES[tritypeWings[0]].statModifiers, WING_INFLUENCE)
    : ENNEAGRAM_TYPES[secondFix].statModifiers
  const thirdFixModifiers = tritypeWings
    ? blendStatModifiers(ENNEAGRAM_TYPES[thirdFix].statModifiers, ENNEAGRAM_TYPES[tritypeWings[1]].statModifiers, WING_INFLUENCE)
    : ENNEAGRAM_TYPES[thirdFix].statModifiers

  let modifiers = baseArchetype.statModifiers
  modifiers = blendStatModifiers(modifiers, secondFixModifiers, TRITYPE_SECOND_INFLUENCE)
  modifiers = blendStatModifiers(modifiers, thirdFixModifiers, TRITYPE_THIRD_INFLUENCE)

  const tritypeLabel = tritype.join('-')

  // Extend blend chain with tritype fix steps
  const tritypeBlendChainList: StatBlendStep[] = [
    ...(baseArchetype.statBlendChain ?? []),
    { source: `2nd fix (Type ${secondFix})`, influence: TRITYPE_SECOND_INFLUENCE, modifiers: secondFixModifiers },
    { source: `3rd fix (Type ${thirdFix})`, influence: TRITYPE_THIRD_INFLUENCE, modifiers: thirdFixModifiers },
  ]

  return {
    ...baseArchetype,
    className: `${baseArchetype.className} [${tritypeLabel}]`,
    statModifiers: modifiers,
    statBlendChain: tritypeBlendChainList,
  }
}

/** Blend wing stat modifiers into the base type's modifiers at a given influence fraction. */
function blendStatModifiers(
  base: Partial<Record<StatName, number>>,
  wing: Partial<Record<StatName, number>>,
  influence: number,
): Partial<Record<StatName, number>> {
  const statNameList: StatName[] = ['willpower', 'intelligence', 'spirit', 'vitality']
  const result: Partial<Record<StatName, number>> = {}

  for (const stat of statNameList) {
    const baseValue = base[stat] ?? 1
    const wingValue = wing[stat] ?? 1
    const blended = baseValue + (wingValue - 1) * influence
    if (blended !== 1) {
      result[stat] = Math.round(blended * 100) / 100
    }
  }

  return result
}
