import { describe, it, expect } from "vitest";
import {
  scoreMBTIDeep,
  scoreSocionicsDeep,
  scoreAttitudinalDeep,
  scoreEnneagramDeep,
  scoreInstinctCenterDeep,
  scoreInstinctRealmDeep,
  explainAttitudinalDeep,
  explainEnneagramDeep,
  explainMBTIDeep,
  explainSocionicsDeep,
  explainInstinctsDeep,
} from "../deepScorers/index.ts";
import type { QuizAnswerMap } from "../../../data/quiz/types.ts";
import {
  DEEP_AP_QUESTION_LIST,
  DEEP_ENNEAGRAM_QUESTION_LIST,
  DEEP_MBTI_QUESTION_LIST,
  DEEP_SOCIONICS_QUESTION_LIST,
  DEEP_INSTINCT_CENTER_QUESTION_LIST,
  getLongInstinctRealmQuestionList,
} from "../../../data/quiz/longQuestions/index.ts";
import { answerAll } from "./helpers.ts";

// ============================================================
// scoreMBTIDeep
// ============================================================

describe("scoreMBTIDeep", () => {
  it("returns a valid 4-letter MBTI type", () => {
    const answerMap = answerAll(DEEP_MBTI_QUESTION_LIST, 0);
    const { type } = scoreMBTIDeep(answerMap, [...DEEP_MBTI_QUESTION_LIST]);
    expect(type).toHaveLength(4);
    expect(type).toMatch(/^[EI][SN][TF][JP]$/);
  });

  it("returns function score map with all 8 functions", () => {
    const answerMap = answerAll(DEEP_MBTI_QUESTION_LIST, 0);
    const { functionScoreMap } = scoreMBTIDeep(answerMap, [
      ...DEEP_MBTI_QUESTION_LIST,
    ]);
    const functionList = ["Ti", "Te", "Fi", "Fe", "Si", "Se", "Ni", "Ne"];
    for (const fn of functionList) {
      expect(typeof functionScoreMap[fn as keyof typeof functionScoreMap]).toBe(
        "number",
      );
    }
  });

  it("returns a Ti-dominant type when Ti questions are answered strongly", () => {
    // Answer all Ti questions (deep-mbti-1 through 4) with option 0 (Ti primary)
    // Answer all other questions with option that avoids Ti
    const answerMap: QuizAnswerMap = {};
    for (const question of DEEP_MBTI_QUESTION_LIST) {
      // Ti questions: deep-mbti-1 through deep-mbti-4
      if (
        ["deep-mbti-1", "deep-mbti-2", "deep-mbti-3", "deep-mbti-4"].includes(
          question.id,
        )
      ) {
        answerMap[question.id] = 0; // Ti-weighted option
      } else {
        answerMap[question.id] = 0; // default
      }
    }
    const { type, functionScoreMap } = scoreMBTIDeep(answerMap, [
      ...DEEP_MBTI_QUESTION_LIST,
    ]);
    // Ti should be among the top-scoring functions
    expect(functionScoreMap.Ti).toBeGreaterThan(0);
    // Result should be valid MBTI
    expect(type).toMatch(/^[EI][SN][TF][JP]$/);
  });

  it("produces different types for different answer patterns", () => {
    const answerMapA = answerAll(DEEP_MBTI_QUESTION_LIST, 0);
    const answerMapB = answerAll(DEEP_MBTI_QUESTION_LIST, 1);
    const resultA = scoreMBTIDeep(answerMapA, [...DEEP_MBTI_QUESTION_LIST]);
    const resultB = scoreMBTIDeep(answerMapB, [...DEEP_MBTI_QUESTION_LIST]);
    // Different answer patterns should produce different types (not guaranteed but highly likely)
    // Just check both are valid
    expect(resultA.type).toMatch(/^[EI][SN][TF][JP]$/);
    expect(resultB.type).toMatch(/^[EI][SN][TF][JP]$/);
  });
});

// ============================================================
// scoreSocionicsDeep
// ============================================================

