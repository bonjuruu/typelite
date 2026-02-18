import type {
  APType, MBTIType, SocionicsType, EnneagramNumber, EnneagramInstinct,
  InstinctRealm, InstinctCenter, CognitiveFunction,
} from '../types.ts'
import type { QuizQuestion, QuizAnswerMap } from '../../data/quiz/types.ts'
import type { ScoreBreakdown } from './scorer.ts'
import { getFunctionStack } from '../../data/mbti.ts'
import { getWings, getEnneagramType } from '../../data/enneagram.ts'
import { REALMS_BY_CENTER } from '../../data/instincts.ts'

// ============================================================
// SHARED HELPERS
// ============================================================

/** Accumulate weighted scores from answered questions. */
function accumulateScoreMap<K extends string>(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  validKeySet: Set<K>,
): Record<K, number> {
  const scoreMap = {} as Record<K, number>
  for (const key of validKeySet) scoreMap[key] = 0

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue
    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (validKeySet.has(key as K)) {
        scoreMap[key as K] += value
      }
    }
  }

  return scoreMap
}

/** Get the key with the highest score. */
function topKey<K extends string>(scoreMap: Record<K, number>, keyList: readonly K[]): K {
  return keyList.reduce((best, key) =>
    scoreMap[key] > scoreMap[best] ? key : best,
  )
}

// ============================================================
// COGNITIVE FUNCTION CONSTANTS
// ============================================================

const COGNITIVE_FUNCTION_LIST: readonly CognitiveFunction[] = [
  'Ti', 'Te', 'Fi', 'Fe', 'Si', 'Se', 'Ni', 'Ne',
] as const

const MBTI_TYPE_LIST: readonly MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
] as const

// Position weights for stack-fit scoring
const POSITION_WEIGHT_LIST = [4, 3, 2, 1] as const

// ============================================================
// DEEP MBTI — Cognitive Function Stack-Fit Scoring
// ============================================================

/**
 * Score MBTI type from cognitive function questions using stack-fit correlation.
 *
 * 1. Accumulate raw scores for all 8 functions
 * 2. Rank functions by score
 * 3. For each of the 16 types, compute a fit score using position weights
 * 4. Return the type with the highest fit score
 */
export function scoreMBTIDeep(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): { type: MBTIType; functionScoreMap: Record<CognitiveFunction, number> } {
  const functionScoreMap = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(COGNITIVE_FUNCTION_LIST),
  )

  // Rank functions by score (highest first), with stable tie-breaking by list order
  const rankedFunctionList = [...COGNITIVE_FUNCTION_LIST]
    .map((fn, originalIndex) => ({ fn, score: functionScoreMap[fn], originalIndex }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)

  // Build rank lookup: function → rank (0-based, 0 = highest)
  const rankMap: Record<string, number> = {}
  for (let i = 0; i < rankedFunctionList.length; i++) {
    rankMap[rankedFunctionList[i].fn] = i
  }

  // Compute fit score for each type
  let bestType: MBTIType = 'INFP'
  let bestFitScore = -Infinity
  let bestHeroScore = -Infinity

  for (const mbtiType of MBTI_TYPE_LIST) {
    const stack = getFunctionStack(mbtiType)
    let fitScore = 0

    for (let pos = 0; pos < 4; pos++) {
      const functionAtPosition = stack[pos]
      const userRank = rankMap[functionAtPosition]
      fitScore += POSITION_WEIGHT_LIST[pos] * (7 - userRank)
    }

    const heroScore = functionScoreMap[stack[0]]

    if (fitScore > bestFitScore || (fitScore === bestFitScore && heroScore > bestHeroScore)) {
      bestFitScore = fitScore
      bestType = mbtiType
      bestHeroScore = heroScore
    }
  }

  return { type: bestType, functionScoreMap }
}

// ============================================================
// DEEP SOCIONICS — Model A Stack-Fit + Quadra/Club
// ============================================================

type SocionicsQuadra = 'Alpha' | 'Beta' | 'Gamma' | 'Delta'
type SocionicsClub = 'Researcher' | 'Social' | 'Practical' | 'Humanitarian'

