import type { SocionicsType, Quadra, Club, Element, ElementAffinity, PassiveTrait } from '../engine/types.ts'

// ============================================================
// TYPE DATA
// ============================================================

interface SocionicsTypeData {
  type: SocionicsType
  name: string
  quadra: Quadra
  club: Club
  element: Element
}

const SOCIONICS_TYPES: Record<SocionicsType, SocionicsTypeData> = {
  // Alpha — Light / Nature
  ILE: { type: 'ILE', name: 'The Inventor',   quadra: 'Alpha', club: 'Researcher',    element: 'Light' },
  SEI: { type: 'SEI', name: 'The Mediator',   quadra: 'Alpha', club: 'Humanitarian',  element: 'Nature' },
  ESE: { type: 'ESE', name: 'The Enthusiast',  quadra: 'Alpha', club: 'Humanitarian',  element: 'Light' },
  LII: { type: 'LII', name: 'The Analyst',    quadra: 'Alpha', club: 'Researcher',    element: 'Nature' },

  // Beta — Fire / Shadow
  SLE: { type: 'SLE', name: 'The Commander',  quadra: 'Beta',  club: 'Practical',     element: 'Fire' },
  IEI: { type: 'IEI', name: 'The Romantic',   quadra: 'Beta',  club: 'Social',        element: 'Shadow' },
  EIE: { type: 'EIE', name: 'The Mentor',     quadra: 'Beta',  club: 'Social',        element: 'Fire' },
  LSI: { type: 'LSI', name: 'The Inspector',  quadra: 'Beta',  club: 'Practical',     element: 'Shadow' },

  // Gamma — Earth / Metal
  SEE: { type: 'SEE', name: 'The Politician',  quadra: 'Gamma', club: 'Humanitarian',  element: 'Earth' },
  ILI: { type: 'ILI', name: 'The Critic',     quadra: 'Gamma', club: 'Researcher',    element: 'Metal' },
  LIE: { type: 'LIE', name: 'The Pioneer',    quadra: 'Gamma', club: 'Researcher',    element: 'Earth' },
  ESI: { type: 'ESI', name: 'The Guardian',   quadra: 'Gamma', club: 'Humanitarian',  element: 'Metal' },

  // Delta — Wind / Water
  IEE: { type: 'IEE', name: 'The Advisor',    quadra: 'Delta', club: 'Social',        element: 'Wind' },
  SLI: { type: 'SLI', name: 'The Craftsman',  quadra: 'Delta', club: 'Practical',     element: 'Water' },
  LSE: { type: 'LSE', name: 'The Director',   quadra: 'Delta', club: 'Practical',     element: 'Wind' },
  EII: { type: 'EII', name: 'The Humanist',   quadra: 'Delta', club: 'Social',        element: 'Water' },
}

// ============================================================
// CLUB → PASSIVE TRAIT
// ============================================================

const CLUB_PASSIVES: Record<Club, PassiveTrait> = {
  Researcher: {
    name: 'Analytical Mind',
    description: 'Abilities that exploit weaknesses deal increased damage.',
    source: 'Researcher club',
  },
  Social: {
    name: 'Social Grace',
    description: 'Party-wide buffs and heals gain bonus effectiveness.',
    source: 'Social club',
  },
  Practical: {
    name: 'Resourceful',
    description: 'Ability costs are reduced. Efficiency under pressure.',
    source: 'Practical club',
  },
  Humanitarian: {
    name: 'Compassionate Aura',
    description: 'Passively regenerates a small amount of health for nearby allies.',
    source: 'Humanitarian club',
  },
}

// ============================================================
// PUBLIC API
// ============================================================

export const SOCIONICS_TYPE_LIST: readonly SocionicsType[] = [
  'ILE', 'SEI', 'ESE', 'LII',
  'SLE', 'IEI', 'EIE', 'LSI',
  'SEE', 'ILI', 'LIE', 'ESI',
  'IEE', 'SLI', 'LSE', 'EII',
] as const

/** Get the core data for a socionics type. */
export function getSocionicsType(type: SocionicsType): SocionicsTypeData {
  return SOCIONICS_TYPES[type]
}

/** Build the full ElementAffinity from a socionics type selection. */
export function buildElementAffinity(type: SocionicsType): ElementAffinity {
  const typeData = SOCIONICS_TYPES[type]

  return {
    element: typeData.element,
    quadra: typeData.quadra,
    club: typeData.club,
    passiveTrait: CLUB_PASSIVES[typeData.club],
  }
}

/** Get all socionics types in a given quadra. */
export function getTypesByQuadra(quadra: Quadra): SocionicsTypeData[] {
  return Object.values(SOCIONICS_TYPES).filter((typeData) => typeData.quadra === quadra)
}
