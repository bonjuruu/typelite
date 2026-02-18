import type { Character, StatName, AbilitySlot, EnneagramNumber } from './types.ts'
import { getCenter } from '../data/enneagram.ts'

// ============================================================
// CROSS-SYSTEM INTERACTION INSIGHTS
// ============================================================

interface InsightCandidate {
  priority: number
  text: string
}

const STAT_LABELS: Record<StatName, string> = {
  willpower: 'Willpower',
  intelligence: 'Intelligence',
  spirit: 'Spirit',
  vitality: 'Vitality',
}

const SLOT_LABELS: Record<AbilitySlot, string> = {
  hero: 'Hero',
  parent: 'Parent',
  child: 'Child',
  inferior: 'Inferior',
}

/** Check if a decorated className (e.g. "Fierce Berserker (sx)") contains any of the bare class names. */
function classNameMatchesAny(className: string, targetList: string[]): boolean {
  return targetList.some((target) => className.includes(target))
}

/**
 * Generate 2-4 prose insights about how active systems interact.
 * Pure function — no React imports.
 */
export function generateSystemInsights(character: Character): string[] {
  const { activeSystems } = character
  if (activeSystems.length < 2) return []

  const candidateList: InsightCandidate[] = []

  const hasAP = activeSystems.includes('attitudinal')
  const hasMBTI = activeSystems.includes('mbti')
  const hasEnneagram = activeSystems.includes('enneagram')
  const hasSocionics = activeSystems.includes('socionics')
  const hasInstincts = activeSystems.includes('instincts')

  // Detect highest and lowest AP stats
  const statEntryList = Object.entries(character.statBreakdown.base) as [StatName, number][]
  const highestStat = statEntryList.reduce((a, b) => (b[1] > a[1] ? b : a))
  const lowestStat = statEntryList.reduce((a, b) => (b[1] < a[1] ? b : a))

  const heroAbility = character.abilities.find((a) => a.slot === 'hero')
  const inferiorAbility = character.abilities.find((a) => a.slot === 'inferior')

  // Priority 9.5: Tritype center coverage
  if (hasEnneagram && character.archetype.className.includes('[')) {
    const tritypeMatch = character.archetype.className.match(/\[(\d)-(\d)-(\d)\]/)
    if (tritypeMatch) {
      const tritypeNumberList = [Number(tritypeMatch[1]), Number(tritypeMatch[2]), Number(tritypeMatch[3])] as EnneagramNumber[]
      const centerSet = new Set(tritypeNumberList.map((n) => getCenter(n)))
      if (centerSet.size === 3) {
        candidateList.push({
          priority: 9.5,
          text: `Tritype ${tritypeNumberList.join('-')} covers all three centers (Gut, Heart, Head) — full emotional, instinctual, and intellectual access.`,
        })
      }
    }
  }

  // Priority 10: 3+ system convergence
  if (hasAP && hasMBTI && hasSocionics && heroAbility) {
    const heroScalesStat = heroAbility.scalingStat
    if (heroScalesStat === highestStat[0]) {
      candidateList.push({
        priority: 10,
        text: `${STAT_LABELS[highestStat[0]]} is your highest stat (${highestStat[1]}), powers your ${heroAbility.cognitiveFunction}-Hero ${heroAbility.name}, and aligns with your ${character.element.club} club — a triple-layered convergence.`,
      })
    }
  }

  // Priority 9: AP 1st stat matches Hero scaling stat
  if (hasAP && hasMBTI && heroAbility) {
    if (heroAbility.scalingStat === highestStat[0]) {
      candidateList.push({
        priority: 9,
        text: `Your ${character.statBreakdown.baseSource} stack puts ${STAT_LABELS[highestStat[0]]} at ${highestStat[1]}, directly amplifying your ${heroAbility.cognitiveFunction}-Hero ability ${heroAbility.name}.`,
      })
    }
  }

  // Priority 8: Class-function thematic dissonance
  if (hasEnneagram && hasMBTI && heroAbility) {
    const aggressiveClassList = ['Berserker', 'Warlord', 'Justicar']
    const methodicalFunctionList = ['Si', 'Ti', 'Fi']
    const supportClassList = ['Cleric', 'Druid', 'Bard']
    const aggressiveFunctionList = ['Se', 'Te', 'Ne']

    const isAggressiveClass = classNameMatchesAny(character.archetype.className, aggressiveClassList)
    const isMethodicalHero = methodicalFunctionList.includes(heroAbility.cognitiveFunction)
    const isSupportClass = classNameMatchesAny(character.archetype.className, supportClassList)
    const isAggressiveHero = aggressiveFunctionList.includes(heroAbility.cognitiveFunction)

    if (isAggressiveClass && isMethodicalHero) {
      candidateList.push({
        priority: 8,
        text: `${character.archetype.className} with ${heroAbility.cognitiveFunction}-dominant kit — a disciplined chaos agent who channels aggression through precision.`,
      })
    } else if (isSupportClass && isAggressiveHero) {
      candidateList.push({
        priority: 8,
        text: `${character.archetype.className} with ${heroAbility.cognitiveFunction}-Hero — a support archetype armed with an aggressive primary ability.`,
      })
    }
  }

  // Priority 7: AP 4th stat matches Inferior scaling stat
  if (hasAP && hasMBTI && inferiorAbility) {
    if (inferiorAbility.scalingStat === lowestStat[0]) {
      candidateList.push({
        priority: 7,
        text: `${inferiorAbility.cognitiveFunction}-${SLOT_LABELS[inferiorAbility.slot]}'s comeback fires from ${STAT_LABELS[lowestStat[0]]} at ${lowestStat[1]} — thin base, big spikes.`,
      })
    }
  }

  // Priority 6: Quadra-class thematic alignment
  if (hasEnneagram && hasSocionics) {
    const alignmentMap: Record<string, string[]> = {
      Beta: ['Berserker', 'Warlord'],
      Alpha: ['Sage', 'Bard'],
      Gamma: ['Sentinel', 'Trickster'],
      Delta: ['Cleric', 'Druid'],
    }
    const alignedClassList = alignmentMap[character.element.quadra]
    if (alignedClassList && classNameMatchesAny(character.archetype.className, alignedClassList)) {
      candidateList.push({
        priority: 6,
        text: `${character.element.quadra} ${character.element.element} + ${character.archetype.className} = thematic alignment — your element and class reinforce the same combat identity.`,
      })
    }
  }

  // Priority 5: Instinct passive + ability type synergy
  if (hasInstincts && hasMBTI && heroAbility) {
    const isSingleTarget = heroAbility.tags.includes('single-target')
    const hasSxFixation = character.archetype.instinctPassiveList?.some((p) => p.name === 'Fixation')
      || character.archetype.instinctPassive?.name === 'Fixation'

    if (isSingleTarget && hasSxFixation) {
      candidateList.push({
        priority: 5,
        text: `sx Fixation + ${heroAbility.cognitiveFunction}-Hero single-target ability = boss fight specialist — damage ramps on sustained focus.`,
      })
    }
  }

  // Priority 4.5: Instinct tritype cross-center passives
  if (hasInstincts) {
    const fixPassiveCount = character.combatBehavior.passives.filter((p) => p.source.includes('fix')).length
    if (fixPassiveCount > 0) {
      candidateList.push({
        priority: 4.5,
        text: `Your instinct tritype adds ${fixPassiveCount} cross-center passive${fixPassiveCount > 1 ? 's' : ''}, broadening your combat toolkit beyond your primary center.`,
      })
    }
  }

  // Priority 4: Combat orientation + class alignment/dissonance
  if (hasInstincts && hasEnneagram) {
    const frontlineClassList = ['Berserker', 'Warlord', 'Sentinel']
    const strategistClassList = ['Sage', 'Trickster']
    const orientation = character.combatBehavior.combatOrientation

    const isFrontline = orientation === 'Frontline'
    const isSupport = orientation === 'Support'
    const isStrategist = orientation === 'Strategist'

    if (isFrontline && classNameMatchesAny(character.archetype.className, strategistClassList)) {
      candidateList.push({
        priority: 4,
        text: `SUR Frontline + ${character.archetype.className} = frontline intellectual — positioning says "charge" while the class says "plan."`,
      })
    } else if (isStrategist && classNameMatchesAny(character.archetype.className, frontlineClassList)) {
      candidateList.push({
        priority: 4,
        text: `PUR Strategist + ${character.archetype.className} = tactical brawler — planning from the front line.`,
      })
    } else if (isSupport && classNameMatchesAny(character.archetype.className, frontlineClassList)) {
      candidateList.push({
        priority: 4,
        text: `INT Support + ${character.archetype.className} = protective vanguard — aggression in service of the group.`,
      })
    }
  }

  // Priority 3.5: Tritype stat blending
  if (hasEnneagram && character.archetype.className.includes('[')) {
    candidateList.push({
      priority: 3.5,
      text: `Your tritype blends 40% of your 2nd fix and 20% of your 3rd fix stat modifiers into your archetype, softening your primary type's profile.`,
    })
  }

  // Priority 3: Club passive + class playstyle
  if (hasSocionics && hasEnneagram) {
    const clubClassSynergyMap: Record<string, { classList: string[]; text: string }> = {
      Practical: { classList: ['Sentinel', 'Warlord'], text: `Practical Resourceful + ${character.archetype.className} = efficient and relentless — reduced cooldowns on an already durable kit.` },
      Researcher: { classList: ['Sage', 'Trickster'], text: `Researcher Analytical Mind + ${character.archetype.className} = vulnerability stacking specialist — debuff, then punish.` },
      Social: { classList: ['Cleric', 'Bard'], text: `Social Grace + ${character.archetype.className} = amplified support — buffs and heals land harder.` },
      Humanitarian: { classList: ['Druid', 'Cleric'], text: `Humanitarian Compassionate Aura + ${character.archetype.className} = passive sustain engine — the party heals just by standing near you.` },
    }
    const synergy = clubClassSynergyMap[character.element.club]
    if (synergy && classNameMatchesAny(character.archetype.className, synergy.classList)) {
      candidateList.push({
        priority: 3,
        text: synergy.text,
      })
    }
  }

  // Sort by priority descending, take top 4
  candidateList.sort((a, b) => b.priority - a.priority)
  return candidateList.slice(0, 4).map((c) => c.text)
}
