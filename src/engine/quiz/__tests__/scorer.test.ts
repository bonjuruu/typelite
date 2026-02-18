import { describe, it, expect } from 'vitest'
import { scoreAttitudinal, scoreEnneagram, scoreMBTI, scoreSocionics, scoreInstinctCenter, scoreInstinctRealm, scoreInstincts } from '../scorer.ts'
import type { QuizQuestion, QuizAnswerMap } from '../../../data/quiz/types.ts'
import { AP_QUESTION_LIST, ENNEAGRAM_QUESTION_LIST, MBTI_QUESTION_LIST, SOCIONICS_QUESTION_LIST, INSTINCT_CENTER_QUESTION_LIST, getInstinctRealmQuestionList } from '../../../data/quiz/questions.ts'

// ============================================================
// HELPERS
// ============================================================

/** Build an answer map from a question list by selecting option at the given index for each question. */
function answerAll(questionList: readonly QuizQuestion[], optionIndex: number): QuizAnswerMap {
  const answerMap: QuizAnswerMap = {}
  for (const question of questionList) {
    answerMap[question.id] = Math.min(optionIndex, question.optionList.length - 1)
  }
  return answerMap
}

/** Build an answer map by selecting specific options for each question. */
function answerWith(questionList: readonly QuizQuestion[], indexList: number[]): QuizAnswerMap {
  const answerMap: QuizAnswerMap = {}
  for (let i = 0; i < questionList.length; i++) {
    answerMap[questionList[i].id] = indexList[i] ?? 0
  }
  return answerMap
}

// ============================================================
// scoreAttitudinal
// ============================================================

describe('scoreAttitudinal', () => {
  it('returns a valid 4-letter AP type', () => {
    const answerMap = answerAll(AP_QUESTION_LIST, 0)
    const result = scoreAttitudinal(answerMap, [...AP_QUESTION_LIST])
    expect(result).toHaveLength(4)
    expect(result).toMatch(/^[VLEF]{4}$/)
  })

  it('returns VELF when V wins 3, E wins 2, L wins 1, F wins 0', () => {
    // ap-1: V vs L → pick V (option 0) → V:1
    // ap-2: V vs E → pick V (option 0) → V:2
    // ap-3: V vs F → pick V (option 0) → V:3
    // ap-4: L vs E → pick E (option 1) → E:1
    // ap-5: L vs F → pick L (option 0) → L:1
    // ap-6: E vs F → pick E (option 0) → E:2
    // Result: V:3, E:2, L:1, F:0 → VELF
    const answerMap = answerWith(AP_QUESTION_LIST, [0, 0, 0, 1, 0, 0])
    const result = scoreAttitudinal(answerMap, [...AP_QUESTION_LIST])
    expect(result).toBe('VELF')
  })

  it('returns FLEV when F wins 3, L wins 2, E wins 1, V wins 0', () => {
    // ap-1: V vs L → pick L (option 1) → L:1
    // ap-2: V vs E → pick E (option 1) → E:1
    // ap-3: V vs F → pick F (option 1) → F:1
    // ap-4: L vs E → pick L (option 0) → L:2
    // ap-5: L vs F → pick F (option 1) → F:2
    // ap-6: E vs F → pick F (option 1) → F:3
    // Result: F:3, L:2, E:1, V:0 → FLEV
    const answerMap = answerWith(AP_QUESTION_LIST, [1, 1, 1, 0, 1, 1])
    const result = scoreAttitudinal(answerMap, [...AP_QUESTION_LIST])
    expect(result).toBe('FLEV')
  })

  it('breaks ties using priority V > L > E > F', () => {
    // If all aspects have 0 wins (empty answer map), tie-break → VLEF
    const result = scoreAttitudinal({}, [...AP_QUESTION_LIST])
    expect(result).toBe('VLEF')
  })

  it('all unique aspects present in output', () => {
    const answerMap = answerAll(AP_QUESTION_LIST, 0)
    const result = scoreAttitudinal(answerMap, [...AP_QUESTION_LIST])
    const charSet = new Set(result.split(''))
    expect(charSet.size).toBe(4)
    expect(charSet.has('V')).toBe(true)
    expect(charSet.has('L')).toBe(true)
    expect(charSet.has('E')).toBe(true)
    expect(charSet.has('F')).toBe(true)
  })
})

