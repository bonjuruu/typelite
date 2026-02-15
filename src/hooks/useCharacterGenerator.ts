import { useState, useCallback } from 'react'
import type {
  SystemId,
  Character,
  GeneratorInput,
  ManualOverrides,
  APType,
  MBTIType,
  SocionicsType,
  EnneagramNumber,
  EnneagramInstinct,
  InstinctRealm,
  Element,
} from '../engine/types.ts'
import { generateCharacter, generateName } from '../engine/generator.ts'
import { serializeToUrl, deserializeFromUrl } from '../utils/urlSerializer.ts'
import { AP_TYPE_LIST } from '../data/attitudinal.ts'
import { ENNEAGRAM_TYPE_LIST, ENNEAGRAM_INSTINCT_LIST, getWings, CENTER_TYPES, CENTER_LIST, getCenter } from '../data/enneagram.ts'
import { MBTI_TYPE_LIST } from '../data/mbti.ts'
import { SOCIONICS_TYPE_LIST } from '../data/socionics.ts'
import { INSTINCT_REALM_LIST, INSTINCT_CENTER_LIST, REALMS_BY_CENTER, getRealmCenter } from '../data/instincts.ts'

// ============================================================
// STATE TYPES
// ============================================================

export interface BuilderSelections {
  attitudinal: APType | null
  enneagramType: EnneagramNumber | null
  enneagramWing: EnneagramNumber | null
  enneagramInstinct: EnneagramInstinct | null
  instinctStackEnabled: boolean
  instinctSecond: EnneagramInstinct | null
  tritypeEnabled: boolean
  tritypeSecondFix: EnneagramNumber | null
  tritypeSecondFixWing: EnneagramNumber | null
  tritypeThirdFix: EnneagramNumber | null
  tritypeThirdFixWing: EnneagramNumber | null
  mbti: MBTIType | null
  socionics: SocionicsType | null
  instinctRealm: InstinctRealm | null
  instinctTritypeEnabled: boolean
  instinctSecondRealm: InstinctRealm | null
  instinctThirdRealm: InstinctRealm | null
}

export type EnabledSystems = Record<SystemId, boolean>

const INITIAL_ENABLED: EnabledSystems = {
  attitudinal: true,
  enneagram: true,
  mbti: true,
  socionics: true,
  instincts: true,
}

const INITIAL_SELECTIONS: BuilderSelections = {
  attitudinal: null,
  enneagramType: null,
  enneagramWing: null,
  enneagramInstinct: null,
  instinctStackEnabled: false,
  instinctSecond: null,
  tritypeEnabled: false,
  tritypeSecondFix: null,
  tritypeSecondFixWing: null,
  tritypeThirdFix: null,
  tritypeThirdFixWing: null,
  mbti: null,
  socionics: null,
  instinctRealm: null,
  instinctTritypeEnabled: false,
  instinctSecondRealm: null,
  instinctThirdRealm: null,
}

const INITIAL_OVERRIDES: ManualOverrides = {
  stats: null,
  archetype: null,
  abilities: null,
  element: null,
  combatOrientation: null,
}

// ============================================================
// HOOK
// ============================================================

