import { describe, it, expect } from "vitest";
import {
  computeQuizResults,
  quickScorerKit,
  deepScorerKit,
} from "../computeResults.ts";
import type { SystemId } from "../../types/index.ts";
import type { QuizAnswerMap } from "../../../data/quiz/types.ts";
import {
  AP_QUESTION_LIST,
  ENNEAGRAM_QUESTION_LIST,
  MBTI_QUESTION_LIST,
  SOCIONICS_QUESTION_LIST,
  INSTINCT_CENTER_QUESTION_LIST,
  getInstinctRealmQuestionList,
} from "../../../data/quiz/questions/index.ts";
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
// HELPERS
// ============================================================

function allSystemsEnabled(): Record<SystemId, boolean> {
  return {
    attitudinal: true,
    enneagram: true,
    mbti: true,
    socionics: true,
    instincts: true,
  };
}

function singleSystemEnabled(system: SystemId): Record<SystemId, boolean> {
  return {
    attitudinal: false,
    enneagram: false,
    mbti: false,
    socionics: false,
    instincts: false,
    [system]: true,
  };
}

// ============================================================
// Quick kit
// ============================================================

describe("computeQuizResults - quick kit", () => {
  it("returns non-null results for all 5 systems when all enabled", () => {
    const realmQuestionList = getInstinctRealmQuestionList("SUR");
    const baseQuestionList = [
      ...AP_QUESTION_LIST,
      ...ENNEAGRAM_QUESTION_LIST,
      ...MBTI_QUESTION_LIST,
      ...SOCIONICS_QUESTION_LIST,
      ...INSTINCT_CENTER_QUESTION_LIST,
    ];
    const answerMap: QuizAnswerMap = {
      ...answerAll(baseQuestionList, 0),
      ...answerAll(realmQuestionList, 0),
    };

    const result = computeQuizResults(
      answerMap,
      allSystemsEnabled(),
      baseQuestionList,
      [...realmQuestionList],
      quickScorerKit,
    );

    expect(result.attitudinal).not.toBeNull();
    expect(result.enneagramType).not.toBeNull();
    expect(result.enneagramWing).not.toBeNull();
    expect(result.enneagramInstinct).not.toBeNull();
    expect(result.mbti).not.toBeNull();
    expect(result.socionics).not.toBeNull();
    expect(result.instinctRealm).not.toBeNull();
  });

  it("returns explanationMap with 5 entries when all systems enabled", () => {
    const realmQuestionList = getInstinctRealmQuestionList("SUR");
    const baseQuestionList = [
      ...AP_QUESTION_LIST,
      ...ENNEAGRAM_QUESTION_LIST,
      ...MBTI_QUESTION_LIST,
      ...SOCIONICS_QUESTION_LIST,
      ...INSTINCT_CENTER_QUESTION_LIST,
    ];
    const answerMap: QuizAnswerMap = {
      ...answerAll(baseQuestionList, 0),
      ...answerAll(realmQuestionList, 0),
    };

    const result = computeQuizResults(
      answerMap,
      allSystemsEnabled(),
      baseQuestionList,
      [...realmQuestionList],
      quickScorerKit,
    );

    expect(Object.keys(result.explanationMap!)).toHaveLength(5);
  });

  it("socionics is null in quick mode without MBTI result", () => {
    const baseQuestionList = [
      ...SOCIONICS_QUESTION_LIST,
    ];
    const answerMap = answerAll(baseQuestionList, 0);
    const enabledSystems = {
      attitudinal: false,
      enneagram: false,
      mbti: false,
      socionics: true,
      instincts: false,
    };

    const result = computeQuizResults(
      answerMap,
      enabledSystems,
      baseQuestionList,
      [],
      quickScorerKit,
    );

    expect(result.socionics).toBeNull();
  });
});

// ============================================================
// Deep kit
// ============================================================

