import type { EnneagramInstinct } from "../../types/index.ts";
import type { QuizQuestion, QuizAnswerMap } from "../../../data/quiz/types.ts";
import type { ScoreBreakdown, ScoreEntry } from "../../../types/quiz.ts";
import { getWings, getEnneagramType } from "../../../data/enneagram/index.ts";
import {
  accumulateScoreMap,
  topKey,
  buildQuestionInfluenceList,
  ENNEAGRAM_NUMBER_LIST,
  ENNEAGRAM_INSTINCT_KEY_LIST,
} from "../shared.ts";

// ============================================================
// ENNEAGRAM - Weighted Accumulator
// ============================================================

/**
 * Score enneagram type, wing, and instinct from weighted accumulator questions.
 * Weight keys: '1'-'9' for type scores, 'sp'/'so'/'sx' for instinct scores.
 */
export function scoreEnneagram(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): {
  type: (typeof ENNEAGRAM_NUMBER_LIST)[number];
  wing: (typeof ENNEAGRAM_NUMBER_LIST)[number];
  instinct: EnneagramInstinct;
} {
  const typeKeyList = ENNEAGRAM_NUMBER_LIST.map(String);
  const typeScore = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(typeKeyList),
  );
  const instinctScore = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(ENNEAGRAM_INSTINCT_KEY_LIST),
  );

  const typeKey = topKey(typeScore, typeKeyList);
  const type = Number(typeKey) as (typeof ENNEAGRAM_NUMBER_LIST)[number];

  const [wingA, wingB] = getWings(type);
  const wing =
    typeScore[String(wingA)] >= typeScore[String(wingB)] ? wingA : wingB;

  const instinct = topKey(instinctScore, ENNEAGRAM_INSTINCT_KEY_LIST);

  return { type, wing, instinct };
}

/** Explain Enneagram scoring: show top-3 type scores + instinct scores. */
export function explainEnneagram(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): ScoreBreakdown {
  const typeKeyList = ENNEAGRAM_NUMBER_LIST.map(String);
  const typeScore = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(typeKeyList),
  );
  const instinctScore = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(ENNEAGRAM_INSTINCT_KEY_LIST),
  );

  const sortedTypeList = ENNEAGRAM_NUMBER_LIST.map((n) => ({
    type: n,
    score: typeScore[String(n)],
    className: getEnneagramType(n).className,
  })).sort((a, b) => b.score - a.score);

  const top3 = sortedTypeList.slice(0, 3);
  const instinctSorted = ENNEAGRAM_INSTINCT_KEY_LIST.map((i) => ({
    instinct: i,
    score: instinctScore[i],
  })).sort((a, b) => b.score - a.score);

  const winnerMargin = sortedTypeList[0].score - sortedTypeList[1].score;

  const axisLeanSummary = [
    `Type ${top3[0].type} scored ${top3[0].score} (${top3[0].className}), Type ${top3[1].type} scored ${top3[1].score} (runner-up).`,
    `${instinctSorted[0].instinct} led with ${instinctSorted[0].score} points.`,
  ];

  const scoreDetail = [
    ...top3.map((t) => `Type ${t.type} (${t.className}): ${t.score}`),
    ...instinctSorted.map((i) => `${i.instinct}: ${i.score}`),
  ];

  const maxPossiblePerType = questionList.reduce((sum, q) => {
    const maxWeight = Math.max(
      0,
      ...Object.entries(q.optionList[0]?.weights ?? {})
        .filter(([k]) => k in typeScore)
        .map(([, v]) => v),
    );
    return sum + maxWeight;
  }, 0);

  const scoreEntryList: ScoreEntry[] = [
    ...sortedTypeList.map((t) => ({
      label: `Type ${t.type}`,
      score: t.score,
      maxPossible: maxPossiblePerType,
    })),
    ...instinctSorted.map((i) => ({
      label: i.instinct,
      score: i.score,
      maxPossible: questionList.length,
    })),
  ];

  const validKeySet = new Set<string>([
    ...ENNEAGRAM_NUMBER_LIST.map(String),
    ...ENNEAGRAM_INSTINCT_KEY_LIST,
  ]);
  const questionInfluenceList = buildQuestionInfluenceList(
    answerMap,
    questionList,
    validKeySet,
  );

  return {
    axisLeanSummary,
    scoreDetail,
    scoreEntryList,
    winnerMargin,
    questionInfluenceList,
  };
}