export function useCharacterGenerator() {
  const [enabledSystems, setEnabledSystems] = useState<EnabledSystems>(INITIAL_ENABLED)
  const [selections, setSelections] = useState<BuilderSelections>(INITIAL_SELECTIONS)
  const [overrides, setOverrides] = useState<ManualOverrides>(INITIAL_OVERRIDES)
  const [character, setCharacter] = useState<Character | null>(null)
  const [characterName, setCharacterName] = useState<string>('')
  const [generateCount, setGenerateCount] = useState(0)

  const regenerateName = useCallback(() => {
    const newName = generateName()
    setCharacterName(newName)
  }, [])

  const toggleSystem = useCallback((systemId: SystemId) => {
    setEnabledSystems((prev) => ({ ...prev, [systemId]: !prev[systemId] }))
  }, [])

  const updateSelection = useCallback(<K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => {
    setSelections((prev) => ({ ...prev, [key]: value }))
  }, [])

  const updateOverride = useCallback(<K extends keyof ManualOverrides>(
    key: K,
    value: ManualOverrides[K],
  ) => {
    setOverrides((prev) => ({ ...prev, [key]: value }))
  }, [])

  const setEnneagramType = useCallback((type: EnneagramNumber | null) => {
    setSelections((prev) => {
      if (!type) return { ...prev, enneagramType: null, enneagramWing: null, enneagramInstinct: null, instinctSecond: null, tritypeSecondFix: null, tritypeSecondFixWing: null, tritypeThirdFix: null, tritypeThirdFixWing: null }
      const validWingList = getWings(type)
      return { ...prev, enneagramType: type, enneagramWing: validWingList[0], enneagramInstinct: prev.enneagramInstinct ?? 'sp', tritypeSecondFix: null, tritypeSecondFixWing: null, tritypeThirdFix: null, tritypeThirdFixWing: null }
    })
  }, [])

  const randomizeSystem = useCallback((systemId: SystemId) => {
    switch (systemId) {
      case 'attitudinal':
        updateSelection('attitudinal', pickRandom(AP_TYPE_LIST))
        break
      case 'enneagram': {
        const type = pickRandom(ENNEAGRAM_TYPE_LIST)
        const wingList = getWings(type)
        const coreCenter = getCenter(type)
        setSelections((prev) => {
          const instinct = pickRandom(ENNEAGRAM_INSTINCT_LIST)
          const update: Partial<BuilderSelections> = {
            enneagramType: type,
            enneagramWing: pickRandom(wingList),
            enneagramInstinct: instinct,
          }
          if (prev.instinctStackEnabled) {
            const remainingInstinctList = ENNEAGRAM_INSTINCT_LIST.filter((i) => i !== instinct)
            update.instinctSecond = pickRandom(remainingInstinctList)
          }
          if (prev.tritypeEnabled) {
            const otherCenterList = CENTER_LIST.filter((c) => c !== coreCenter)
            const secondFix = pickRandom(CENTER_TYPES[otherCenterList[0]])
            const thirdFix = pickRandom(CENTER_TYPES[otherCenterList[1]])
            update.tritypeSecondFix = secondFix
            update.tritypeSecondFixWing = pickRandom(getWings(secondFix))
            update.tritypeThirdFix = thirdFix
            update.tritypeThirdFixWing = pickRandom(getWings(thirdFix))
          }
          return { ...prev, ...update }
        })
        break
      }
      case 'mbti':
        updateSelection('mbti', pickRandom(MBTI_TYPE_LIST))
        break
      case 'socionics':
        updateSelection('socionics', pickRandom(SOCIONICS_TYPE_LIST))
        break
      case 'instincts': {
        const realm = pickRandom(INSTINCT_REALM_LIST)
        const realmCenter = getRealmCenter(realm)
        setSelections((prev) => {
          const update: Partial<BuilderSelections> = {
            instinctRealm: realm,
          }
          if (prev.instinctTritypeEnabled) {
            const otherCenterList = INSTINCT_CENTER_LIST.filter((c) => c !== realmCenter)
            update.instinctSecondRealm = pickRandom(REALMS_BY_CENTER[otherCenterList[0]])
            update.instinctThirdRealm = pickRandom(REALMS_BY_CENTER[otherCenterList[1]])
          }
          return { ...prev, ...update }
        })
        break
      }
    }
  }, [updateSelection])

  const randomizeAll = useCallback(() => {
    const newSelections: BuilderSelections = { ...selections }

    if (enabledSystems.attitudinal) {
      newSelections.attitudinal = pickRandom(AP_TYPE_LIST)
    }

    if (enabledSystems.enneagram) {
      const type = pickRandom(ENNEAGRAM_TYPE_LIST)
      const wingList = getWings(type)
      const instinct = pickRandom(ENNEAGRAM_INSTINCT_LIST)
      const coreCenter = getCenter(type)

      newSelections.enneagramType = type
      newSelections.enneagramWing = pickRandom(wingList)
      newSelections.enneagramInstinct = instinct

      if (newSelections.instinctStackEnabled) {
        const remainingInstinctList = ENNEAGRAM_INSTINCT_LIST.filter((i) => i !== instinct)
        newSelections.instinctSecond = pickRandom(remainingInstinctList)
      }

      if (newSelections.tritypeEnabled) {
        const otherCenterList = CENTER_LIST.filter((c) => c !== coreCenter)
        const secondFix = pickRandom(CENTER_TYPES[otherCenterList[0]])
        const thirdFix = pickRandom(CENTER_TYPES[otherCenterList[1]])
        newSelections.tritypeSecondFix = secondFix
        newSelections.tritypeSecondFixWing = pickRandom(getWings(secondFix))
        newSelections.tritypeThirdFix = thirdFix
        newSelections.tritypeThirdFixWing = pickRandom(getWings(thirdFix))
      }
    }

    if (enabledSystems.mbti) {
      newSelections.mbti = pickRandom(MBTI_TYPE_LIST)
    }

    if (enabledSystems.socionics) {
      newSelections.socionics = pickRandom(SOCIONICS_TYPE_LIST)
    }

    if (enabledSystems.instincts) {
      const realm = pickRandom(INSTINCT_REALM_LIST)
      const realmCenter = getRealmCenter(realm)
      newSelections.instinctRealm = realm

      if (newSelections.instinctTritypeEnabled) {
        const otherCenterList = INSTINCT_CENTER_LIST.filter((c) => c !== realmCenter)
        newSelections.instinctSecondRealm = pickRandom(REALMS_BY_CENTER[otherCenterList[0]])
        newSelections.instinctThirdRealm = pickRandom(REALMS_BY_CENTER[otherCenterList[1]])
      }
    }

    // Update UI state
    setSelections(newSelections)

    // Generate directly from local values (avoids stale state)
    const input = buildGeneratorInput(enabledSystems, newSelections, overrides)
    const generatedCharacter = generateCharacter(input)
    setCharacter(generatedCharacter)
    setCharacterName(generatedCharacter.name)
    setGenerateCount((prev) => prev + 1)

    // Update URL
    const params = serializeToUrl(enabledSystems, newSelections, overrides, generatedCharacter.name)
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', url)
  }, [enabledSystems, selections, overrides])

  const generate = useCallback(() => {
    const input = buildGeneratorInput(enabledSystems, selections, overrides)
    const generatedCharacter = generateCharacter(input)
    setCharacter(generatedCharacter)
    setCharacterName(generatedCharacter.name)
    setGenerateCount((prev) => prev + 1)

    // Update URL with serialized state
    const params = serializeToUrl(enabledSystems, selections, overrides, generatedCharacter.name)
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', url)
  }, [enabledSystems, selections, overrides])

  const loadFromUrl = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    if (!params.has('s')) return false

    const state = deserializeFromUrl(params)
    if (!state) return false

    setEnabledSystems(state.enabledSystems)
    setSelections(state.selections)
    setOverrides(state.overrides)

    // Generate the character from the deserialized state
    const input = buildGeneratorInput(state.enabledSystems, state.selections, state.overrides)
    const generatedCharacter = generateCharacter(input)
    setCharacter(generatedCharacter)
    setCharacterName(state.characterName ?? generatedCharacter.name)
    setGenerateCount((prev) => prev + 1)
    return true
  }, [])

  const hasAllSelections = checkSelections(enabledSystems, selections)

  return {
    enabledSystems,
    selections,
    overrides,
    character,
    characterName,
    generateCount,
    hasAllSelections,
    toggleSystem,
    updateSelection,
    updateOverride,
    setEnneagramType,
    randomizeSystem,
    randomizeAll,
    generate,
    setCharacterName,
    regenerateName,
    loadFromUrl,
  }
}

