import type { APType, MBTIType, SocionicsType, EnneagramNumber, EnneagramInstinct, InstinctRealm, InstinctCenter } from '../types.ts'
import type { QuizQuestion, QuizAnswerMap } from '../../data/quiz/types.ts'
import { getWings, getEnneagramType } from '../../data/enneagram.ts'
import { REALMS_BY_CENTER } from '../../data/instincts.ts'

// ============================================================
// SCORE BREAKDOWN TYPE
// ============================================================

export interface ScoreBreakdown {
  axisLeanSummary: string[]
  scoreDetail: string[]
}

// ============================================================
// ATTITUDINAL PSYCHE — Pairwise Comparison
// ============================================================

type Aspect = 'V' | 'L' | 'E' | 'F'

const ASPECT_LIST: readonly Aspect[] = ['V', 'L', 'E', 'F'] as const

/** Tie-breaking priority: V > L > E > F */
const ASPECT_PRIORITY: Record<Aspect, number> = { V: 4, L: 3, E: 2, F: 1 }

/**
 * Score AP type from 6 pairwise comparison questions.
 * Each option's weights should have a single key (V, L, E, or F) with value 1,
 * indicating which aspect wins that comparison.
 */
export function scoreAttitudinal(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): APType {
  const winCount: Record<Aspect, number> = { V: 0, L: 0, E: 0, F: 0 }

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue

    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in winCount) {
        winCount[key as Aspect] += value
      }
    }
  }

  // Sort by win count descending, then by priority descending for ties
  const sorted = [...ASPECT_LIST].sort((a, b) => {
    const winDiff = winCount[b] - winCount[a]
    if (winDiff !== 0) return winDiff
    return ASPECT_PRIORITY[b] - ASPECT_PRIORITY[a]
  })

  return sorted.join('') as APType
}

// ============================================================
// ENNEAGRAM — Weighted Accumulator
// ============================================================

const ENNEAGRAM_NUMBER_LIST: readonly EnneagramNumber[] = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const
const ENNEAGRAM_INSTINCT_KEY_LIST: readonly EnneagramInstinct[] = ['sp', 'so', 'sx'] as const

/**
 * Score enneagram type, wing, and instinct from weighted accumulator questions.
 * Weight keys: '1'-'9' for type scores, 'sp'/'so'/'sx' for instinct scores.
 */
export function scoreEnneagram(
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
      if (key in typeScore) {
        typeScore[key] += value
      }
      if (key in instinctScore) {
        instinctScore[key as EnneagramInstinct] += value
      }
    }
  }

  // Core type: highest scoring type number
  const type = ENNEAGRAM_NUMBER_LIST.reduce((best, num) =>
    typeScore[String(num)] > typeScore[String(best)] ? num : best,
  )

  // Wing: of the two adjacent wings, pick the one with the higher type score
  const [wingA, wingB] = getWings(type)
  const wing = typeScore[String(wingA)] >= typeScore[String(wingB)] ? wingA : wingB

  // Instinct: highest scoring variant
  const instinct = ENNEAGRAM_INSTINCT_KEY_LIST.reduce((best, inst) =>
    instinctScore[inst] > instinctScore[best] ? inst : best,
  )

  return { type, wing, instinct }
}

// ============================================================
// MBTI — 4-Axis Binary Scoring
// ============================================================

type MBTIAxis = 'EI' | 'SN' | 'TF' | 'JP'

const MBTI_AXIS_LIST: readonly MBTIAxis[] = ['EI', 'SN', 'TF', 'JP'] as const

/**
 * Score MBTI type from 4-axis questions (3 per axis).
 * Weight keys: 'EI', 'SN', 'TF', 'JP'. Positive leans toward first letter (E, S, T, J),
 * negative leans toward second letter (I, N, F, P). Zero defaults to second letter.
 */
export function scoreMBTI(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): MBTIType {
  const axisScore: Record<MBTIAxis, number> = { EI: 0, SN: 0, TF: 0, JP: 0 }

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue

    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in axisScore) {
        axisScore[key as MBTIAxis] += value
      }
    }
  }

  const letterList = MBTI_AXIS_LIST.map((axis) => {
    const score = axisScore[axis]
    switch (axis) {
      case 'EI': return score > 0 ? 'E' : 'I'
      case 'SN': return score > 0 ? 'S' : 'N'
      case 'TF': return score > 0 ? 'T' : 'F'
      case 'JP': return score > 0 ? 'J' : 'P'
    }
  })

  return letterList.join('') as MBTIType
}

// ============================================================
// SOCIONICS — MBTI Derivation + Quadra Adjustment
// ============================================================

type SocionicsQuadra = 'Alpha' | 'Beta' | 'Gamma' | 'Delta'

const MBTI_TO_SOCIONICS: Record<MBTIType, SocionicsType> = {
  INTJ: 'ILI', INTP: 'LII', ENTJ: 'LIE', ENTP: 'ILE',
  INFJ: 'IEI', INFP: 'EII', ENFJ: 'EIE', ENFP: 'IEE',
  ISTJ: 'LSI', ISFJ: 'ESI', ESTJ: 'LSE', ESFJ: 'ESE',
  ISTP: 'SLI', ISFP: 'SEI', ESTP: 'SLE', ESFP: 'SEE',
}

