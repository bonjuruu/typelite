import type { MBTIType, CognitiveFunction, Ability, AbilitySlot, AbilityTag, StatName } from '../engine/types.ts'

// ============================================================
// FUNCTION STACKS (Beebe 4-function model)
// ============================================================

type FunctionStack = [CognitiveFunction, CognitiveFunction, CognitiveFunction, CognitiveFunction]

const FUNCTION_STACKS: Record<MBTIType, FunctionStack> = {
  INTJ: ['Ni', 'Te', 'Fi', 'Se'],
  INTP: ['Ti', 'Ne', 'Si', 'Fe'],
  ENTJ: ['Te', 'Ni', 'Se', 'Fi'],
  ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
  INFJ: ['Ni', 'Fe', 'Ti', 'Se'],
  INFP: ['Fi', 'Ne', 'Si', 'Te'],
  ENFJ: ['Fe', 'Ni', 'Se', 'Ti'],
  ENFP: ['Ne', 'Fi', 'Te', 'Si'],
  ISTJ: ['Si', 'Te', 'Fi', 'Ne'],
  ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
  ESTJ: ['Te', 'Si', 'Ne', 'Fi'],
  ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
  ISTP: ['Ti', 'Se', 'Ni', 'Fe'],
  ISFP: ['Fi', 'Se', 'Ni', 'Te'],
  ESTP: ['Se', 'Ti', 'Fe', 'Ni'],
  ESFP: ['Se', 'Fi', 'Te', 'Ni'],
}

// ============================================================
// SLOT CONFIGURATION
// ============================================================

const SLOTS: readonly AbilitySlot[] = ['hero', 'parent', 'child', 'inferior'] as const

const SLOT_BASE_POWER: Record<AbilitySlot, number> = {
  hero: 12,
  parent: 8,
  child: 6,
  inferior: 4,
}

// ============================================================
// ABILITY TEMPLATES PER COGNITIVE FUNCTION
// ============================================================

interface AbilityTemplate {
  name: string
  description: string
  tags: AbilityTag[]
}

interface CognitiveFunctionData {
  name: string
  scalingStat: StatName
  abilities: Record<AbilitySlot, AbilityTemplate>
}