// ============================================================
// HELPERS
// ============================================================

function buildGeneratorInput(
  enabledSystems: EnabledSystems,
  selections: BuilderSelections,
  overrides: ManualOverrides,
): GeneratorInput {
  return {
    attitudinal: enabledSystems.attitudinal ? selections.attitudinal : null,
    enneagram: enabledSystems.enneagram && selections.enneagramType && selections.enneagramWing && selections.enneagramInstinct
      ? {
          type: selections.enneagramType,
          wing: selections.enneagramWing,
          instinct: selections.enneagramInstinct,
          ...(selections.instinctStackEnabled && selections.instinctSecond
            ? {
                instinctStack: (() => {
                  const third = ENNEAGRAM_INSTINCT_LIST.find((i) => i !== selections.enneagramInstinct && i !== selections.instinctSecond)!
                  return [selections.enneagramInstinct, selections.instinctSecond, third] as [EnneagramInstinct, EnneagramInstinct, EnneagramInstinct]
                })(),
              }
            : {}),
          ...(selections.tritypeEnabled && selections.tritypeSecondFix && selections.tritypeThirdFix
            ? {
                tritype: [selections.enneagramType, selections.tritypeSecondFix, selections.tritypeThirdFix] as [EnneagramNumber, EnneagramNumber, EnneagramNumber],
                ...(selections.tritypeSecondFixWing && selections.tritypeThirdFixWing
                  ? { tritypeWings: [selections.tritypeSecondFixWing, selections.tritypeThirdFixWing] as [EnneagramNumber, EnneagramNumber] }
                  : {}),
              }
            : {}),
        }
      : null,
    mbti: enabledSystems.mbti ? selections.mbti : null,
    socionics: enabledSystems.socionics ? selections.socionics : null,
    instincts: enabledSystems.instincts && selections.instinctRealm
      ? {
          realm: selections.instinctRealm,
          ...(selections.instinctTritypeEnabled && selections.instinctSecondRealm && selections.instinctThirdRealm
            ? { tritype: [selections.instinctRealm, selections.instinctSecondRealm, selections.instinctThirdRealm] as [InstinctRealm, InstinctRealm, InstinctRealm] }
            : {}),
        }
      : null,
    overrides,
  }
}

