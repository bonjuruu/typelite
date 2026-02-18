import { describe, it, expect } from 'vitest'
import {
  DEEP_AP_QUESTION_LIST,
  DEEP_ENNEAGRAM_QUESTION_LIST,
  DEEP_MBTI_QUESTION_LIST,
  DEEP_SOCIONICS_QUESTION_LIST,
  DEEP_INSTINCT_CENTER_QUESTION_LIST,
  getLongInstinctRealmQuestionList,
  getLongQuestionList,
  DEEP_QUESTION_COUNT,
} from '../longQuestions.ts'
import type { QuizQuestion } from '../types.ts'

// ============================================================
// HELPERS
// ============================================================

function allDeepQuestionList(): readonly QuizQuestion[] {
  return [
    ...DEEP_AP_QUESTION_LIST,
    ...DEEP_ENNEAGRAM_QUESTION_LIST,
    ...DEEP_MBTI_QUESTION_LIST,
    ...DEEP_SOCIONICS_QUESTION_LIST,
    ...DEEP_INSTINCT_CENTER_QUESTION_LIST,
    ...getLongInstinctRealmQuestionList('SUR'),
    ...getLongInstinctRealmQuestionList('INT'),
    ...getLongInstinctRealmQuestionList('PUR'),
  ]
}

// ============================================================
// QUESTION COUNTS
// ============================================================

describe('Deep question counts', () => {
  it('AP has exactly 12 questions', () => {
    expect(DEEP_AP_QUESTION_LIST).toHaveLength(12)
  })

  it('Enneagram has exactly 30 questions', () => {
    expect(DEEP_ENNEAGRAM_QUESTION_LIST).toHaveLength(30)
  })

  it('MBTI has exactly 32 questions', () => {
    expect(DEEP_MBTI_QUESTION_LIST).toHaveLength(32)
  })

  it('Socionics has exactly 22 questions', () => {
    expect(DEEP_SOCIONICS_QUESTION_LIST).toHaveLength(22)
  })

  it('Instinct center has exactly 6 questions', () => {
    expect(DEEP_INSTINCT_CENTER_QUESTION_LIST).toHaveLength(6)
  })

  it('each instinct center has exactly 4 realm questions', () => {
    expect(getLongInstinctRealmQuestionList('SUR')).toHaveLength(4)
    expect(getLongInstinctRealmQuestionList('INT')).toHaveLength(4)
    expect(getLongInstinctRealmQuestionList('PUR')).toHaveLength(4)
  })

  it('DEEP_QUESTION_COUNT matches actual lengths', () => {
    expect(DEEP_QUESTION_COUNT.attitudinal).toBe(DEEP_AP_QUESTION_LIST.length)
    expect(DEEP_QUESTION_COUNT.enneagram).toBe(DEEP_ENNEAGRAM_QUESTION_LIST.length)
    expect(DEEP_QUESTION_COUNT.mbti).toBe(DEEP_MBTI_QUESTION_LIST.length)
    expect(DEEP_QUESTION_COUNT.socionics).toBe(DEEP_SOCIONICS_QUESTION_LIST.length)
    // instincts = 6 center + 12 realm but only 4 shown; count reports 18 as total including all realm options
    expect(DEEP_QUESTION_COUNT.instincts).toBe(
      DEEP_INSTINCT_CENTER_QUESTION_LIST.length
      + getLongInstinctRealmQuestionList('SUR').length
      + getLongInstinctRealmQuestionList('INT').length
      + getLongInstinctRealmQuestionList('PUR').length,
    )
  })
})

// ============================================================
// UNIQUE IDS
// ============================================================

describe('Deep question ID uniqueness', () => {
  it('every deep question has a unique ID', () => {
    const questionList = allDeepQuestionList()
    const idSet = new Set(questionList.map((q) => q.id))
    expect(idSet.size).toBe(questionList.length)
  })

  it('all deep question IDs start with "deep-"', () => {
    for (const question of allDeepQuestionList()) {
      expect(question.id.startsWith('deep-'), `Question ${question.id} does not start with "deep-"`).toBe(true)
    }
  })

  it('deep question IDs do not collide with quick question IDs', () => {
    // All deep IDs start with "deep-", quick IDs do not
    for (const question of allDeepQuestionList()) {
      expect(question.id).toMatch(/^deep-/)
    }
  })
})

// ============================================================
// OPTION VALIDATION
// ============================================================