const COGNITIVE_FUNCTIONS: Record<CognitiveFunction, CognitiveFunctionData> = {
  Ti: {
    name: 'Introverted Thinking',
    scalingStat: 'intelligence',
    abilities: {
      hero: {
        name: 'Axiom Strike',
        description: 'Isolates the weakest axiom in the target\'s defense and collapses it, dealing heavy single-target damage that ignores a portion of armor.',
        tags: ['damage', 'single-target'],
      },
      parent: {
        name: 'Structural Analysis',
        description: 'Marks a target with a fracture sigil that reduces their defense and causes subsequent hits from all allies to deal increased damage for 3 turns.',
        tags: ['debuff', 'utility'],
      },
      child: {
        name: 'Logic Bomb',
        description: 'Detonates an unstable chain of recursive logic across all enemies, dealing escalating AoE damage that doubles each tick but has a chance to backfire.',
        tags: ['damage', 'chaotic', 'aoe'],
      },
      inferior: {
        name: 'Clarity Surge',
        description: 'When health drops below 30%, a desperate epiphany triggers a massive intelligence spike and guarantees critical hits for the next 2 actions.',
        tags: ['buff', 'reactive', 'self'],
      },
    },
  },
  Te: {
    name: 'Extraverted Thinking',
    scalingStat: 'intelligence',
    abilities: {
      hero: {
        name: 'Execute Command',
        description: 'Issues an irrefutable tactical directive that strikes a single target with intelligence-scaled damage, gaining bonus power for each active buff on the party.',
        tags: ['damage', 'single-target'],
      },
      parent: {
        name: 'Battle Plan',
        description: 'Deploys a coordinated strategy grid that grants all allies increased crit chance and action speed for 4 turns.',
        tags: ['buff', 'utility'],
      },
      child: {
        name: 'Overwork',
        description: 'Burns through all remaining stamina in a single frenzied turn, unleashing 3 rapid attacks at escalating power but leaving the caster exhausted for 2 turns.',
        tags: ['damage', 'chaotic', 'self'],
      },
      inferior: {
        name: 'Rally Order',
        description: 'When an ally falls below 25% health, instinctively barks a formation command that grants the entire party a shield burst and minor damage boost.',
        tags: ['buff', 'reactive', 'aoe'],
      },
    },
  },
  Fi: {
    name: 'Introverted Feeling',
    scalingStat: 'spirit',
    abilities: {
      hero: {
        name: 'Conviction',
        description: 'Forges an unyielding ward from the caster\'s deepest values, absorbing all damage up to 40% of max health and reflecting a portion back at attackers.',
        tags: ['buff', 'self', 'defensive'],
      },
      parent: {
        name: 'Empathic Shield',
        description: 'Wraps a chosen ally in a barrier of shared feeling that redirects 50% of incoming damage to the caster and cleanses one debuff on transfer.',
        tags: ['defensive', 'utility'],
      },
      child: {
        name: 'Passion Flare',
        description: 'Erupts in a volatile surge of raw emotion across a random radius, dealing spirit-scaled damage that intensifies for each debuff currently on the caster.',
        tags: ['damage', 'chaotic'],
      },
      inferior: {
        name: 'Inner Truth',
        description: 'When reduced to critical health, a buried core of authenticity surfaces and restores a large burst of HP while granting immunity to debuffs for 1 turn.',
        tags: ['heal', 'reactive', 'self'],
      },
    },
  },
  Fe: {
    name: 'Extraverted Feeling',
    scalingStat: 'spirit',
    abilities: {
      hero: {
        name: 'Inspire',
        description: 'Radiates a wave of fervent solidarity across all allies, granting a stacking damage and defense buff that grows stronger with each party member in range.',
        tags: ['buff', 'aoe'],
      },
      parent: {
        name: 'Harmonize',
        description: 'Attunes to the party\'s wounds and redistributes health evenly among all allies, then applies a gentle heal-over-time for 3 turns.',
        tags: ['heal', 'utility'],
      },
      child: {
        name: 'Emotional Surge',
        description: 'Unleashes an uncontrolled pulse of amplified feeling that doubles all active buffs on allies in range but also doubles all active debuffs.',
        tags: ['buff', 'chaotic', 'aoe'],
      },
      inferior: {
        name: 'Desperate Bond',
        description: 'When an ally is about to fall, instinctively forges an empathic tether that instantly heals them for a large amount and splits their next hit of damage with the caster.',
        tags: ['heal', 'reactive'],
      },
    },
  },
  Si: {
    name: 'Introverted Sensing',
    scalingStat: 'vitality',
    abilities: {
      hero: {
        name: 'Fortify',
        description: 'Draws on lifetimes of accumulated endurance to harden all defenses by a flat amount, stacking up to 3 times and persisting until broken by a critical hit.',
        tags: ['defensive', 'self', 'buff'],
      },
      parent: {
        name: 'Recall',
        description: 'Reaches into somatic memory to restore the caster\'s health to whatever value it was 2 turns ago, undoing recent damage.',
        tags: ['heal', 'utility', 'self'],
      },
      child: {
        name: 'Déjà Vu',
        description: 'Inflicts a disorienting temporal echo on all nearby enemies, forcing them to repeat their previous action regardless of whether it still makes tactical sense.',
        tags: ['defensive', 'chaotic', 'reactive'],
      },
      inferior: {
        name: 'Muscle Memory',
        description: 'When stunned or incapacitated, the body automatically executes a rehearsed defensive stance that blocks the next incoming attack and counters for half damage.',
        tags: ['defensive', 'reactive'],
      },
    },
  },
  Se: {
    name: 'Extraverted Sensing',
    scalingStat: 'vitality',
    abilities: {
      hero: {
        name: 'Impact',
        description: 'Channels total sensory focus into a single crushing blow that deals massive vitality-scaled damage and staggers the target, skipping their next turn.',
        tags: ['damage', 'single-target'],
      },
      parent: {
        name: 'Quick Reflex',
        description: 'Reads the attacker\'s motion before it completes, dodging the incoming strike entirely and gaining a free counter-attack at half power.',
        tags: ['defensive', 'reactive'],
      },
      child: {
        name: 'Wild Swing',
        description: 'Lashes out at everything within reach in a reckless frenzy, hitting all enemies for moderate AoE damage with a chance to strike the same target twice.',
        tags: ['damage', 'chaotic', 'aoe'],
      },
      inferior: {
        name: 'Adrenaline Rush',
        description: 'When cornered below 20% health, a surge of raw physicality grants maximum attack speed and lifesteal on all hits for 2 turns.',
        tags: ['damage', 'reactive', 'self'],
      },
    },
  },
  Ni: {
    name: 'Introverted Intuition',
    scalingStat: 'willpower',
    abilities: {
      hero: {
        name: 'Foresight',
        description: 'Perceives the singular thread of fate leading to the target\'s end, dealing heavy willpower-scaled damage that bypasses evasion and cannot be blocked.',
        tags: ['damage', 'single-target'],
      },
      parent: {
        name: 'Premonition',
        description: 'Glimpses the enemy\'s next action and brands them with a doom mark, causing that action to deal 50% reduced effectiveness while increasing all damage they take.',
        tags: ['debuff', 'utility'],
      },
      child: {
        name: 'Vision Flash',
        description: 'A torrent of fractured futures floods the battlefield, dealing chaotic willpower-scaled damage to random targets with each vision striking independently.',
        tags: ['damage', 'chaotic'],
      },
      inferior: {
        name: 'Moment of Clarity',
        description: 'At the brink of defeat, a single crystalline vision pierces the fog — granting perfect evasion and guaranteed crit on the next action.',
        tags: ['buff', 'reactive', 'self'],
      },
    },
  },
  Ne: {
    name: 'Extraverted Intuition',
    scalingStat: 'willpower',
    abilities: {
      hero: {
        name: 'Brainstorm',
        description: 'Conjures a crackling storm of divergent possibilities that strikes all enemies simultaneously, dealing willpower-scaled AoE damage that increases per unique enemy type.',
        tags: ['damage', 'aoe'],
      },
      parent: {
        name: 'Lateral Thinking',
        description: 'Discovers an unexpected tactical angle, granting a chosen ally their highest stat as a temporary bonus to their lowest stat for 3 turns.',
        tags: ['buff', 'utility'],
      },
      child: {
        name: 'Chaos Theory',
        description: 'Rips open a rift of pure entropy that hits all enemies for random damage between 1% and 300% of base power — wildly unreliable, occasionally devastating.',
        tags: ['damage', 'chaotic', 'aoe'],
      },
      inferior: {
        name: 'Eureka',
        description: 'When all active abilities are on cooldown, a flash of desperate inspiration resets them all and grants a one-turn surge of willpower.',
        tags: ['buff', 'reactive', 'self'],
      },
    },
  },
}