const QUADRA_LIST: readonly SocionicsQuadra[] = ['Alpha', 'Beta', 'Gamma', 'Delta'] as const
const CLUB_LIST: readonly SocionicsClub[] = ['Researcher', 'Social', 'Practical', 'Humanitarian'] as const

// Information element weight keys (ie_ prefix to distinguish from MBTI)
type InfoElement = 'ie_Ti' | 'ie_Te' | 'ie_Fi' | 'ie_Fe' | 'ie_Si' | 'ie_Se' | 'ie_Ni' | 'ie_Ne'

const INFO_ELEMENT_LIST: readonly InfoElement[] = [
  'ie_Ti', 'ie_Te', 'ie_Fi', 'ie_Fe', 'ie_Si', 'ie_Se', 'ie_Ni', 'ie_Ne',
] as const

// Model A function stacks: [Leading, Creative, Role, PoLR]
// Each type's strongest 4 positions — used for stack-fit correlation
const SOCIONICS_FUNCTION_STACK: Record<SocionicsType, readonly [InfoElement, InfoElement, InfoElement, InfoElement]> = {
  // Alpha
  ILE: ['ie_Ne', 'ie_Ti', 'ie_Se', 'ie_Fi'],
  SEI: ['ie_Si', 'ie_Fe', 'ie_Ni', 'ie_Te'],
  ESE: ['ie_Fe', 'ie_Si', 'ie_Te', 'ie_Ni'],
  LII: ['ie_Ti', 'ie_Ne', 'ie_Fi', 'ie_Se'],
  // Beta
  SLE: ['ie_Se', 'ie_Ti', 'ie_Ne', 'ie_Fi'],
  IEI: ['ie_Ni', 'ie_Fe', 'ie_Si', 'ie_Te'],
  EIE: ['ie_Fe', 'ie_Ni', 'ie_Te', 'ie_Si'],
  LSI: ['ie_Ti', 'ie_Se', 'ie_Fi', 'ie_Ne'],
  // Gamma
  SEE: ['ie_Se', 'ie_Fi', 'ie_Ne', 'ie_Ti'],
  ILI: ['ie_Ni', 'ie_Te', 'ie_Si', 'ie_Fe'],
  LIE: ['ie_Te', 'ie_Ni', 'ie_Fe', 'ie_Si'],
  ESI: ['ie_Fi', 'ie_Se', 'ie_Ti', 'ie_Ne'],
  // Delta
  IEE: ['ie_Ne', 'ie_Fi', 'ie_Se', 'ie_Ti'],
  SLI: ['ie_Si', 'ie_Te', 'ie_Ni', 'ie_Fe'],
  LSE: ['ie_Te', 'ie_Si', 'ie_Fe', 'ie_Ni'],
  EII: ['ie_Fi', 'ie_Ne', 'ie_Ti', 'ie_Se'],
}

const SOCIONICS_TYPE_LIST: readonly SocionicsType[] = [
  'ILE', 'SEI', 'ESE', 'LII',
  'SLE', 'IEI', 'EIE', 'LSI',
  'SEE', 'ILI', 'LIE', 'ESI',
  'IEE', 'SLI', 'LSE', 'EII',
] as const

// Quadra membership for each type
const TYPE_QUADRA: Record<SocionicsType, SocionicsQuadra> = {
  ILE: 'Alpha', SEI: 'Alpha', ESE: 'Alpha', LII: 'Alpha',
  SLE: 'Beta', IEI: 'Beta', EIE: 'Beta', LSI: 'Beta',
  SEE: 'Gamma', ILI: 'Gamma', LIE: 'Gamma', ESI: 'Gamma',
  IEE: 'Delta', SLI: 'Delta', LSE: 'Delta', EII: 'Delta',
}

// Club membership for each type
const TYPE_CLUB: Record<SocionicsType, SocionicsClub> = {
  ILE: 'Researcher', LII: 'Researcher', ILI: 'Researcher', LIE: 'Researcher',
  ESE: 'Humanitarian', SEI: 'Humanitarian', SEE: 'Humanitarian', ESI: 'Humanitarian',
  EIE: 'Social', IEI: 'Social', IEE: 'Social', EII: 'Social',
  SLE: 'Practical', LSI: 'Practical', SLI: 'Practical', LSE: 'Practical',
}