const SOCIONICS_TYPE_QUADRA: Record<SocionicsType, SocionicsQuadra> = {
  ILE: 'Alpha', SEI: 'Alpha', ESE: 'Alpha', LII: 'Alpha',
  SLE: 'Beta',  IEI: 'Beta',  EIE: 'Beta',  LSI: 'Beta',
  SEE: 'Gamma', ILI: 'Gamma', LIE: 'Gamma', ESI: 'Gamma',
  IEE: 'Delta', SLI: 'Delta', LSE: 'Delta', EII: 'Delta',
}

/** Types grouped by quadra, for fallback matching. */
const TYPES_BY_QUADRA: Record<SocionicsQuadra, readonly SocionicsType[]> = {
  Alpha: ['ILE', 'SEI', 'ESE', 'LII'],
  Beta:  ['SLE', 'IEI', 'EIE', 'LSI'],
  Gamma: ['SEE', 'ILI', 'LIE', 'ESI'],
  Delta: ['IEE', 'SLI', 'LSE', 'EII'],
}

/** Reverse mapping: socionics type → MBTI type that maps to it. */
const SOCIONICS_TO_MBTI: Record<SocionicsType, MBTIType> = {} as Record<SocionicsType, MBTIType>
for (const [mbti, soc] of Object.entries(MBTI_TO_SOCIONICS)) {
  SOCIONICS_TO_MBTI[soc] = mbti as MBTIType
}

/** Count how many MBTI letter positions match between two MBTI types. */
function mbtiOverlap(a: MBTIType, b: MBTIType): number {
  let count = 0
  for (let i = 0; i < 4; i++) {
    if (a[i] === b[i]) count++
  }
  return count
}

/**
 * Score socionics type by deriving from MBTI result and adjusting with quadra preference questions.
 * Weight keys: 'Alpha', 'Beta', 'Gamma', 'Delta'.
 */
export function scoreSocionics(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  mbtiResult: MBTIType,
): SocionicsType {
  const derivedType = MBTI_TO_SOCIONICS[mbtiResult]
  const derivedQuadra = SOCIONICS_TYPE_QUADRA[derivedType]

  const quadraScore: Record<SocionicsQuadra, number> = { Alpha: 0, Beta: 0, Gamma: 0, Delta: 0 }

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue

    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in quadraScore) {
        quadraScore[key as SocionicsQuadra] += value
      }
    }
  }

  // Find the highest-scoring quadra
  const scoredQuadra = (Object.entries(quadraScore) as [SocionicsQuadra, number][])
    .sort((a, b) => b[1] - a[1])[0][0]

  // If scored quadra matches derived quadra, keep derived type
  if (scoredQuadra === derivedQuadra) {
    return derivedType
  }

  // Otherwise, find the type in the scored quadra with the most MBTI letter overlap
  const candidateList = TYPES_BY_QUADRA[scoredQuadra]
  let bestCandidate = candidateList[0]
  let bestOverlap = -1

  for (const candidate of candidateList) {
    const candidateMBTI = SOCIONICS_TO_MBTI[candidate]
    const overlap = mbtiOverlap(mbtiResult, candidateMBTI)
    if (overlap > bestOverlap) {
      bestOverlap = overlap
      bestCandidate = candidate
    }
  }

  return bestCandidate
}

// ============================================================
// EXPANDED INSTINCTS — 2-Stage Funnel
// ============================================================

const INSTINCT_CENTER_LIST: readonly InstinctCenter[] = ['SUR', 'INT', 'PUR'] as const

/**
 * Score instinct center from stage-1 questions.
 * Weight keys: 'SUR', 'INT', 'PUR'.
 */
export function scoreInstinctCenter(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): InstinctCenter {
  const centerScore: Record<InstinctCenter, number> = { SUR: 0, INT: 0, PUR: 0 }

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue

    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in centerScore) {
        centerScore[key as InstinctCenter] += value
      }
    }
  }

  return INSTINCT_CENTER_LIST.reduce((best, center) =>
    centerScore[center] > centerScore[best] ? center : best,
  )
}

/**
 * Score instinct realm from stage-2 questions within a determined center.
 * Weight keys are realm codes (e.g. 'FD', 'SY', 'SM' for SUR center).
 */
export function scoreInstinctRealm(
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
      if (key in realmScore) {
        realmScore[key] += value
      }
    }
  }

  return realmList.reduce((best, realm) =>
    (realmScore[realm] ?? 0) > (realmScore[best] ?? 0) ? realm : best,
  )
}

/**
 * Full instinct scoring: stage 1 (center) + stage 2 (realm).
 * Splits questionList into center questions (first 3) and realm questions (remaining).
 */
