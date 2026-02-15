import type {
  APType,
  MBTIType,
  SocionicsType,
  EnneagramNumber,
  EnneagramInstinct,
  InstinctRealm,
  Element,
  ManualOverrides,
  StatName,
  CognitiveFunction,
  AbilitySlot,
  SystemId,
} from '../engine/types.ts'
import type { BuilderSelections, EnabledSystems } from '../hooks/useCharacterGenerator.ts'

// ============================================================
// SERIALIZATION
// ============================================================

export function serializeToUrl(
  enabledSystems: EnabledSystems,
  selections: BuilderSelections,
  overrides: ManualOverrides,
  characterName?: string,
): URLSearchParams {
  const params = new URLSearchParams()

  // Systems bitmask: attitudinal, enneagram, mbti, socionics, instincts
  const systemOrder: SystemId[] = ['attitudinal', 'enneagram', 'mbti', 'socionics', 'instincts']
  const systemBits = systemOrder.map((id) => (enabledSystems[id] ? '1' : '0')).join('')
  params.set('s', systemBits)

  // AP
  if (selections.attitudinal) params.set('ap', selections.attitudinal)

  // Enneagram
  if (selections.enneagramType) params.set('e', selections.enneagramType.toString())
  if (selections.enneagramWing) params.set('ew', selections.enneagramWing.toString())
  if (selections.enneagramInstinct) params.set('ei', selections.enneagramInstinct)

  // Instinct stacking
  if (selections.instinctStackEnabled) {
    params.set('es', '1')
    if (selections.instinctSecond) params.set('ei2', selections.instinctSecond)
  }

  // Enneagram tritype
  if (selections.tritypeEnabled) {
    params.set('et', '1')
    if (selections.tritypeSecondFix) params.set('e2', selections.tritypeSecondFix.toString())
    if (selections.tritypeSecondFixWing) params.set('e2w', selections.tritypeSecondFixWing.toString())
    if (selections.tritypeThirdFix) params.set('e3', selections.tritypeThirdFix.toString())
    if (selections.tritypeThirdFixWing) params.set('e3w', selections.tritypeThirdFixWing.toString())
  }

  // MBTI
  if (selections.mbti) params.set('m', selections.mbti)

  // Socionics
  if (selections.socionics) params.set('so', selections.socionics)

  // Instincts
  if (selections.instinctRealm) params.set('ir', selections.instinctRealm)
  if (selections.instinctTritypeEnabled) {
    params.set('irt', '1')
    if (selections.instinctSecondRealm) params.set('ir2', selections.instinctSecondRealm)
    if (selections.instinctThirdRealm) params.set('ir3', selections.instinctThirdRealm)
  }

  // Overrides
  if (overrides.stats) {
    const statKeyList: StatName[] = ['willpower', 'intelligence', 'spirit', 'vitality']
    const statValueList = statKeyList.map((k) => overrides.stats?.[k] ?? '').join(',')
    params.set('os', statValueList)
  }
  if (overrides.archetype) params.set('oa', overrides.archetype)
  if (overrides.abilities) {
    const slotList: AbilitySlot[] = ['hero', 'parent', 'child', 'inferior']
    params.set('ob', slotList.map((slot) => overrides.abilities![slot]).join(','))
  }
  if (overrides.element) params.set('oe', overrides.element)
  if (overrides.combatOrientation) params.set('oc', overrides.combatOrientation)

  // Character name (only if provided)
  if (characterName) params.set('n', characterName)

  return params
}

// ============================================================
// DESERIALIZATION
// ============================================================

interface DeserializedState {
  enabledSystems: EnabledSystems
  selections: BuilderSelections
  overrides: ManualOverrides
  characterName?: string
}

const AP_TYPE_SET = new Set<string>([
  'VLEF', 'VLFE', 'VELF', 'VEFL', 'VFEL', 'VFLE',
  'LVEF', 'LVFE', 'LEVF', 'LEFV', 'LFEV', 'LFVE',
  'EVLF', 'EVFL', 'ELVF', 'ELFV', 'EFLV', 'EFVL',
  'FVLE', 'FVEL', 'FLVE', 'FLEV', 'FEVL', 'FELV',
])

const MBTI_TYPE_SET = new Set<string>([
  'INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP',
])

const SOCIONICS_TYPE_SET = new Set<string>([
  'ILE', 'SEI', 'ESE', 'LII', 'SLE', 'IEI', 'EIE', 'LSI',
  'SEE', 'ILI', 'LIE', 'ESI', 'IEE', 'SLI', 'LSE', 'EII',
])

const INSTINCT_SET = new Set<string>(['sp', 'so', 'sx'])
const REALM_SET = new Set<string>(['FD', 'SY', 'SM', 'AY', 'CY', 'BG', 'SS', 'EX', 'UN'])
const ELEMENT_SET = new Set<string>(['Light', 'Nature', 'Fire', 'Shadow', 'Earth', 'Metal', 'Wind', 'Water'])
const COGNITIVE_FN_SET = new Set<string>(['Ti', 'Te', 'Fi', 'Fe', 'Si', 'Se', 'Ni', 'Ne'])