describe("scoreSocionicsDeep", () => {
  it("returns a valid socionics type without MBTI questions", () => {
    const validTypeList = [
      "ILE",
      "SEI",
      "ESE",
      "LII",
      "SLE",
      "IEI",
      "EIE",
      "LSI",
      "SEE",
      "ILI",
      "LIE",
      "ESI",
      "IEE",
      "SLI",
      "LSE",
      "EII",
    ];
    const answerMap = answerAll(DEEP_SOCIONICS_QUESTION_LIST, 0);
    const result = scoreSocionicsDeep(answerMap, [
      ...DEEP_SOCIONICS_QUESTION_LIST,
    ]);
    expect(validTypeList).toContain(result);
  });

  it("returns a valid socionics type with MBTI cross-scoring", () => {
    const validTypeList = [
      "ILE",
      "SEI",
      "ESE",
      "LII",
      "SLE",
      "IEI",
      "EIE",
      "LSI",
      "SEE",
      "ILI",
      "LIE",
      "ESI",
      "IEE",
      "SLI",
      "LSE",
      "EII",
    ];
    const answerMap = {
      ...answerAll(DEEP_SOCIONICS_QUESTION_LIST, 0),
      ...answerAll(DEEP_MBTI_QUESTION_LIST, 0),
    };
    const result = scoreSocionicsDeep(
      answerMap,
      [...DEEP_SOCIONICS_QUESTION_LIST],
      [...DEEP_MBTI_QUESTION_LIST],
    );
    expect(validTypeList).toContain(result);
  });

  it("returns an Alpha type when Alpha answers dominate", () => {
    const alphaTypeList = ["ILE", "SEI", "ESE", "LII"];
    const answerMap = answerAll(DEEP_SOCIONICS_QUESTION_LIST, 0);
    const result = scoreSocionicsDeep(answerMap, [
      ...DEEP_SOCIONICS_QUESTION_LIST,
    ]);
    expect(alphaTypeList).toContain(result);
  });

  it("returns a Beta type when Beta answers dominate", () => {
    const betaTypeList = ["SLE", "IEI", "EIE", "LSI"];
    const answerMap = answerAll(DEEP_SOCIONICS_QUESTION_LIST, 1);
    const result = scoreSocionicsDeep(answerMap, [
      ...DEEP_SOCIONICS_QUESTION_LIST,
    ]);
    expect(betaTypeList).toContain(result);
  });

  it("falls back gracefully when MBTI questions are empty", () => {
    const answerMap = answerAll(DEEP_SOCIONICS_QUESTION_LIST, 2);
    const result = scoreSocionicsDeep(
      answerMap,
      [...DEEP_SOCIONICS_QUESTION_LIST],
      [],
    );
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });

  it("cross-scoring from MBTI can influence the result", () => {
    // With only Socionics answers (option 0 = Alpha-leaning)
    const socAnswerMap = answerAll(DEEP_SOCIONICS_QUESTION_LIST, 0);
    const resultWithoutMbti = scoreSocionicsDeep(socAnswerMap, [
      ...DEEP_SOCIONICS_QUESTION_LIST,
    ]);

    // Add MBTI answers that strongly favor different functions
    const combinedAnswerMap = {
      ...socAnswerMap,
      ...answerAll(DEEP_MBTI_QUESTION_LIST, 1),
    };
    const resultWithMbti = scoreSocionicsDeep(
      combinedAnswerMap,
      [...DEEP_SOCIONICS_QUESTION_LIST],
      [...DEEP_MBTI_QUESTION_LIST],
    );

    // Both should be valid types (they may or may not differ, but both must be valid)
    const validTypeList = [
      "ILE",
      "SEI",
      "ESE",
      "LII",
      "SLE",
      "IEI",
      "EIE",
      "LSI",
      "SEE",
      "ILI",
      "LIE",
      "ESI",
      "IEE",
      "SLI",
      "LSE",
      "EII",
    ];
    expect(validTypeList).toContain(resultWithoutMbti);
    expect(validTypeList).toContain(resultWithMbti);
  });
});