// Information elements that overlap with MBTI cognitive functions — cross-scored from MBTI answers.
// Ne, Ti, Te map closely between Jung/Beebe and Augusta's definitions.
const CROSS_SCORED_ELEMENT_MAP: Record<CognitiveFunction, InfoElement> = {
  Ne: 'ie_Ne',
  Ti: 'ie_Ti',
  Te: 'ie_Te',
} as Record<CognitiveFunction, InfoElement>

const CROSS_SCORED_FUNCTION_LIST: readonly CognitiveFunction[] = ['Ne', 'Ti', 'Te'] as const

/**
 * Build the full ie score map by combining:
 * 1. Socionics-specific ie scores (Se, Si, Ni, Fe, Fi) from Socionics questions
 * 2. Cross-scored ie scores (Ti, Te, Ne) from MBTI cognitive function answers
 *
 * When MBTI questions are unavailable, only Socionics-sourced ie scores are used.
 */
function buildInfoElementScoreMap(
  answerMap: QuizAnswerMap,
  socionicsQuestionList: QuizQuestion[],
  mbtiQuestionList: QuizQuestion[],
): Record<InfoElement, number> {
  // Score Socionics-specific ie keys from Socionics questions
  const socIeScoreMap = accumulateScoreMap(answerMap, socionicsQuestionList, new Set(INFO_ELEMENT_LIST))

  // Cross-score Ti, Te, Ne from MBTI if available
  if (mbtiQuestionList.length > 0) {
    const mbtiScoreMap = accumulateScoreMap(
      answerMap,
      mbtiQuestionList,
      new Set(COGNITIVE_FUNCTION_LIST),
    )

    for (const fn of CROSS_SCORED_FUNCTION_LIST) {
      const ieKey = CROSS_SCORED_ELEMENT_MAP[fn]
      // Use the MBTI score directly — replace any Socionics-sourced score for these elements
      socIeScoreMap[ieKey] = mbtiScoreMap[fn]
    }
  }

  return socIeScoreMap
}

/**
 * Score socionics type using 3 signals:
 *
 * 1. Information element stack-fit (hybrid: cross-scored Ti/Te/Ne from MBTI + Augusta-specific Se/Si/Ni/Fe/Fi)
 * 2. Quadra preference bonus
 * 3. Club preference bonus
 *
 * The final score = stackFit + (quadraBonus * 2) + clubBonus
 *
 * When mbtiQuestionList is empty (MBTI disabled), cross-scoring is skipped
 * and only Socionics-sourced ie scores + quadra/club are used.
 */