function pickRandom<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)]
}

function checkSelections(enabled: EnabledSystems, selections: BuilderSelections): boolean {
  if (enabled.attitudinal && !selections.attitudinal) return false
  if (enabled.enneagram && (!selections.enneagramType || !selections.enneagramWing || !selections.enneagramInstinct)) return false
  if (enabled.mbti && !selections.mbti) return false
  if (enabled.socionics && !selections.socionics) return false
  if (enabled.instincts && !selections.instinctRealm) return false
  return true
}

// Re-export lists for use in components
export {
  AP_TYPE_LIST,
  ENNEAGRAM_TYPE_LIST,
  MBTI_TYPE_LIST,
  SOCIONICS_TYPE_LIST,
  INSTINCT_REALM_LIST,
}
export { getWings, CENTER_TYPES, CENTER_LIST, getCenter, ENNEAGRAM_INSTINCT_LIST, getInstinctLabel, getInstinctFullName } from '../data/enneagram.ts'
export type { EnneagramCenter } from '../data/enneagram.ts'
export { getRealmName, getRealmCenter, INSTINCT_CENTER_LIST, REALMS_BY_CENTER } from '../data/instincts.ts'
export { getEnneagramType } from '../data/enneagram.ts'
export { getSocionicsType } from '../data/socionics.ts'
export { getAbilityName } from '../data/mbti.ts'
export { describeStack } from '../data/attitudinal.ts'
export type { StackPositionDetail } from '../data/attitudinal.ts'

export const ELEMENT_LIST: readonly Element[] = [
  'Light', 'Nature', 'Fire', 'Shadow', 'Earth', 'Metal', 'Wind', 'Water',
] as const
