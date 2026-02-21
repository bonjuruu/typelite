import type { QuizQuestion, QuizAnswerMap } from "../../../data/quiz/types.ts";
import type { ScoreBreakdown, ScoreEntry } from "../../../types/quiz.ts";
import {
  accumulateScoreMap,
  buildQuestionInfluenceList,
  ASPECT_LIST,
} from "../shared.ts";

export { scoreAttitudinal as scoreAttitudinalDeep } from "../scorers/attitudinal.ts";

// ============================================================
// DEEP EXPLAIN — AP (unique: different threshold + label format)
// ============================================================

export function explainAttitudinalDeep(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): ScoreBreakdown {
  const winCount = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(ASPECT_LIST),
  );
  const answeredCount = questionList.filter(
    (q) => answerMap[q.id] !== undefined,
  ).length;

  const sorted = [...ASPECT_LIST].sort((a, b) => winCount[b] - winCount[a]);
  const winnerMargin = winCount[sorted[0]] - winCount[sorted[1]];
  const axisLeanSummary = [
    `${sorted[0]} scored ${winCount[sorted[0]]} (1st), ${sorted[1]} scored ${winCount[sorted[1]]} (2nd).`,
  ];
  if (winnerMargin >= 4) {
    axisLeanSummary.push(`Clear ${sorted[0]} dominance.`);
  }

  const scoreDetail = sorted.map((a) => `${a}: ${winCount[a]}`);

  const scoreEntryList: ScoreEntry[] = sorted.map((a) => ({
    label: a,
    score: winCount[a],
    maxPossible: answeredCount,
  }));

  const questionInfluenceList = buildQuestionInfluenceList(
    answerMap,
    questionList,
    new Set(ASPECT_LIST as readonly string[]),
  );

  return {
    axisLeanSummary,
    scoreDetail,
    scoreEntryList,
    winnerMargin,
    questionInfluenceList,
  };
}