export function scoreSocionicsDeep(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  mbtiQuestionList: QuizQuestion[] = [],
): SocionicsType {
  // Accumulate quadra + club scores from Socionics questions
  const quadraClubKeySet = new Set<string>([...QUADRA_LIST, ...CLUB_LIST])
  const quadraClubScoreMap = accumulateScoreMap(answerMap, questionList, quadraClubKeySet)

  // Build full ie score map with cross-scoring
  const ieScoreMap = buildInfoElementScoreMap(answerMap, questionList, mbtiQuestionList)

  // Rank information elements by score (highest first)
  const rankedElementList = [...INFO_ELEMENT_LIST]
    .map((ie, originalIndex) => ({ ie, score: ieScoreMap[ie] ?? 0, originalIndex }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)

  const rankMap: Record<string, number> = {}
  for (let i = 0; i < rankedElementList.length; i++) {
    rankMap[rankedElementList[i].ie] = i
  }

  // Best quadra and club
  const bestQuadra = topKey(quadraClubScoreMap as Record<SocionicsQuadra, number>, QUADRA_LIST)
  const bestClub = topKey(quadraClubScoreMap as Record<SocionicsClub, number>, CLUB_LIST)

  // Score each type: stack-fit + quadra/club bonuses
  let bestType: SocionicsType = 'ILE'
  let bestScore = -Infinity

  for (const socType of SOCIONICS_TYPE_LIST) {
    const stack = SOCIONICS_FUNCTION_STACK[socType]

    // Stack-fit: position weights [4,3,2,1] × (7 - rank)
    let fitScore = 0
    for (let pos = 0; pos < 4; pos++) {
      fitScore += POSITION_WEIGHT_LIST[pos] * (7 - rankMap[stack[pos]])
    }

    // Quadra and club bonuses
    const quadraBonus = TYPE_QUADRA[socType] === bestQuadra ? 6 : 0
    const clubBonus = TYPE_CLUB[socType] === bestClub ? 3 : 0

    const totalScore = fitScore + quadraBonus + clubBonus

    if (totalScore > bestScore) {
      bestScore = totalScore
      bestType = socType
    }
  }

  return bestType
}

// ============================================================
// DEEP AP — Same algorithm, more data points
// ============================================================

type Aspect = 'V' | 'L' | 'E' | 'F'
const ASPECT_LIST: readonly Aspect[] = ['V', 'L', 'E', 'F'] as const
const ASPECT_PRIORITY: Record<Aspect, number> = { V: 4, L: 3, E: 2, F: 1 }

export function scoreAttitudinalDeep(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): APType {
  const winCount = accumulateScoreMap(answerMap, questionList, new Set(ASPECT_LIST))

  const sorted = [...ASPECT_LIST].sort((a, b) => {
    const winDiff = winCount[b] - winCount[a]
    if (winDiff !== 0) return winDiff
    return ASPECT_PRIORITY[b] - ASPECT_PRIORITY[a]
  })

  return sorted.join('') as APType
}

// ============================================================
// DEEP ENNEAGRAM — Same algorithm, more data points
// ============================================================

const ENNEAGRAM_NUMBER_LIST: readonly EnneagramNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
const ENNEAGRAM_INSTINCT_KEY_LIST: readonly EnneagramInstinct[] = ['sp', 'so', 'sx'] as const

export function scoreEnneagramDeep(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): { type: EnneagramNumber; wing: EnneagramNumber; instinct: EnneagramInstinct } {
  const typeScore: Record<string, number> = {}
  for (const num of ENNEAGRAM_NUMBER_LIST) typeScore[String(num)] = 0
  const instinctScore: Record<EnneagramInstinct, number> = { sp: 0, so: 0, sx: 0 }

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue
    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in typeScore) typeScore[key] += value
      if (key in instinctScore) instinctScore[key as EnneagramInstinct] += value
    }
  }

  const type = ENNEAGRAM_NUMBER_LIST.reduce((best, num) =>
    typeScore[String(num)] > typeScore[String(best)] ? num : best,
  )

  const [wingA, wingB] = getWings(type)
  const wing = typeScore[String(wingA)] >= typeScore[String(wingB)] ? wingA : wingB

  const instinct = ENNEAGRAM_INSTINCT_KEY_LIST.reduce((best, inst) =>
    instinctScore[inst] > instinctScore[best] ? inst : best,
  )

  return { type, wing, instinct }
}

// ============================================================
// DEEP INSTINCTS — Same 2-stage algorithm, more questions
// ============================================================

const INSTINCT_CENTER_LIST: readonly InstinctCenter[] = ['SUR', 'INT', 'PUR'] as const

export function scoreInstinctCenterDeep(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): InstinctCenter {
  const centerScore = accumulateScoreMap(answerMap, questionList, new Set(INSTINCT_CENTER_LIST))
  return topKey(centerScore, INSTINCT_CENTER_LIST)
}

export function scoreInstinctRealmDeep(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  center: InstinctCenter,
): InstinctRealm {
  const realmList = REALMS_BY_CENTER[center]
  const realmScore: Record<string, number> = {}
  for (const realm of realmList) realmScore[realm] = 0

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue
    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in realmScore) realmScore[key] += value
    }
  }

  return realmList.reduce((best, realm) =>
    (realmScore[realm] ?? 0) > (realmScore[best] ?? 0) ? realm : best,
  )
}

// ============================================================
// EXPLAIN FUNCTIONS — Deep Score Breakdowns
// ============================================================