// ============================================================
// scoreEnneagram
// ============================================================

describe('scoreEnneagram', () => {
  it('returns valid type, wing, and instinct', () => {
    const answerMap = answerAll(ENNEAGRAM_QUESTION_LIST, 0)
    const result = scoreEnneagram(answerMap, [...ENNEAGRAM_QUESTION_LIST])
    expect(result.type).toBeGreaterThanOrEqual(1)
    expect(result.type).toBeLessThanOrEqual(9)
    expect(['sp', 'so', 'sx']).toContain(result.instinct)
  })

  it('returns type 5 when answers are weighted toward 5', () => {
    // Select options that heavily weight type 5:
    // enn-1: option 3 (4:+3, 5:+1), enn-2: option 0 (5:+3, 4:+1), enn-3: option 2 (5:+3, 9:+1)
    // enn-4: option 3 (4:+3, 5:+1), enn-5: option 2 (5:+3, 7:+1), enn-6: option 2 (6:+3, 5:+1)
    // enn-7: option 1 (5:+3, 9:+1), enn-8: option 0 (1:+3, 5:+1), enn-9: option 0 (4:+3, 7:+1)
    // enn-10: option 2 (5:+3, 6:+1), enn-11: option 3 (5:+3, 4:+1)
    // enn-12: option 1 (6:+3, 5:+1)
    // enn-13: sp, enn-14: sp, enn-15: sp
    const answerMap = answerWith(ENNEAGRAM_QUESTION_LIST, [3, 0, 2, 3, 2, 2, 1, 0, 0, 2, 3, 1, 0, 0, 0])
    const result = scoreEnneagram(answerMap, [...ENNEAGRAM_QUESTION_LIST])
    expect(result.type).toBe(5)
  })

  it('wing is adjacent to the core type', () => {
    const answerMap = answerAll(ENNEAGRAM_QUESTION_LIST, 0)
    const result = scoreEnneagram(answerMap, [...ENNEAGRAM_QUESTION_LIST])
    // Wings for any type are adjacent numbers (wrapping at 1/9)
    const type = result.type
    const validWingList = type === 1 ? [9, 2] : type === 9 ? [8, 1] : [type - 1, type + 1]
    expect(validWingList).toContain(result.wing)
  })

  it('returns sp instinct when sp answers are selected', () => {
    // Answer type questions randomly (first option), then sp for all 3 instinct questions
    const answerMap = answerWith(ENNEAGRAM_QUESTION_LIST, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    const result = scoreEnneagram(answerMap, [...ENNEAGRAM_QUESTION_LIST])
    expect(result.instinct).toBe('sp')
  })

  it('returns sx instinct when sx answers are selected', () => {
    const answerMap = answerWith(ENNEAGRAM_QUESTION_LIST, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2])
    const result = scoreEnneagram(answerMap, [...ENNEAGRAM_QUESTION_LIST])
    expect(result.instinct).toBe('sx')
  })
})

// ============================================================
// scoreMBTI
// ============================================================