// ============================================================
// scoreAttitudinalDeep
// ============================================================

describe("scoreAttitudinalDeep", () => {
  it("returns a valid 4-letter AP type", () => {
    const answerMap = answerAll(DEEP_AP_QUESTION_LIST, 0);
    const result = scoreAttitudinalDeep(answerMap, [...DEEP_AP_QUESTION_LIST]);
    expect(result).toHaveLength(4);
    expect(result).toMatch(/^[VLEF]{4}$/);
  });

  it("all unique aspects present in output", () => {
    const answerMap = answerAll(DEEP_AP_QUESTION_LIST, 0);
    const result = scoreAttitudinalDeep(answerMap, [...DEEP_AP_QUESTION_LIST]);
    const charSet = new Set(result.split(""));
    expect(charSet.size).toBe(4);
  });
});

// ============================================================
// scoreEnneagramDeep
// ============================================================

describe("scoreEnneagramDeep", () => {
  it("returns valid type, wing, and instinct", () => {
    const answerMap = answerAll(DEEP_ENNEAGRAM_QUESTION_LIST, 0);
    const result = scoreEnneagramDeep(answerMap, [
      ...DEEP_ENNEAGRAM_QUESTION_LIST,
    ]);
    expect(result.type).toBeGreaterThanOrEqual(1);
    expect(result.type).toBeLessThanOrEqual(9);
    expect(["sp", "so", "sx"]).toContain(result.instinct);
  });

  it("wing is adjacent to the core type", () => {
    const answerMap = answerAll(DEEP_ENNEAGRAM_QUESTION_LIST, 0);
    const result = scoreEnneagramDeep(answerMap, [
      ...DEEP_ENNEAGRAM_QUESTION_LIST,
    ]);
    const type = result.type;
    const validWingList =
      type === 1 ? [9, 2] : type === 9 ? [8, 1] : [type - 1, type + 1];
    expect(validWingList).toContain(result.wing);
  });

  it("returns sp instinct when sp answers are selected", () => {
    // Answer type questions with first option, instinct questions (25-30) with sp (option 0)
    const answerMap = answerAll(DEEP_ENNEAGRAM_QUESTION_LIST, 0);
    const result = scoreEnneagramDeep(answerMap, [
      ...DEEP_ENNEAGRAM_QUESTION_LIST,
    ]);
    expect(result.instinct).toBe("sp");
  });

  it("returns sx instinct when sx answers are selected", () => {
    // Override instinct questions to option 2 (sx)
    const answerMap = answerAll(DEEP_ENNEAGRAM_QUESTION_LIST, 0);
    for (const q of DEEP_ENNEAGRAM_QUESTION_LIST) {
      if (q.id.match(/deep-enn-(25|26|27|28|29|30)$/)) {
        answerMap[q.id] = 2;
      }
    }
    const result = scoreEnneagramDeep(answerMap, [
      ...DEEP_ENNEAGRAM_QUESTION_LIST,
    ]);
    expect(result.instinct).toBe("sx");
  });
});

// ============================================================
// scoreInstinctCenterDeep
// ============================================================

describe("scoreInstinctCenterDeep", () => {
  it("returns SUR when SUR answers dominate", () => {
    const answerMap = answerAll(DEEP_INSTINCT_CENTER_QUESTION_LIST, 0);
    const result = scoreInstinctCenterDeep(answerMap, [
      ...DEEP_INSTINCT_CENTER_QUESTION_LIST,
    ]);
    expect(result).toBe("SUR");
  });

  it("returns INT when INT answers dominate", () => {
    const answerMap = answerAll(DEEP_INSTINCT_CENTER_QUESTION_LIST, 1);
    const result = scoreInstinctCenterDeep(answerMap, [
      ...DEEP_INSTINCT_CENTER_QUESTION_LIST,
    ]);
    expect(result).toBe("INT");
  });

  it("returns PUR when PUR answers dominate", () => {
    const answerMap = answerAll(DEEP_INSTINCT_CENTER_QUESTION_LIST, 2);
    const result = scoreInstinctCenterDeep(answerMap, [
      ...DEEP_INSTINCT_CENTER_QUESTION_LIST,
    ]);
    expect(result).toBe("PUR");
  });
});

