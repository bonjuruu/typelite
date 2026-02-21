import type { InstinctCenter, InstinctRealm } from "../../types/index.ts";
import type { QuizQuestion, QuizAnswerMap } from "../../../data/quiz/types.ts";
import type { ScoreBreakdown, ScoreEntry } from "../../../types/quiz.ts";
import { REALMS_BY_CENTER } from "../../../data/instincts/index.ts";
import {
  accumulateScoreMap,
  topKey,
  buildQuestionInfluenceList,
  INSTINCT_CENTER_LIST,
} from "../shared.ts";

// ============================================================
// EXPANDED INSTINCTS — 2-Stage Funnel
// ============================================================

/**
 * Score instinct center from stage-1 questions.
 * Weight keys: 'SUR', 'INT', 'PUR'.
 */
export function scoreInstinctCenter(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): InstinctCenter {
  const centerScore = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(INSTINCT_CENTER_LIST),
  );
  return topKey(centerScore, INSTINCT_CENTER_LIST);
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
  const realmList = REALMS_BY_CENTER[center];
  const realmScore = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(realmList),
  );

  return realmList.reduce((best, realm) =>
    (realmScore[realm] ?? 0) > (realmScore[best] ?? 0) ? realm : best,
  );
}

/**
 * Full instinct scoring: stage 1 (center) + stage 2 (realm).
 */
export function scoreInstincts(
  answerMap: QuizAnswerMap,
  centerQuestionList: QuizQuestion[],
  realmQuestionList: QuizQuestion[],
): InstinctRealm {
  const center = scoreInstinctCenter(answerMap, centerQuestionList);
  return scoreInstinctRealm(answerMap, realmQuestionList, center);
}

/** Explain Instinct scoring: show center + realm scores. */
export function explainInstincts(
  answerMap: QuizAnswerMap,
  centerQuestionList: QuizQuestion[],
  realmQuestionList: QuizQuestion[],
  center: InstinctCenter,
): ScoreBreakdown {
  const centerScore = accumulateScoreMap(
    answerMap,
    centerQuestionList,
    new Set(INSTINCT_CENTER_LIST),
  );

  const realmList = REALMS_BY_CENTER[center];
  const realmScore = accumulateScoreMap(
    answerMap,
    realmQuestionList,
    new Set(realmList),
  );

  const sortedCenterList = INSTINCT_CENTER_LIST.map((c) => ({
    center: c,
    score: centerScore[c],
  })).sort((a, b) => b.score - a.score);

  const sortedRealmList = [...realmList]
    .map((r) => ({ realm: r, score: realmScore[r] ?? 0 }))
    .sort((a, b) => b.score - a.score);

  const centerMargin = sortedCenterList[0].score - sortedCenterList[1].score;
  const centerAnsweredCount = centerQuestionList.filter(
    (q) => answerMap[q.id] !== undefined,
  ).length;
  const realmAnsweredCount = realmQuestionList.filter(
    (q) => answerMap[q.id] !== undefined,
  ).length;

  const axisLeanSummary = [
    `${sortedCenterList[0].center} dominated (${sortedCenterList.map((c) => `${c.center} ${c.score}`).join(", ")}).`,
    `Within ${center}: ${sortedRealmList[0].realm} scored ${sortedRealmList[0].score}, ${sortedRealmList[1]?.realm ?? "—"} scored ${sortedRealmList[1]?.score ?? 0}.`,
  ];

  const scoreDetail = [
    ...sortedCenterList.map((c) => `${c.center}: ${c.score}`),
    ...sortedRealmList.map((r) => `${r.realm}: ${r.score}`),
  ];

  const scoreEntryList: ScoreEntry[] = [
    ...sortedCenterList.map((c) => ({
      label: c.center,
      score: c.score,
      maxPossible: centerAnsweredCount,
    })),
    ...sortedRealmList.map((r) => ({
      label: r.realm,
      score: r.score,
      maxPossible: realmAnsweredCount,
    })),
  ];

  const centerInfluenceList = buildQuestionInfluenceList(
    answerMap,
    centerQuestionList,
    new Set(INSTINCT_CENTER_LIST as readonly string[]),
  );
  const realmInfluenceList = buildQuestionInfluenceList(
    answerMap,
    realmQuestionList,
    new Set(realmList as readonly string[]),
  );
  const questionInfluenceList = [...centerInfluenceList, ...realmInfluenceList];

  return {
    axisLeanSummary,
    scoreDetail,
    scoreEntryList,
    winnerMargin: centerMargin,
    questionInfluenceList,
  };
}