describe('scoreMBTI', () => {
  it('returns a valid 4-letter MBTI type', () => {
    const answerMap = answerAll(MBTI_QUESTION_LIST, 0)
    const result = scoreMBTI(answerMap, [...MBTI_QUESTION_LIST])
    expect(result).toHaveLength(4)
    expect(result).toMatch(/^[EI][SN][TF][JP]$/)
  })

  it('returns INTJ when all answers lean I, N, T, J', () => {
    // EI: option 1 (negative → I) for questions 1-3
    // SN: option 1 (negative → N) for questions 4-6
    // TF: option 0 (positive → T) for questions 7-9
    // JP: option 0 (positive → J) for questions 10-12
    const answerMap = answerWith(MBTI_QUESTION_LIST, [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0])
    const result = scoreMBTI(answerMap, [...MBTI_QUESTION_LIST])
    expect(result).toBe('INTJ')
  })

  it('returns ESFP when all answers lean E, S, F, P', () => {
    // EI: option 0 (positive → E) for questions 1-3
    // SN: option 0 (positive → S) for questions 4-6
    // TF: option 1 (negative → F) for questions 7-9
    // JP: option 1 (negative → P) for questions 10-12
    const answerMap = answerWith(MBTI_QUESTION_LIST, [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1])
    const result = scoreMBTI(answerMap, [...MBTI_QUESTION_LIST])
    expect(result).toBe('ESFP')
  })

  it('defaults to I, N, F, P when all scores are zero', () => {
    // Empty answers → all axis scores are 0 → defaults to second letter
    const result = scoreMBTI({}, [...MBTI_QUESTION_LIST])
    expect(result).toBe('INFP')
  })

  it('each axis is independent', () => {
    // Mix: E, N, T, P
    const answerMap = answerWith(MBTI_QUESTION_LIST, [0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1])
    const result = scoreMBTI(answerMap, [...MBTI_QUESTION_LIST])
    expect(result).toBe('ENTP')
  })
})

// ============================================================
// scoreSocionics
// ============================================================

describe('scoreSocionics', () => {
  it('returns the MBTI-derived type when quadra matches', () => {
    // INTJ → ILI (Gamma). All answers lean Gamma.
    const answerMap = answerWith(SOCIONICS_QUESTION_LIST, [2, 2, 2, 2])
    const result = scoreSocionics(answerMap, [...SOCIONICS_QUESTION_LIST], 'INTJ')
    expect(result).toBe('ILI')
  })

  it('adjusts type when quadra preference differs from MBTI derivation', () => {
    // INTJ → ILI (Gamma). But all answers lean Alpha.
    // Should pick an introverted Alpha type → LII
    const answerMap = answerWith(SOCIONICS_QUESTION_LIST, [0, 0, 0, 0])
    const result = scoreSocionics(answerMap, [...SOCIONICS_QUESTION_LIST], 'INTJ')
    expect(result).toBe('LII')
  })

  it('preserves introversion/extraversion in quadra mismatch', () => {
    // ENFP → IEE (Delta). All answers lean Beta.
    // Should pick an extraverted Beta type → SLE or EIE
    const answerMap = answerWith(SOCIONICS_QUESTION_LIST, [1, 1, 1, 1])
    const result = scoreSocionics(answerMap, [...SOCIONICS_QUESTION_LIST], 'ENFP')
    // ENFP is extraverted → picks extraverted Beta type
    expect(['SLE', 'EIE']).toContain(result)
  })

  it('returns valid socionics type', () => {
    const validTypeList = ['ILE', 'SEI', 'ESE', 'LII', 'SLE', 'IEI', 'EIE', 'LSI', 'SEE', 'ILI', 'LIE', 'ESI', 'IEE', 'SLI', 'LSE', 'EII']
    const answerMap = answerAll(SOCIONICS_QUESTION_LIST, 0)
    const result = scoreSocionics(answerMap, [...SOCIONICS_QUESTION_LIST], 'INTP')
    expect(validTypeList).toContain(result)
  })
})

// ============================================================
// scoreInstincts
// ============================================================