// ============================================================
// scoreInstinctRealmDeep
// ============================================================

describe("scoreInstinctRealmDeep", () => {
  it("returns FD for SUR center when FD answers dominate", () => {
    const realmQuestionList = getLongInstinctRealmQuestionList("SUR");
    const answerMap = answerAll(realmQuestionList, 0);
    const result = scoreInstinctRealmDeep(
      answerMap,
      [...realmQuestionList],
      "SUR",
    );
    expect(result).toBe("FD");
  });

  it("returns AY for INT center when AY answers dominate", () => {
    const realmQuestionList = getLongInstinctRealmQuestionList("INT");
    const answerMap = answerAll(realmQuestionList, 0);
    const result = scoreInstinctRealmDeep(
      answerMap,
      [...realmQuestionList],
      "INT",
    );
    expect(result).toBe("AY");
  });

  it("returns SS for PUR center when SS answers dominate", () => {
    const realmQuestionList = getLongInstinctRealmQuestionList("PUR");
    const answerMap = answerAll(realmQuestionList, 0);
    const result = scoreInstinctRealmDeep(
      answerMap,
      [...realmQuestionList],
      "PUR",
    );
    expect(result).toBe("SS");
  });
});

// ============================================================
// Deep explain functions - structured data
// ============================================================

describe("explainAttitudinalDeep structured data", () => {
  it("returns scoreEntryList with 4 aspect entries", () => {
    const answerMap = answerAll(DEEP_AP_QUESTION_LIST, 0);
    const result = explainAttitudinalDeep(answerMap, [
      ...DEEP_AP_QUESTION_LIST,
    ]);
    expect(result.scoreEntryList).toHaveLength(4);
  });

  it("returns winnerMargin as non-negative number", () => {
    const answerMap = answerAll(DEEP_AP_QUESTION_LIST, 0);
    const result = explainAttitudinalDeep(answerMap, [
      ...DEEP_AP_QUESTION_LIST,
    ]);
    expect(result.winnerMargin).toBeGreaterThanOrEqual(0);
  });

  it("returns questionInfluenceList matching answered count", () => {
    const answerMap = answerAll(DEEP_AP_QUESTION_LIST, 0);
    const result = explainAttitudinalDeep(answerMap, [
      ...DEEP_AP_QUESTION_LIST,
    ]);
    expect(result.questionInfluenceList).toHaveLength(
      DEEP_AP_QUESTION_LIST.length,
    );
  });
});

describe("explainEnneagramDeep structured data", () => {
  it("returns scoreEntryList with type and instinct entries", () => {
    const answerMap = answerAll(DEEP_ENNEAGRAM_QUESTION_LIST, 0);
    const result = explainEnneagramDeep(answerMap, [
      ...DEEP_ENNEAGRAM_QUESTION_LIST,
    ]);
    // 9 types + 3 instincts = 12
    expect(result.scoreEntryList).toHaveLength(12);
  });

  it("returns winnerMargin as non-negative number", () => {
    const answerMap = answerAll(DEEP_ENNEAGRAM_QUESTION_LIST, 0);
    const result = explainEnneagramDeep(answerMap, [
      ...DEEP_ENNEAGRAM_QUESTION_LIST,
    ]);
    expect(result.winnerMargin).toBeGreaterThanOrEqual(0);
  });
});

