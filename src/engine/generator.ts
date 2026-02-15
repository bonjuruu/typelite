import type {
  GeneratorInput,
  Character,
  StatBlock,
  StatBreakdown,
  Archetype,
  Ability,
  ElementAffinity,
  CombatBehavior,
  SystemId,
  Element,
} from './types.ts'
import { applyStatMultipliers, applyStatOverrides, DEFAULT_STATS } from './modifiers.ts'
import { getBaseStats } from '../data/attitudinal.ts'
import { buildArchetype, buildTritypeArchetype } from '../data/enneagram.ts'
import { buildAbilityKit, buildAbility } from '../data/mbti.ts'
import { buildElementAffinity } from '../data/socionics.ts'
import { buildCombatBehavior, buildTritypeCombatBehavior } from '../data/instincts.ts'

// ============================================================
// CHARACTER GENERATION
// ============================================================

export function generateCharacter(input: GeneratorInput): Character {
  const activeSystems = getActiveSystems(input)

  // 1. AP → base stats (or defaults)
  const baseStats: StatBlock = input.attitudinal
    ? getBaseStats(input.attitudinal)
    : { ...DEFAULT_STATS }
  let stats: StatBlock = baseStats

  // 2. Enneagram → archetype + stat multipliers
  const archetype: Archetype = input.enneagram
    ? input.enneagram.tritype
      ? buildTritypeArchetype(input.enneagram.type, input.enneagram.wing, input.enneagram.tritype, input.enneagram.tritypeWings, input.enneagram.instinct, input.enneagram.instinctStack)
      : buildArchetype(input.enneagram.type, input.enneagram.wing, input.enneagram.instinct, input.enneagram.instinctStack)
    : buildDefaultArchetype(input.overrides.archetype)

  const multipliers = input.enneagram ? archetype.statModifiers : {}
  if (input.enneagram) {
    stats = applyStatMultipliers(stats, multipliers)
  }

  // Apply manual stat overrides (for when AP is off)
  stats = applyStatOverrides(stats, input.overrides.stats)

  // Build stat breakdown for UI tooltip
  const statBreakdown: StatBreakdown = {
    base: baseStats,
    baseSource: input.attitudinal ?? 'Default',
    multipliers,
    multiplierSource: input.enneagram ? archetype.className : '',
    overrides: input.overrides.stats,
  }

  // 3. MBTI → ability kit (or manual picks, or empty)
  const abilities: Ability[] = input.mbti
    ? buildAbilityKit(input.mbti)
    : input.overrides.abilities
      ? [
          buildAbility(input.overrides.abilities.hero, 'hero'),
          buildAbility(input.overrides.abilities.parent, 'parent'),
          buildAbility(input.overrides.abilities.child, 'child'),
          buildAbility(input.overrides.abilities.inferior, 'inferior'),
        ]
      : []

  // 4. Socionics → element affinity
  const element: ElementAffinity = input.socionics
    ? buildElementAffinity(input.socionics)
    : buildDefaultElementAffinity(input.overrides.element)

  // 5. Instincts → combat behavior
  const combatBehavior: CombatBehavior = input.instincts
    ? input.instincts.tritype
      ? buildTritypeCombatBehavior(input.instincts.realm, input.instincts.tritype)
      : buildCombatBehavior(input.instincts.realm)
    : buildDefaultCombatBehavior(input.overrides.combatOrientation)

  // Generate name and title
  const name = generateName()
  const title = generateTitle(archetype, element)

  return {
    name,
    title,
    stats,
    statBreakdown,
    archetype,
    abilities,
    element,
    combatBehavior,
    activeSystems,
  }
}

// ============================================================
// ACTIVE SYSTEM TRACKING
// ============================================================

function getActiveSystems(input: GeneratorInput): SystemId[] {
  const systemList: SystemId[] = []
  if (input.attitudinal) systemList.push('attitudinal')
  if (input.enneagram) systemList.push('enneagram')
  if (input.mbti) systemList.push('mbti')
  if (input.socionics) systemList.push('socionics')
  if (input.instincts) systemList.push('instincts')
  return systemList
}

// ============================================================
// DEFAULTS (for inactive systems)
// ============================================================

function buildDefaultArchetype(overrideName: string | null): Archetype {
  return {
    className: overrideName ?? 'Wanderer',
    description: 'A traveler with no fixed calling.',
    enneagramType: 9,
    wing: 1,
    statModifiers: {},
    empoweredState: {
      name: 'Resolved',
      description: 'A moment of inner clarity.',
      statChanges: {},
    },
    stressedState: {
      name: 'Lost',
      description: 'Overcome by uncertainty.',
      statChanges: {},
    },
  }
}

function buildDefaultElementAffinity(overrideElement: Element | null): ElementAffinity {
  return {
    element: overrideElement ?? 'Nature',
    quadra: 'Alpha',
    club: 'Humanitarian',
    passiveTrait: {
      name: 'Unaligned',
      description: 'No elemental school. Balanced but unspecialized.',
      source: 'No socionics type selected',
    },
  }
}

function buildDefaultCombatBehavior(overrideOrientation: string | null): CombatBehavior {
  return {
    realm: 'SM',
    center: 'SUR',
    combatOrientation: overrideOrientation ?? 'Balanced',
    activationStyle: 'Memorializing',
    positioning: 'Aligning',
    regenSource: 'Exchanging',
    passives: [],
  }
}

// ============================================================
// NAME GENERATION
// ============================================================

const NAME_PREFIXES = [
  'Ar', 'Bel', 'Cas', 'Dor', 'El', 'Fen', 'Gal', 'Hal',
  'Ir', 'Jas', 'Kel', 'Lor', 'Mir', 'Nor', 'Or', 'Pel',
  'Quin', 'Ras', 'Sol', 'Thar', 'Ul', 'Vel', 'Wen', 'Xan',
  'Yor', 'Zen',
]

const NAME_SUFFIXES = [
  'ith', 'an', 'os', 'ara', 'iel', 'on', 'is', 'wyn',
  'ak', 'en', 'ur', 'ova', 'ix', 'us', 'ea', 'or',
  'ine', 'ash', 'ek', 'al',
]

export function generateName(): string {
  const prefix = NAME_PREFIXES[Math.floor(Math.random() * NAME_PREFIXES.length)]
  const suffix = NAME_SUFFIXES[Math.floor(Math.random() * NAME_SUFFIXES.length)]
  return prefix + suffix
}

function generateTitle(archetype: Archetype, element: ElementAffinity): string {
  return `${element.element} ${archetype.className}`
}