// ============================================================
// PUBLIC API
// ============================================================

export const MBTI_TYPE_LIST: readonly MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
] as const

/** Get the 4-function Beebe stack for an MBTI type. */
export function getFunctionStack(mbtiType: MBTIType): FunctionStack {
  return FUNCTION_STACKS[mbtiType]
}

/** Get display info for a cognitive function. */
export function getCognitiveFunctionName(fn: CognitiveFunction): string {
  return COGNITIVE_FUNCTIONS[fn].name
}

/** Build a single ability from a cognitive function and slot. */
export function buildAbility(cognitiveFunction: CognitiveFunction, slot: AbilitySlot): Ability {
  const functionData = COGNITIVE_FUNCTIONS[cognitiveFunction]
  const template = functionData.abilities[slot]

  return {
    name: template.name,
    description: template.description,
    slot,
    cognitiveFunction,
    basePower: SLOT_BASE_POWER[slot],
    scalingStat: functionData.scalingStat,
    tags: template.tags,
  }
}

/** Get the ability name for a given cognitive function at a given slot. */
export function getAbilityName(cognitiveFunction: CognitiveFunction, slot: AbilitySlot): string {
  return COGNITIVE_FUNCTIONS[cognitiveFunction].abilities[slot].name
}

/** Build the 4-ability kit for an MBTI type. */
export function buildAbilityKit(mbtiType: MBTIType): Ability[] {
  const stack = FUNCTION_STACKS[mbtiType]

  return stack.map((cognitiveFunction, index): Ability => {
    const slot = SLOTS[index]
    const functionData = COGNITIVE_FUNCTIONS[cognitiveFunction]
    const template = functionData.abilities[slot]

    return {
      name: template.name,
      description: template.description,
      slot,
      cognitiveFunction,
      basePower: SLOT_BASE_POWER[slot],
      scalingStat: functionData.scalingStat,
      tags: template.tags,
    }
  })
}
