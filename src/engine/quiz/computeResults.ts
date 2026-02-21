import type { SystemId, MBTIType, SocionicsType } from "../types/index.ts";
import type {
  QuizQuestion,
  QuizAnswerMap,
  QuizResult,
  ScoreBreakdown,
} from "../../types/quiz.ts";
import {
  scoreAttitudinal,
  scoreEnneagram,
  scoreMBTI,
  scoreSocionics,
  scoreInstinctCenter,
  scoreInstinctRealm,
  explainAttitudinal,
  explainEnneagram,
  explainMBTI,
  explainSocionics,
  explainInstincts,
} from "./scorers/index.ts";
import {
  scoreAttitudinalDeep,
  scoreEnneagramDeep,
  scoreMBTIDeep,
  scoreSocionicsDeep,
  scoreInstinctCenterDeep,
  scoreInstinctRealmDeep,
  explainAttitudinalDeep,
  explainEnneagramDeep,
  explainMBTIDeep,
  explainSocionicsDeep,
  explainInstinctsDeep,
} from "./deepScorers/index.ts";

// ============================================================
// SCORER KIT
// ============================================================

export interface QuizScorerKit {
  scoreAttitudinal: typeof scoreAttitudinal;
  scoreEnneagram: typeof scoreEnneagram;
  scoreMBTI: (
    answerMap: QuizAnswerMap,
    questionList: QuizQuestion[],
  ) => { type: MBTIType; functionScoreMap?: Record<string, number> };
  scoreSocionics?: (
    answerMap: QuizAnswerMap,
    socQuestionList: QuizQuestion[],
    extraQuestionList: QuizQuestion[],
  ) => SocionicsType;
  scoreInstinctCenter: typeof scoreInstinctCenter;
  scoreInstinctRealm: typeof scoreInstinctRealm;
  explainAttitudinal: typeof explainAttitudinal;
  explainEnneagram: typeof explainEnneagram;
  explainMBTI: (
    answerMap: QuizAnswerMap,
    questionList: QuizQuestion[],
  ) => ScoreBreakdown;
  explainSocionics?: (
    answerMap: QuizAnswerMap,
    socQuestionList: QuizQuestion[],
    extraQuestionList: QuizQuestion[],
  ) => ScoreBreakdown;
  explainInstincts: typeof explainInstincts;
  /** Whether socionics needs MBTI questions cross-fed (deep mode) vs the MBTI result string (quick mode). */
  socionicsCrossFeed: boolean;
  /** Whether MBTI scoring produces a functionScoreMap for deepDetail. */
  mbtiDeepDetail: boolean;
}

export const quickScorerKit: QuizScorerKit = {
  scoreAttitudinal,
  scoreEnneagram,
  scoreMBTI: (answerMap, questionList) => ({
    type: scoreMBTI(answerMap, questionList),
  }),
  scoreInstinctCenter,
  scoreInstinctRealm,
  explainAttitudinal,
  explainEnneagram,
  explainMBTI: (answerMap, questionList) =>
    explainMBTI(answerMap, questionList),
  explainInstincts,
  socionicsCrossFeed: false,
  mbtiDeepDetail: false,
};

export const deepScorerKit: QuizScorerKit = {
  scoreAttitudinal: scoreAttitudinalDeep,
  scoreEnneagram: scoreEnneagramDeep,
  scoreMBTI: (answerMap, questionList) =>
    scoreMBTIDeep(answerMap, questionList),
  scoreSocionics: scoreSocionicsDeep,
  scoreInstinctCenter: scoreInstinctCenterDeep,
  scoreInstinctRealm: scoreInstinctRealmDeep,
  explainAttitudinal: explainAttitudinalDeep,
  explainEnneagram: explainEnneagramDeep,
  explainMBTI: explainMBTIDeep,
  explainSocionics: explainSocionicsDeep,
  explainInstincts: explainInstinctsDeep,
  socionicsCrossFeed: true,
  mbtiDeepDetail: true,
};

// ============================================================
// RESULT COMPUTATION
// ============================================================

export function computeQuizResults(
  answerMap: QuizAnswerMap,
  enabledSystems: Record<SystemId, boolean>,
  baseQuestionList: QuizQuestion[],
  realmQuestionList: QuizQuestion[],
  kit: QuizScorerKit,
): QuizResult {
  const result: QuizResult = {
    attitudinal: null,
    enneagramType: null,
    enneagramWing: null,
    enneagramInstinct: null,
    mbti: null,
    socionics: null,
    instinctRealm: null,
  };

  const explanationMap: Partial<Record<SystemId, ScoreBreakdown>> = {};

  if (enabledSystems.attitudinal) {
    const apQuestionList = baseQuestionList.filter(
      (q) => q.system === "attitudinal",
    );
    result.attitudinal = kit.scoreAttitudinal(answerMap, apQuestionList);
    explanationMap.attitudinal = kit.explainAttitudinal(
      answerMap,
      apQuestionList,
    );
  }

  if (enabledSystems.enneagram) {
    const ennQuestionList = baseQuestionList.filter(
      (q) => q.system === "enneagram",
    );
    const ennResult = kit.scoreEnneagram(answerMap, ennQuestionList);
    result.enneagramType = ennResult.type;
    result.enneagramWing = ennResult.wing;
    result.enneagramInstinct = ennResult.instinct;
    explanationMap.enneagram = kit.explainEnneagram(answerMap, ennQuestionList);
  }

  if (enabledSystems.mbti) {
    const mbtiQuestionList = baseQuestionList.filter(
      (q) => q.system === "mbti",
    );
    const mbtiResult = kit.scoreMBTI(answerMap, mbtiQuestionList);
    result.mbti = mbtiResult.type;
    if (kit.mbtiDeepDetail && mbtiResult.functionScoreMap) {
      result.deepDetail = {
        cognitiveFunctionScoreMap: mbtiResult.functionScoreMap,
      };
    }
    explanationMap.mbti = kit.explainMBTI(answerMap, mbtiQuestionList);
  }

  if (enabledSystems.socionics) {
    const socQuestionList = baseQuestionList.filter(
      (q) => q.system === "socionics",
    );
    if (kit.socionicsCrossFeed && kit.scoreSocionics && kit.explainSocionics) {
      // Deep mode: cross-score from MBTI questions
      const mbtiQuestionList = enabledSystems.mbti
        ? baseQuestionList.filter((q) => q.system === "mbti")
        : [];
      result.socionics = kit.scoreSocionics(
        answerMap,
        socQuestionList,
        mbtiQuestionList,
      );
      explanationMap.socionics = kit.explainSocionics(
        answerMap,
        socQuestionList,
        mbtiQuestionList,
      );
    } else if (result.mbti) {
      // Quick mode: derive from MBTI result
      result.socionics = scoreSocionics(
        answerMap,
        socQuestionList,
        result.mbti,
      );
      explanationMap.socionics = explainSocionics(
        answerMap,
        socQuestionList,
        result.mbti,
      );
    }
  }

  if (enabledSystems.instincts) {
    const centerQuestionList = baseQuestionList.filter(
      (q) => q.system === "instincts",
    );
    const center = kit.scoreInstinctCenter(answerMap, centerQuestionList);
    result.instinctRealm = kit.scoreInstinctRealm(
      answerMap,
      realmQuestionList,
      center,
    );
    explanationMap.instincts = kit.explainInstincts(
      answerMap,
      centerQuestionList,
      realmQuestionList,
      center,
    );
  }

  result.explanationMap = explanationMap;
  return result;
}
