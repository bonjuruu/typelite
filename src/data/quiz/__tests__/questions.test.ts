import { describe, it, expect } from "vitest";
import {
  AP_QUESTION_LIST,
  ENNEAGRAM_QUESTION_LIST,
  MBTI_QUESTION_LIST,
  SOCIONICS_QUESTION_LIST,
  INSTINCT_CENTER_QUESTION_LIST,
  getInstinctRealmQuestionList,
  getQuestionList,
} from "../questions/index.ts";
import type { QuizQuestion } from "../types.ts";

// ============================================================
// HELPERS
// ============================================================

function allQuestionList(): readonly QuizQuestion[] {
  return [
    ...AP_QUESTION_LIST,
    ...ENNEAGRAM_QUESTION_LIST,
    ...MBTI_QUESTION_LIST,
    ...SOCIONICS_QUESTION_LIST,
    ...INSTINCT_CENTER_QUESTION_LIST,
    ...getInstinctRealmQuestionList("SUR"),
    ...getInstinctRealmQuestionList("INT"),
    ...getInstinctRealmQuestionList("PUR"),
  ];
}

// ============================================================
// QUESTION COUNTS
// ============================================================

describe("Question counts", () => {
  it("AP has exactly 6 questions", () => {
    expect(AP_QUESTION_LIST).toHaveLength(6);
  });

  it("Enneagram has exactly 15 questions", () => {
    expect(ENNEAGRAM_QUESTION_LIST).toHaveLength(15);
  });

  it("MBTI has exactly 12 questions", () => {
    expect(MBTI_QUESTION_LIST).toHaveLength(12);
  });

  it("Socionics has exactly 4 questions", () => {
    expect(SOCIONICS_QUESTION_LIST).toHaveLength(4);
  });

  it("Instinct center has exactly 3 questions", () => {
    expect(INSTINCT_CENTER_QUESTION_LIST).toHaveLength(3);
  });

  it("each instinct center has exactly 5 realm questions", () => {
    expect(getInstinctRealmQuestionList("SUR")).toHaveLength(5);
    expect(getInstinctRealmQuestionList("INT")).toHaveLength(5);
    expect(getInstinctRealmQuestionList("PUR")).toHaveLength(5);
  });
});

// ============================================================
// UNIQUE IDS
// ============================================================

describe("Question ID uniqueness", () => {
  it("every question has a unique ID across all systems", () => {
    const questionList = allQuestionList();
    const idSet = new Set(questionList.map((q) => q.id));
    expect(idSet.size).toBe(questionList.length);
  });
});

// ============================================================
// OPTION VALIDATION
// ============================================================

describe("Option validation", () => {
  it("every question has at least 2 options", () => {
    for (const question of allQuestionList()) {
      expect(
        question.optionList.length,
        `Question ${question.id} has fewer than 2 options`,
      ).toBeGreaterThanOrEqual(2);
    }
  });

  it("every option has a non-empty label", () => {
    for (const question of allQuestionList()) {
      for (const option of question.optionList) {
        expect(
          option.label.trim().length,
          `Option in ${question.id} has empty label`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("every option has non-empty weights", () => {
    for (const question of allQuestionList()) {
      for (const option of question.optionList) {
        expect(
          Object.keys(option.weights).length,
          `Option "${option.label}" in ${question.id} has no weights`,
        ).toBeGreaterThan(0);
      }
    }
  });
});

// ============================================================
// AP-SPECIFIC VALIDATION
// ============================================================

describe("AP question validation", () => {
  it("all AP questions have exactly 2 options (pairwise)", () => {
    for (const question of AP_QUESTION_LIST) {
      expect(question.optionList).toHaveLength(2);
    }
  });

  it("AP weight keys are valid aspects (V, L, E, F)", () => {
    const validKeySet = new Set(["V", "L", "E", "F"]);
    for (const question of AP_QUESTION_LIST) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(
            validKeySet.has(key),
            `Invalid AP weight key "${key}" in question ${question.id}`,
          ).toBe(true);
        }
      }
    }
  });

  it("AP questions cover all 6 aspect pairs", () => {
    // Each question should have weights for exactly 2 different aspects (one per option)
    const pairSet = new Set<string>();
    for (const question of AP_QUESTION_LIST) {
      const aspectList = question.optionList
        .map((o) => Object.keys(o.weights)[0])
        .sort();
      pairSet.add(aspectList.join("-"));
    }
    // V-L, E-V, F-V, E-L, F-L, E-F → 6 unique pairs
    expect(pairSet.size).toBe(6);
  });
});

// ============================================================
// ENNEAGRAM-SPECIFIC VALIDATION
// ============================================================

describe("Enneagram question validation", () => {
  it("type weight keys are valid enneagram numbers (1-9)", () => {
    const validTypeKeySet = new Set([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
    ]);
    const validInstinctKeySet = new Set(["sp", "so", "sx"]);

    for (const question of ENNEAGRAM_QUESTION_LIST) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(
            validTypeKeySet.has(key) || validInstinctKeySet.has(key),
            `Invalid enneagram weight key "${key}" in question ${question.id}`,
          ).toBe(true);
        }
      }
    }
  });

  it("has at least 3 instinct-specific questions", () => {
    const instinctQuestionList = ENNEAGRAM_QUESTION_LIST.filter((q) => {
      return q.optionList.some((o) =>
        Object.keys(o.weights).some((k) => ["sp", "so", "sx"].includes(k)),
      );
    });
    expect(instinctQuestionList.length).toBeGreaterThanOrEqual(3);
  });
});