function parseEnneagramNumber(value: string | null): EnneagramNumber | null {
  if (!value) return null
  const num = Number(value)
  if (num >= 1 && num <= 9) return num as EnneagramNumber
  return null
}

export function deserializeFromUrl(params: URLSearchParams): DeserializedState | null {
  const systemBits = params.get('s')
  if (!systemBits || systemBits.length !== 5) return null

  const systemOrder: SystemId[] = ['attitudinal', 'enneagram', 'mbti', 'socionics', 'instincts']
  const enabledSystems: EnabledSystems = {
    attitudinal: true,
    enneagram: true,
    mbti: true,
    socionics: true,
    instincts: true,
  }
  for (let i = 0; i < 5; i++) {
    enabledSystems[systemOrder[i]] = systemBits[i] === '1'
  }

  // AP
  const apRaw = params.get('ap')
  const attitudinal = (apRaw && AP_TYPE_SET.has(apRaw)) ? apRaw as APType : null

  // Enneagram
  const enneagramType = parseEnneagramNumber(params.get('e'))
  const enneagramWing = parseEnneagramNumber(params.get('ew'))
  const eiRaw = params.get('ei')
  const enneagramInstinct = (eiRaw && INSTINCT_SET.has(eiRaw)) ? eiRaw as EnneagramInstinct : null

  const instinctStackEnabled = params.get('es') === '1'
  const ei2Raw = params.get('ei2')
  const instinctSecond = (ei2Raw && INSTINCT_SET.has(ei2Raw)) ? ei2Raw as EnneagramInstinct : null

  const tritypeEnabled = params.get('et') === '1'
  const tritypeSecondFix = parseEnneagramNumber(params.get('e2'))
  const tritypeSecondFixWing = parseEnneagramNumber(params.get('e2w'))
  const tritypeThirdFix = parseEnneagramNumber(params.get('e3'))
  const tritypeThirdFixWing = parseEnneagramNumber(params.get('e3w'))

  // MBTI
  const mRaw = params.get('m')
  const mbti = (mRaw && MBTI_TYPE_SET.has(mRaw)) ? mRaw as MBTIType : null

  // Socionics
  const soRaw = params.get('so')
  const socionics = (soRaw && SOCIONICS_TYPE_SET.has(soRaw)) ? soRaw as SocionicsType : null

  // Instincts
  const irRaw = params.get('ir')
  const instinctRealm = (irRaw && REALM_SET.has(irRaw)) ? irRaw as InstinctRealm : null
  const instinctTritypeEnabled = params.get('irt') === '1'
  const ir2Raw = params.get('ir2')
  const instinctSecondRealm = (ir2Raw && REALM_SET.has(ir2Raw)) ? ir2Raw as InstinctRealm : null
  const ir3Raw = params.get('ir3')
  const instinctThirdRealm = (ir3Raw && REALM_SET.has(ir3Raw)) ? ir3Raw as InstinctRealm : null

  // Overrides
  const overrides: ManualOverrides = {
    stats: null,
    archetype: null,
    abilities: null,
    element: null,
    combatOrientation: null,
  }

  const osRaw = params.get('os')
  if (osRaw) {
    const statKeyList: StatName[] = ['willpower', 'intelligence', 'spirit', 'vitality']
    const valueList = osRaw.split(',')
    if (valueList.length === 4) {
      const stats: Partial<Record<StatName, number>> = {}
      for (let i = 0; i < 4; i++) {
        const num = Number(valueList[i])
        if (!isNaN(num) && num >= 1 && num <= 20) {
          stats[statKeyList[i]] = num
        }
      }
      if (Object.keys(stats).length > 0) overrides.stats = stats
    }
  }

  const oaRaw = params.get('oa')
  if (oaRaw) overrides.archetype = oaRaw

  const obRaw = params.get('ob')
  if (obRaw) {
    const fnList = obRaw.split(',')
    if (fnList.length === 4 && fnList.every((fn) => COGNITIVE_FN_SET.has(fn))) {
      overrides.abilities = {
        hero: fnList[0] as CognitiveFunction,
        parent: fnList[1] as CognitiveFunction,
        child: fnList[2] as CognitiveFunction,
        inferior: fnList[3] as CognitiveFunction,
      }
    }
  }

  const oeRaw = params.get('oe')
  if (oeRaw && ELEMENT_SET.has(oeRaw)) overrides.element = oeRaw as Element

  const ocRaw = params.get('oc')
  if (ocRaw) overrides.combatOrientation = ocRaw

  const characterName = params.get('n') || undefined

  return {
    enabledSystems,
    selections: {
      attitudinal,
      enneagramType,
      enneagramWing,
      enneagramInstinct,
      instinctStackEnabled,
      instinctSecond,
      tritypeEnabled,
      tritypeSecondFix,
      tritypeSecondFixWing,
      tritypeThirdFix,
      tritypeThirdFixWing,
      mbti,
      socionics,
      instinctRealm,
      instinctTritypeEnabled,
      instinctSecondRealm,
      instinctThirdRealm,
    },
    overrides,
    characterName,
  }
}
