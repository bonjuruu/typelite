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
    : buildDefaultArchetype(input.overrides.archetype, activeSystems)

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
  const name = generateName(archetype.className, element.element)
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

const CONTEXT_FALLBACK_LIST: { system: SystemId; className: string; description: string }[] = [
  { system: 'mbti', className: 'Adventurer', description: 'Defined by skill, not calling. Abilities speak louder than titles.' },
  { system: 'socionics', className: 'Elemental', description: 'Aligned to a primal force, wandering without a sworn oath.' },
  { system: 'instincts', className: 'Survivalist', description: 'Instinct guides where purpose has not yet spoken.' },
]

function buildDefaultArchetype(overrideName: string | null, activeSystems: SystemId[]): Archetype {
  let className = 'Wanderer'
  let description = 'A traveler with no fixed calling.'

  if (!overrideName) {
    const match = CONTEXT_FALLBACK_LIST.find((fallback) => activeSystems.includes(fallback.system))
    if (match) {
      className = match.className
      description = match.description
    }
  }

  return {
    className: overrideName ?? className,
    description,
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

const HARSH_PREFIXES = [
  'Krag', 'Vex', 'Brok', 'Drak', 'Thorn', 'Grim', 'Skar', 'Rok',
  'Vor', 'Zul', 'Gor', 'Brak', 'Kael', 'Mord', 'Rax', 'Durn',
]

const HARSH_SUFFIXES = [
  'ax', 'urn', 'ek', 'ash', 'or', 'uk', 'ath', 'ark',
  'ex', 'ol', 'ag', 'orn', 'us', 'an', 'ik', 'oz',
]

const FLOWING_PREFIXES = [
  'Ael', 'Lumi', 'Syl', 'Eira', 'Thel', 'Ari', 'Cel', 'Ilya',
  'Mael', 'Nai', 'Sera', 'Vel', 'Wyn', 'Elara', 'Fael', 'Liora',
]

const FLOWING_SUFFIXES = [
  'wyn', 'iel', 'ara', 'ine', 'ea', 'iel', 'ana', 'ova',
  'ith', 'ael', 'wen', 'ira', 'iel', 'ora', 'una', 'is',
]

const HARSH_CLASS_SET = new Set(['Berserker', 'Warlord', 'Justicar'])
const HARSH_ELEMENT_SET = new Set<Element>(['Fire', 'Shadow'])
const FLOWING_CLASS_SET = new Set(['Cleric', 'Druid', 'Sage', 'Bard'])
const FLOWING_ELEMENT_SET = new Set<Element>(['Light', 'Nature', 'Water'])

function pickNamePool(className: string, element: Element): { prefixList: string[]; suffixList: string[] } {
  const isHarsh = HARSH_CLASS_SET.has(className) || HARSH_ELEMENT_SET.has(element)
  const isFlowing = FLOWING_CLASS_SET.has(className) || FLOWING_ELEMENT_SET.has(element)

  if (isHarsh && !isFlowing) return { prefixList: HARSH_PREFIXES, suffixList: HARSH_SUFFIXES }
  if (isFlowing && !isHarsh) return { prefixList: FLOWING_PREFIXES, suffixList: FLOWING_SUFFIXES }
  return { prefixList: NAME_PREFIXES, suffixList: NAME_SUFFIXES }
}

export function generateName(className?: string, element?: Element): string {
  const { prefixList, suffixList } = className && element
    ? pickNamePool(className, element)
    : { prefixList: NAME_PREFIXES, suffixList: NAME_SUFFIXES }

  const prefix = prefixList[Math.floor(Math.random() * prefixList.length)]
  const suffix = suffixList[Math.floor(Math.random() * suffixList.length)]
  return prefix + suffix
}

function generateTitle(archetype: Archetype, element: ElementAffinity): string {
  return `${element.element} ${archetype.className}`
}