export function scoreInstincts(
  answerMap: QuizAnswerMap,
  centerQuestionList: QuizQuestion[],
  realmQuestionList: QuizQuestion[],
): InstinctRealm {
  const center = scoreInstinctCenter(answerMap, centerQuestionList)
  return scoreInstinctRealm(answerMap, realmQuestionList, center)
}

// ============================================================
// EXPLAIN FUNCTIONS — Score Breakdowns
// ============================================================

/** Explain AP scoring: show aspect win counts. */
export function explainAttitudinal(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): ScoreBreakdown {
  const winCount: Record<Aspect, number> = { V: 0, L: 0, E: 0, F: 0 }

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue
    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in winCount) winCount[key as Aspect] += value
    }
  }

  const sorted = ([...ASPECT_LIST] as Aspect[]).sort((a, b) => winCount[b] - winCount[a])
  const axisLeanSummary = [`${sorted[0]} won ${winCount[sorted[0]]} comparisons (1st), ${sorted[1]} won ${winCount[sorted[1]]} (2nd).`]
  if (winCount[sorted[0]] - winCount[sorted[1]] >= 3) {
    axisLeanSummary.push(`Clear ${sorted[0]} dominance.`)
  }

  const scoreDetail = sorted.map((a) => `${a}: ${winCount[a]} wins`)

  return { axisLeanSummary, scoreDetail }
}

/** Explain Enneagram scoring: show top-3 type scores + instinct scores. */
export function explainEnneagram(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): ScoreBreakdown {
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

/** Explain MBTI scoring: show axis scores with lean direction. */
export function explainMBTI(answerMap: QuizAnswerMap, questionList: QuizQuestion[]): ScoreBreakdown {
  const axisScore: Record<MBTIAxis, number> = { EI: 0, SN: 0, TF: 0, JP: 0 }

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue
    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in axisScore) axisScore[key as MBTIAxis] += value
    }
  }

  const leanDescription = (axis: MBTIAxis, score: number): string => {
    const abs = Math.abs(score)
    const strength = abs >= 4 ? 'Strong' : abs >= 2 ? 'Moderate' : 'Slight'
    const letterMap: Record<MBTIAxis, [string, string]> = {
      EI: ['E', 'I'], SN: ['S', 'N'], TF: ['T', 'F'], JP: ['J', 'P'],
    }
    const [pos, neg] = letterMap[axis]
    const direction = score > 0 ? pos : score < 0 ? neg : neg
    return `${strength} ${direction} preference (${axis}: ${score > 0 ? '+' : ''}${score})`
  }

  const axisLeanSummary = MBTI_AXIS_LIST.map((axis) => leanDescription(axis, axisScore[axis]) + '.')
  const scoreDetail = MBTI_AXIS_LIST.map((axis) => `${axis}: ${axisScore[axis]}`)

  return { axisLeanSummary, scoreDetail }
}

/** Explain Socionics scoring: show quadra scores + derivation match. */
export function explainSocionics(answerMap: QuizAnswerMap, questionList: QuizQuestion[], mbtiResult: MBTIType): ScoreBreakdown {
  const derivedType = MBTI_TO_SOCIONICS[mbtiResult]
  const derivedQuadra = SOCIONICS_TYPE_QUADRA[derivedType]
  const quadraScore: Record<SocionicsQuadra, number> = { Alpha: 0, Beta: 0, Gamma: 0, Delta: 0 }

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue
    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in quadraScore) quadraScore[key as SocionicsQuadra] += value
    }
  }

  const sortedQuadraList = (Object.entries(quadraScore) as [SocionicsQuadra, number][])
    .sort((a, b) => b[1] - a[1])

  const scoredQuadra = sortedQuadraList[0][0]
  const matched = scoredQuadra === derivedQuadra

  const axisLeanSummary = [
    `${sortedQuadraList[0][0]} scored ${sortedQuadraList[0][1]}, ${sortedQuadraList[1][0]} scored ${sortedQuadraList[1][1]}.`,
    matched
      ? `Derived ${derivedType} matched ${derivedQuadra}, keeping result.`
      : `Derived ${derivedType} (${derivedQuadra}) overridden by ${scoredQuadra} preference.`,
  ]

  const scoreDetail = sortedQuadraList.map(([q, s]) => `${q}: ${s}`)

  return { axisLeanSummary, scoreDetail }
}

/** Explain Instinct scoring: show center + realm scores. */
export function explainInstincts(
  answerMap: QuizAnswerMap,
  centerQuestionList: QuizQuestion[],
  realmQuestionList: QuizQuestion[],
  center: InstinctCenter,
): ScoreBreakdown {
  const centerScore: Record<InstinctCenter, number> = { SUR: 0, INT: 0, PUR: 0 }

  for (const question of centerQuestionList) {
    const selectedIndex = answerMap[question.id]
    if (selectedIndex === undefined) continue
    const option = question.optionList[selectedIndex]
    for (const [key, value] of Object.entries(option.weights)) {
      if (key in centerScore) centerScore[key as InstinctCenter] += value
    }
  }

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