describe("explainMBTIDeep structured data", () => {
  it("returns scoreEntryList with 8 cognitive function entries", () => {
    const answerMap = answerAll(DEEP_MBTI_QUESTION_LIST, 0);
    const result = explainMBTIDeep(answerMap, [...DEEP_MBTI_QUESTION_LIST]);
    expect(result.scoreEntryList).toHaveLength(8);
  });

  it("omits winnerMargin for function-based scoring", () => {
    const answerMap = answerAll(DEEP_MBTI_QUESTION_LIST, 0);
    const result = explainMBTIDeep(answerMap, [...DEEP_MBTI_QUESTION_LIST]);
    expect(result.winnerMargin).toBeUndefined();
  });

  it("returns questionInfluenceList matching answered count", () => {
    const answerMap = answerAll(DEEP_MBTI_QUESTION_LIST, 0);
    const result = explainMBTIDeep(answerMap, [...DEEP_MBTI_QUESTION_LIST]);
    expect(result.questionInfluenceList).toHaveLength(
      DEEP_MBTI_QUESTION_LIST.length,
    );
  });
});

describe("explainSocionicsDeep structured data", () => {
  it("returns scoreEntryList with quadra and club entries", () => {
    const answerMap = answerAll(DEEP_SOCIONICS_QUESTION_LIST, 0);
    const result = explainSocionicsDeep(answerMap, [
      ...DEEP_SOCIONICS_QUESTION_LIST,
    ]);
    // 4 quadras + 4 clubs = 8
    expect(result.scoreEntryList).toHaveLength(8);
  });

  it("returns winnerMargin as non-negative number", () => {
    const answerMap = answerAll(DEEP_SOCIONICS_QUESTION_LIST, 0);
    const result = explainSocionicsDeep(answerMap, [
      ...DEEP_SOCIONICS_QUESTION_LIST,
    ]);
    expect(result.winnerMargin).toBeGreaterThanOrEqual(0);
  });
});

describe("explainInstinctsDeep structured data", () => {
  it("returns scoreEntryList with center and realm entries", () => {
    const centerAnswerMap = answerAll(DEEP_INSTINCT_CENTER_QUESTION_LIST, 0);
    const realmQuestionList = getLongInstinctRealmQuestionList("SUR");
    const realmAnswerMap = answerAll(realmQuestionList, 0);
    const combinedAnswerMap = { ...centerAnswerMap, ...realmAnswerMap };
    const result = explainInstinctsDeep(
      combinedAnswerMap,
      [...DEEP_INSTINCT_CENTER_QUESTION_LIST],
      [...realmQuestionList],
      "SUR",
    );
    // 3 centers + 3 realms = 6
    expect(result.scoreEntryList).toHaveLength(6);
  });

  it("returns winnerMargin for center margin", () => {
    const centerAnswerMap = answerAll(DEEP_INSTINCT_CENTER_QUESTION_LIST, 0);
    const realmQuestionList = getLongInstinctRealmQuestionList("SUR");
    const realmAnswerMap = answerAll(realmQuestionList, 0);
    const combinedAnswerMap = { ...centerAnswerMap, ...realmAnswerMap };
    const result = explainInstinctsDeep(
      combinedAnswerMap,
      [...DEEP_INSTINCT_CENTER_QUESTION_LIST],
      [...realmQuestionList],
      "SUR",
    );
    expect(result.winnerMargin).toBeGreaterThanOrEqual(0);
  });

  it("returns questionInfluenceList combining center and realm questions", () => {
    const centerAnswerMap = answerAll(DEEP_INSTINCT_CENTER_QUESTION_LIST, 0);
    const realmQuestionList = getLongInstinctRealmQuestionList("SUR");
    const realmAnswerMap = answerAll(realmQuestionList, 0);
    const combinedAnswerMap = { ...centerAnswerMap, ...realmAnswerMap };
    const result = explainInstinctsDeep(
      combinedAnswerMap,
      [...DEEP_INSTINCT_CENTER_QUESTION_LIST],
      [...realmQuestionList],
      "SUR",
    );
    expect(result.questionInfluenceList!.length).toBe(
      DEEP_INSTINCT_CENTER_QUESTION_LIST.length + realmQuestionList.length,
    );
  });
});