export function explainAttitudinalDeep(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): ScoreBreakdown {
  const winCount = accumulateScoreMap(answerMap, questionList, new Set(ASPECT_LIST))

  const sorted = [...ASPECT_LIST].sort((a, b) => winCount[b] - winCount[a])
  const axisLeanSummary = [`${sorted[0]} scored ${winCount[sorted[0]]} (1st), ${sorted[1]} scored ${winCount[sorted[1]]} (2nd).`]
  if (winCount[sorted[0]] - winCount[sorted[1]] >= 4) {
    axisLeanSummary.push(`Clear ${sorted[0]} dominance.`)
  }

  const scoreDetail = sorted.map((a) => `${a}: ${winCount[a]}`)
  return { axisLeanSummary, scoreDetail }
}

export function explainEnneagramDeep(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): ScoreBreakdown {
  const typeScore: Record<string, number> = {}
  for (const num of ENNEAGRAM_NUMBER_LIST) typeScore[String(num)] = 0
  const instinctScore: Record<EnneagramInstinct, number> = { sp: 0, so: 0, sx: 0 }

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue
    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in typeScore) typeScore[key] += value
      if (key in instinctScore) instinctScore[key as EnneagramInstinct] += value
    }
  }

  const sortedTypeList = ENNEAGRAM_NUMBER_LIST
    .map((n) => ({ type: n, score: typeScore[String(n)], className: getEnneagramType(n).className }))
    .sort((a, b) => b.score - a.score)

  const top3 = sortedTypeList.slice(0, 3)
  const instinctSorted = ENNEAGRAM_INSTINCT_KEY_LIST
    .map((i) => ({ instinct: i, score: instinctScore[i] }))
    .sort((a, b) => b.score - a.score)

  const axisLeanSummary = [
    `Type ${top3[0].type} scored ${top3[0].score} (${top3[0].className}), Type ${top3[1].type} scored ${top3[1].score} (runner-up).`,
    `${instinctSorted[0].instinct} led with ${instinctSorted[0].score} points.`,
  ]

  const scoreDetail = [
    ...top3.map((t) => `Type ${t.type} (${t.className}): ${t.score}`),
    ...instinctSorted.map((i) => `${i.instinct}: ${i.score}`),
  ]

  return { axisLeanSummary, scoreDetail }
}

/** Explain deep MBTI: shows ranked function scores + top 3 type fit scores. */
export function explainMBTIDeep(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): ScoreBreakdown {
  const functionScoreMap = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(COGNITIVE_FUNCTION_LIST),
  )

  const rankedFunctionList = [...COGNITIVE_FUNCTION_LIST]
    .map((fn, originalIndex) => ({ fn, score: functionScoreMap[fn], originalIndex }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)

  const rankMap: Record<string, number> = {}
  for (let i = 0; i < rankedFunctionList.length; i++) {
    rankMap[rankedFunctionList[i].fn] = i
  }

  // Compute fit scores for all types
  const typeFitList: { type: MBTIType; fitScore: number }[] = []
  for (const mbtiType of MBTI_TYPE_LIST) {
    const stack = getFunctionStack(mbtiType)
    let fitScore = 0
    for (let pos = 0; pos < 4; pos++) {
      fitScore += POSITION_WEIGHT_LIST[pos] * (7 - rankMap[stack[pos]])
    }
    typeFitList.push({ type: mbtiType, fitScore })
  }
  typeFitList.sort((a, b) => b.fitScore - a.fitScore)

  const top3 = typeFitList.slice(0, 3)
  const margin = top3[0].fitScore - top3[1].fitScore

  const axisLeanSummary = [
    `Function-based: ${top3[0].type} (fit: ${top3[0].fitScore}), ${top3[1].type} (fit: ${top3[1].fitScore}). Margin: ${margin}.`,
    `Top functions: ${rankedFunctionList[0].fn} (${rankedFunctionList[0].score}), ${rankedFunctionList[1].fn} (${rankedFunctionList[1].score}).`,
  ]

  const scoreDetail = [
    ...rankedFunctionList.map((f) => `${f.fn}: ${f.score}`),
    '---',
    ...top3.map((t) => `${t.type}: fit ${t.fitScore}`),
  ]

  return { axisLeanSummary, scoreDetail }
}