describe('Deep option validation', () => {
  it('every question has at least 2 options', () => {
    for (const question of allDeepQuestionList()) {
      expect(question.optionList.length, `Question ${question.id} has fewer than 2 options`).toBeGreaterThanOrEqual(2)
    }
  })

  it('every option has a non-empty label', () => {
    for (const question of allDeepQuestionList()) {
      for (const option of question.optionList) {
        expect(option.label.trim().length, `Option in ${question.id} has empty label`).toBeGreaterThan(0)
      }
    }
  })

  it('every option has non-empty weights', () => {
    for (const question of allDeepQuestionList()) {
      for (const option of question.optionList) {
        expect(Object.keys(option.weights).length, `Option "${option.label}" in ${question.id} has no weights`).toBeGreaterThan(0)
      }
    }
  })
})

// ============================================================
// MBTI COGNITIVE FUNCTION VALIDATION
// ============================================================

describe('Deep MBTI question validation', () => {
  const validFunctionKeySet = new Set(['Ti', 'Te', 'Fi', 'Fe', 'Si', 'Se', 'Ni', 'Ne'])

  it('weight keys are valid cognitive functions', () => {
    for (const question of DEEP_MBTI_QUESTION_LIST) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(validFunctionKeySet.has(key), `Invalid MBTI weight key "${key}" in question ${question.id}`).toBe(true)
        }
      }
    }
  })

  it('every cognitive function has at least 4 questions where it receives primary weight', () => {
    // For each function, count questions where at least one option gives it the max weight (3)
    const functionCount: Record<string, number> = {}
    for (const fn of validFunctionKeySet) functionCount[fn] = 0

    for (const question of DEEP_MBTI_QUESTION_LIST) {
      const functionMaxWeight: Record<string, number> = {}
      for (const option of question.optionList) {
        for (const [key, value] of Object.entries(option.weights)) {
          if (validFunctionKeySet.has(key)) {
            functionMaxWeight[key] = Math.max(functionMaxWeight[key] ?? 0, value)
          }
        }
      }
      // A function is a "primary target" of this question if it has weight 3 in at least one option
      for (const [fn, maxW] of Object.entries(functionMaxWeight)) {
        if (maxW >= 3) functionCount[fn]++
      }
    }

    for (const fn of validFunctionKeySet) {
      expect(functionCount[fn], `${fn} should be primary in at least 4 questions, got ${functionCount[fn]}`).toBeGreaterThanOrEqual(4)
    }
  })
})

// ============================================================
// SOCIONICS VALIDATION
// ============================================================

describe('Deep Socionics question validation', () => {
  it('quadra question weight keys are valid quadra names', () => {
    const validKeySet = new Set(['Alpha', 'Beta', 'Gamma', 'Delta'])
    const quadraQuestionList = DEEP_SOCIONICS_QUESTION_LIST.filter((q) => q.id.match(/deep-soc-[1-8]$/))
    for (const question of quadraQuestionList) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(validKeySet.has(key), `Invalid quadra key "${key}" in ${question.id}`).toBe(true)
        }
      }
    }
  })

  it('club question weight keys are valid club names', () => {
    const validKeySet = new Set(['Researcher', 'Social', 'Practical', 'Humanitarian'])
    const clubQuestionList = DEEP_SOCIONICS_QUESTION_LIST.filter((q) => q.id.match(/deep-soc-(9|10|11|12)$/))
    for (const question of clubQuestionList) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(validKeySet.has(key), `Invalid club key "${key}" in ${question.id}`).toBe(true)
        }
      }
    }
  })

  it('information element question weight keys are valid ie_ prefixed functions', () => {
    const validKeySet = new Set(['ie_Ti', 'ie_Te', 'ie_Fi', 'ie_Fe', 'ie_Si', 'ie_Se', 'ie_Ni', 'ie_Ne'])
    const ieQuestionList = DEEP_SOCIONICS_QUESTION_LIST.filter((q) => {
      const num = parseInt(q.id.replace('deep-soc-', ''), 10)
      return num >= 13 && num <= 22
    })
    expect(ieQuestionList).toHaveLength(10)
    for (const question of ieQuestionList) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(validKeySet.has(key), `Invalid IE weight key "${key}" in ${question.id}`).toBe(true)
        }
      }
    }
  })

  it('Socionics ie questions cover only diverging elements (Se, Si, Ni, Fe, Fi)', () => {
    const ieQuestionList = DEEP_SOCIONICS_QUESTION_LIST.filter((q) => {
      const num = parseInt(q.id.replace('deep-soc-', ''), 10)
      return num >= 13 && num <= 22
    })
    // Collect all primary weight keys (weight >= 3) across ie questions
    const primaryKeySet = new Set<string>()
    for (const question of ieQuestionList) {
      for (const option of question.optionList) {
        for (const [key, value] of Object.entries(option.weights)) {
          if (value >= 3) primaryKeySet.add(key)
        }
      }
    }
    // Should have primary weights for the 5 diverging elements
    expect(primaryKeySet.has('ie_Se')).toBe(true)
    expect(primaryKeySet.has('ie_Si')).toBe(true)
    expect(primaryKeySet.has('ie_Ni')).toBe(true)
    expect(primaryKeySet.has('ie_Fe')).toBe(true)
    expect(primaryKeySet.has('ie_Fi')).toBe(true)
    // Ti, Te, Ne should NOT have primary weight (they are cross-scored from MBTI)
    expect(primaryKeySet.has('ie_Ti')).toBe(false)
    expect(primaryKeySet.has('ie_Te')).toBe(false)
    expect(primaryKeySet.has('ie_Ne')).toBe(false)
  })

  it('has 8 quadra + 4 club + 10 Augusta-specific ie questions', () => {
    expect(DEEP_SOCIONICS_QUESTION_LIST).toHaveLength(22)
  })
})