// ============================================================
// MBTI-SPECIFIC VALIDATION
// ============================================================

describe("MBTI question validation", () => {
  it("weight keys are valid axis identifiers", () => {
    const validKeySet = new Set(["EI", "SN", "TF", "JP"]);
    for (const question of MBTI_QUESTION_LIST) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(
            validKeySet.has(key),
            `Invalid MBTI weight key "${key}" in question ${question.id}`,
          ).toBe(true);
        }
      }
    }
  });

  it("has exactly 3 questions per axis", () => {
    const axisCounts: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };
    for (const question of MBTI_QUESTION_LIST) {
      const axisKeySet = new Set<string>();
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          axisKeySet.add(key);
        }
      }
      for (const axis of axisKeySet) {
        axisCounts[axis]++;
      }
    }
    expect(axisCounts.EI).toBe(3);
    expect(axisCounts.SN).toBe(3);
    expect(axisCounts.TF).toBe(3);
    expect(axisCounts.JP).toBe(3);
  });
});

// ============================================================
// SOCIONICS-SPECIFIC VALIDATION
// ============================================================

describe("Socionics question validation", () => {
  it("weight keys are valid quadra names", () => {
    const validKeySet = new Set(["Alpha", "Beta", "Gamma", "Delta"]);
    for (const question of SOCIONICS_QUESTION_LIST) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(
            validKeySet.has(key),
            `Invalid socionics weight key "${key}" in question ${question.id}`,
          ).toBe(true);
        }
      }
    }
  });

  it("each question has exactly 4 options (one per quadra)", () => {
    for (const question of SOCIONICS_QUESTION_LIST) {
      expect(question.optionList).toHaveLength(4);
    }
  });
});

// ============================================================
// INSTINCT-SPECIFIC VALIDATION
// ============================================================

describe("Instinct question validation", () => {
  it("center question weight keys are valid centers", () => {
    const validKeySet = new Set(["SUR", "INT", "PUR"]);
    for (const question of INSTINCT_CENTER_QUESTION_LIST) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(
            validKeySet.has(key),
            `Invalid center weight key "${key}" in question ${question.id}`,
          ).toBe(true);
        }
      }
    }
  });

  it("SUR realm question weight keys are valid SUR realms", () => {
    const validKeySet = new Set(["FD", "SY", "SM"]);
    for (const question of getInstinctRealmQuestionList("SUR")) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(
            validKeySet.has(key),
            `Invalid SUR realm weight key "${key}" in question ${question.id}`,
          ).toBe(true);
        }
      }
    }
  });

  it("INT realm question weight keys are valid INT realms", () => {
    const validKeySet = new Set(["AY", "CY", "BG"]);
    for (const question of getInstinctRealmQuestionList("INT")) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(
            validKeySet.has(key),
            `Invalid INT realm weight key "${key}" in question ${question.id}`,
          ).toBe(true);
        }
      }
    }
  });

  it("PUR realm question weight keys are valid PUR realms", () => {
    const validKeySet = new Set(["SS", "EX", "UN"]);
    for (const question of getInstinctRealmQuestionList("PUR")) {
      for (const option of question.optionList) {
        for (const key of Object.keys(option.weights)) {
          expect(
            validKeySet.has(key),
            `Invalid PUR realm weight key "${key}" in question ${question.id}`,
          ).toBe(true);
        }
      }
    }
  });
});

// ============================================================
// getQuestionList
// ============================================================

describe("getQuestionList", () => {
  it("returns ~40 questions with all systems enabled (excluding realm questions)", () => {
    const questionList = getQuestionList({
      attitudinal: true,
      enneagram: true,
      mbti: true,
      socionics: true,
      instincts: true,
    });
    // 6 + 15 + 12 + 4 + 3 = 40 (realm questions added dynamically)
    expect(questionList).toHaveLength(40);
  });

  it("returns only MBTI questions when only MBTI is enabled", () => {
    const questionList = getQuestionList({
      attitudinal: false,
      enneagram: false,
      mbti: true,
      socionics: false,
      instincts: false,
    });
    expect(questionList).toHaveLength(12);
    expect(questionList.every((q) => q.system === "mbti")).toBe(true);
  });

  it("returns empty array when no systems are enabled", () => {
    const questionList = getQuestionList({
      attitudinal: false,
      enneagram: false,
      mbti: false,
      socionics: false,
      instincts: false,
    });
    expect(questionList).toHaveLength(0);
  });

  it("preserves system ordering: AP → Enneagram → MBTI → Socionics → Instincts", () => {
    const questionList = getQuestionList({
      attitudinal: true,
      enneagram: true,
      mbti: true,
      socionics: true,
      instincts: true,
    });

    const systemOrderList = questionList.map((q) => q.system);
    const uniqueSystemOrderList = systemOrderList.filter(
      (s, i) => i === 0 || s !== systemOrderList[i - 1],
    );
    expect(uniqueSystemOrderList).toEqual([
      "attitudinal",
      "enneagram",
      "mbti",
      "socionics",
      "instincts",
    ]);
  });
});