export function explainSocionicsDeep(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  mbtiQuestionList: QuizQuestion[] = [],
): ScoreBreakdown {
  // Quadra + club from Socionics questions
  const quadraClubKeySet = new Set<string>([...QUADRA_LIST, ...CLUB_LIST])
  const quadraClubScoreMap = accumulateScoreMap(answerMap, questionList, quadraClubKeySet)

  // Full ie score map with cross-scoring
  const ieScoreMap = buildInfoElementScoreMap(answerMap, questionList, mbtiQuestionList)

  // Ranked information elements
  const rankedElementList = [...INFO_ELEMENT_LIST]
    .map((ie, originalIndex) => ({ ie, score: ieScoreMap[ie] ?? 0, originalIndex }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex)

  const sortedQuadraList = [...QUADRA_LIST]
    .map((q) => ({ quadra: q, score: quadraClubScoreMap[q] }))
    .sort((a, b) => b.score - a.score)

  const sortedClubList = [...CLUB_LIST]
    .map((c) => ({ club: c, score: quadraClubScoreMap[c] }))
    .sort((a, b) => b.score - a.score)

  const hasCrossScoring = mbtiQuestionList.length > 0
  const crossScoreNote = hasCrossScoring
    ? 'Ti/Te/Ne cross-scored from MBTI.'
    : 'No MBTI data — Ti/Te/Ne from Socionics questions only.'

  const axisLeanSummary = [
    `Quadra: ${sortedQuadraList[0].quadra} (${sortedQuadraList[0].score}), runner-up ${sortedQuadraList[1].quadra} (${sortedQuadraList[1].score}).`,
    `Top functions: ${rankedElementList[0].ie.replace('ie_', '')} (${rankedElementList[0].score}), ${rankedElementList[1].ie.replace('ie_', '')} (${rankedElementList[1].score}). ${crossScoreNote}`,
  ]

  const scoreDetail = [
    ...rankedElementList.map((e) => `${e.ie.replace('ie_', '')}: ${e.score}`),
    '---',
    ...sortedQuadraList.map((q) => `${q.quadra}: ${q.score}`),
    ...sortedClubList.map((c) => `${c.club}: ${c.score}`),
  ]

  return { axisLeanSummary, scoreDetail }
}

export function explainInstinctsDeep(
  answerMap: QuizAnswerMap,
  centerQuestionList: QuizQuestion[],
  realmQuestionList: QuizQuestion[],
  center: InstinctCenter,
): ScoreBreakdown {
  const centerScore = accumulateScoreMap(answerMap, centerQuestionList, new Set(INSTINCT_CENTER_LIST))

  const realmList = REALMS_BY_CENTER[center]
  const realmScore: Record<string, number> = {}
  for (const realm of realmList) realmScore[realm] = 0

  for (const question of realmQuestionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue
    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in realmScore) realmScore[key] += value
    }
  }

  const sortedCenterList = INSTINCT_CENTER_LIST
    .map((c) => ({ center: c, score: centerScore[c] }))
    .sort((a, b) => b.score - a.score)

  const sortedRealmList = [...realmList]
    .map((r) => ({ realm: r, score: realmScore[r] ?? 0 }))
    .sort((a, b) => b.score - a.score)

  const axisLeanSummary = [
    `${sortedCenterList[0].center} dominated (${sortedCenterList.map((c) => `${c.center} ${c.score}`).join(', ')}).`,
    `Within ${center}: ${sortedRealmList[0].realm} scored ${sortedRealmList[0].score}, ${sortedRealmList[1]?.realm ?? '—'} scored ${sortedRealmList[1]?.score ?? 0}.`,
  ]

  const scoreDetail = [
    ...sortedCenterList.map((c) => `${c.center}: ${c.score}`),
    ...sortedRealmList.map((r) => `${r.realm}: ${r.score}`),
  ]

  return { axisLeanSummary, scoreDetail }
}