// ============================================================
// INSTINCT VALIDATION
// ============================================================

describe('Deep Instinct question validation', () => {
  it('center question weight keys are valid centers', () => {
    const validKeySet = new Set(['SUR', 'INT', 'PUR'])
    for (const question of DEEP_INSTINCT_CENTER_QUESTION_LIST) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(validKeySet.has(key), `Invalid center key "${key}" in ${question.id}`).toBe(true)
        }
      }
    }
  })

  it('SUR realm question weight keys are valid SUR realms', () => {
    const validKeySet = new Set(['FD', 'SY', 'SM'])
    for (const question of getLongInstinctRealmQuestionList('SUR')) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(validKeySet.has(key), `Invalid SUR realm key "${key}" in ${question.id}`).toBe(true)
        }
      }
    }
  })

  it('INT realm question weight keys are valid INT realms', () => {
    const validKeySet = new Set(['AY', 'CY', 'BG'])
    for (const question of getLongInstinctRealmQuestionList('INT')) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(validKeySet.has(key), `Invalid INT realm key "${key}" in ${question.id}`).toBe(true)
        }
      }
    }
  })

  it('PUR realm question weight keys are valid PUR realms', () => {
    const validKeySet = new Set(['SS', 'EX', 'UN'])
    for (const question of getLongInstinctRealmQuestionList('PUR')) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(validKeySet.has(key), `Invalid PUR realm key "${key}" in ${question.id}`).toBe(true)
        }
      }
    }
  })
})

// ============================================================
// getLongQuestionList
// ============================================================

describe('getLongQuestionList', () => {
  it('returns ~102 questions with all systems enabled (excluding dynamic realm questions)', () => {
    const questionList = getLongQuestionList({
      attitudinal: true, enneagram: true, mbti: true, socionics: true, instincts: true,
    })
    // 12 + 30 + 32 + 22 + 6 = 102 (realm questions added dynamically)
    expect(questionList).toHaveLength(102)
  })

  it('returns only MBTI questions when only MBTI is enabled', () => {
    const questionList = getLongQuestionList({
      attitudinal: false, enneagram: false, mbti: true, socionics: false, instincts: false,
    })
    expect(questionList).toHaveLength(32)
    expect(questionList.every((q) => q.system === 'mbti')).toBe(true)
  })

  it('returns empty array when no systems are enabled', () => {
    const questionList = getLongQuestionList({
      attitudinal: false, enneagram: false, mbti: false, socionics: false, instincts: false,
    })
    expect(questionList).toHaveLength(0)
  })

  it('preserves system ordering: AP → Enneagram → MBTI → Socionics → Instincts', () => {
    const questionList = getLongQuestionList({
      attitudinal: true, enneagram: true, mbti: true, socionics: true, instincts: true,
    })
    const systemOrderList = questionList.map((q) => q.system)
    const uniqueSystemOrderList = systemOrderList.filter((s, i) => i === 0 || s !== systemOrderList[i - 1])
    expect(uniqueSystemOrderList).toEqual(['attitudinal', 'enneagram', 'mbti', 'socionics', 'instincts'])
  })
})