describe('scoreInstinctCenter', () => {
  it('returns SUR when SUR answers dominate', () => {
    const answerMap = answerAll(INSTINCT_CENTER_QUESTION_LIST, 0)
    const result = scoreInstinctCenter(answerMap, [...INSTINCT_CENTER_QUESTION_LIST])
    expect(result).toBe('SUR')
  })

  it('returns INT when INT answers dominate', () => {
    const answerMap = answerAll(INSTINCT_CENTER_QUESTION_LIST, 1)
    const result = scoreInstinctCenter(answerMap, [...INSTINCT_CENTER_QUESTION_LIST])
    expect(result).toBe('INT')
  })

  it('returns PUR when PUR answers dominate', () => {
    const answerMap = answerAll(INSTINCT_CENTER_QUESTION_LIST, 2)
    const result = scoreInstinctCenter(answerMap, [...INSTINCT_CENTER_QUESTION_LIST])
    expect(result).toBe('PUR')
  })
})

describe('scoreInstinctRealm', () => {
  it('returns FD for SUR center when FD answers dominate', () => {
    const realmQuestionList = getInstinctRealmQuestionList('SUR')
    const answerMap = answerAll(realmQuestionList, 0)
    const result = scoreInstinctRealm(answerMap, [...realmQuestionList], 'SUR')
    expect(result).toBe('FD')
  })

  it('returns SY for SUR center when SY answers dominate', () => {
    const realmQuestionList = getInstinctRealmQuestionList('SUR')
    const answerMap = answerAll(realmQuestionList, 1)
    const result = scoreInstinctRealm(answerMap, [...realmQuestionList], 'SUR')
    expect(result).toBe('SY')
  })

  it('returns AY for INT center when AY answers dominate', () => {
    const realmQuestionList = getInstinctRealmQuestionList('INT')
    const answerMap = answerAll(realmQuestionList, 0)
    const result = scoreInstinctRealm(answerMap, [...realmQuestionList], 'INT')
    expect(result).toBe('AY')
  })

  it('returns SS for PUR center when SS answers dominate', () => {
    const realmQuestionList = getInstinctRealmQuestionList('PUR')
    const answerMap = answerAll(realmQuestionList, 0)
    const result = scoreInstinctRealm(answerMap, [...realmQuestionList], 'PUR')
    expect(result).toBe('SS')
  })
})

describe('scoreInstincts (full 2-stage)', () => {
  it('returns FD when center is SUR and realm is FD', () => {
    const centerAnswerMap = answerAll(INSTINCT_CENTER_QUESTION_LIST, 0)
    const realmQuestionList = getInstinctRealmQuestionList('SUR')
    const realmAnswerMap = answerAll(realmQuestionList, 0)
    const combinedAnswerMap = { ...centerAnswerMap, ...realmAnswerMap }
    const result = scoreInstincts(combinedAnswerMap, [...INSTINCT_CENTER_QUESTION_LIST], [...realmQuestionList])
    expect(result).toBe('FD')
  })

  it('returns CY when center is INT and realm is CY', () => {
    const centerAnswerMap = answerAll(INSTINCT_CENTER_QUESTION_LIST, 1)
    const realmQuestionList = getInstinctRealmQuestionList('INT')
    const realmAnswerMap = answerAll(realmQuestionList, 1)
    const combinedAnswerMap = { ...centerAnswerMap, ...realmAnswerMap }
    const result = scoreInstincts(combinedAnswerMap, [...INSTINCT_CENTER_QUESTION_LIST], [...realmQuestionList])
    expect(result).toBe('CY')
  })

  it('returns UN when center is PUR and realm is UN', () => {
    const centerAnswerMap = answerAll(INSTINCT_CENTER_QUESTION_LIST, 2)
    const realmQuestionList = getInstinctRealmQuestionList('PUR')
    const realmAnswerMap = answerAll(realmQuestionList, 2)
    const combinedAnswerMap = { ...centerAnswerMap, ...realmAnswerMap }
    const result = scoreInstincts(combinedAnswerMap, [...INSTINCT_CENTER_QUESTION_LIST], [...realmQuestionList])
    expect(result).toBe('UN')
  })
})