describe("computeQuizResults - deep kit", () => {
  it("returns non-null results for all 5 systems when all enabled", () => {
    const realmQuestionList = getLongInstinctRealmQuestionList("SUR");
    const baseQuestionList = [
      ...DEEP_AP_QUESTION_LIST,
      ...DEEP_ENNEAGRAM_QUESTION_LIST,
      ...DEEP_MBTI_QUESTION_LIST,
      ...DEEP_SOCIONICS_QUESTION_LIST,
      ...DEEP_INSTINCT_CENTER_QUESTION_LIST,
    ];
    const answerMap: QuizAnswerMap = {
      ...answerAll(baseQuestionList, 0),
      ...answerAll(realmQuestionList, 0),
    };

    const result = computeQuizResults(
      answerMap,
      allSystemsEnabled(),
      baseQuestionList,
      [...realmQuestionList],
      deepScorerKit,
    );

    expect(result.attitudinal).not.toBeNull();
    expect(result.enneagramType).not.toBeNull();
    expect(result.mbti).not.toBeNull();
    expect(result.socionics).not.toBeNull();
    expect(result.instinctRealm).not.toBeNull();
  });

  it("includes cognitiveFunctionScoreMap in deepDetail", () => {
    const baseQuestionList = [...DEEP_MBTI_QUESTION_LIST];
    const answerMap = answerAll(baseQuestionList, 0);

    const result = computeQuizResults(
      answerMap,
      singleSystemEnabled("mbti"),
      baseQuestionList,
      [],
      deepScorerKit,
    );

    expect(result.deepDetail).toBeDefined();
    expect(result.deepDetail!.cognitiveFunctionScoreMap).toBeDefined();
    expect(
      Object.keys(result.deepDetail!.cognitiveFunctionScoreMap!),
    ).toHaveLength(8);
  });

  it("socionics scored in deep mode even without MBTI enabled", () => {
    const baseQuestionList = [
      ...DEEP_SOCIONICS_QUESTION_LIST,
    ];
    const answerMap = answerAll(baseQuestionList, 0);
    const enabledSystems = {
      attitudinal: false,
      enneagram: false,
      mbti: false,
      socionics: true,
      instincts: false,
    };

    const result = computeQuizResults(
      answerMap,
      enabledSystems,
      baseQuestionList,
      [],
      deepScorerKit,
    );

    expect(result.socionics).not.toBeNull();
  });
});

// ============================================================
// Single system enabled
// ============================================================

describe("computeQuizResults - single system", () => {
  it("only attitudinal is non-null when only attitudinal enabled", () => {
    const baseQuestionList = [...AP_QUESTION_LIST];
    const answerMap = answerAll(baseQuestionList, 0);

    const result = computeQuizResults(
      answerMap,
      singleSystemEnabled("attitudinal"),
      baseQuestionList,
      [],
      quickScorerKit,
    );

    expect(result.attitudinal).not.toBeNull();
    expect(result.enneagramType).toBeNull();
    expect(result.mbti).toBeNull();
    expect(result.socionics).toBeNull();
    expect(result.instinctRealm).toBeNull();
  });

  it("only enneagram is non-null when only enneagram enabled", () => {
    const baseQuestionList = [...ENNEAGRAM_QUESTION_LIST];
    const answerMap = answerAll(baseQuestionList, 0);

    const result = computeQuizResults(
      answerMap,
      singleSystemEnabled("enneagram"),
      baseQuestionList,
      [],
      quickScorerKit,
    );

    expect(result.attitudinal).toBeNull();
    expect(result.enneagramType).not.toBeNull();
    expect(result.mbti).toBeNull();
    expect(result.socionics).toBeNull();
    expect(result.instinctRealm).toBeNull();
  });
});

// ============================================================
// Empty answerMap
// ============================================================

describe("computeQuizResults - empty answerMap", () => {
  it("does not crash with empty answerMap", () => {
    const realmQuestionList = getInstinctRealmQuestionList("SUR");
    const baseQuestionList = [
      ...AP_QUESTION_LIST,
      ...ENNEAGRAM_QUESTION_LIST,
      ...MBTI_QUESTION_LIST,
      ...SOCIONICS_QUESTION_LIST,
      ...INSTINCT_CENTER_QUESTION_LIST,
    ];

    const result = computeQuizResults(
      {},
      allSystemsEnabled(),
      baseQuestionList,
      [...realmQuestionList],
      quickScorerKit,
    );

    expect(result).toBeDefined();
    expect(result.attitudinal).toBeDefined();
    expect(result.mbti).toBeDefined();
  });
});
