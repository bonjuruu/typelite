import type { APType } from "../../types/index.ts";
import type { QuizQuestion, QuizAnswerMap } from "../../../data/quiz/types.ts";
import type { ScoreBreakdown, ScoreEntry } from "../../../types/quiz.ts";
import {
  accumulateScoreMap,
  buildQuestionInfluenceList,
  ASPECT_LIST,
  ASPECT_PRIORITY,
} from "../shared.ts";
import type { Aspect } from "../shared.ts";

// ============================================================
// ATTITUDINAL PSYCHE — Pairwise Comparison
// ============================================================

/**
 * Score AP type from pairwise comparison questions.
 * Each option's weights should have a single key (V, L, E, or F) with value 1,
 * indicating which aspect wins that comparison.
 */
export function scoreAttitudinal(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): APType {
  const winCount = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(ASPECT_LIST),
  );

  const sorted = [...ASPECT_LIST].sort((a, b) => {
    const winDiff = winCount[b] - winCount[a];
    if (winDiff !== 0) return winDiff;
    return ASPECT_PRIORITY[b] - ASPECT_PRIORITY[a];
  });

  return sorted.join("") as APType;
}

/** Explain AP scoring: show aspect win counts. */
export function explainAttitudinal(
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
  const sorted = ([...ASPECT_LIST] as Aspect[]).sort(
    (a, b) => winCount[b] - winCount[a],
  );
  const winnerMargin = winCount[sorted[0]] - winCount[sorted[1]];

  const axisLeanSummary = [
    `${sorted[0]} won ${winCount[sorted[0]]} comparisons (1st), ${sorted[1]} won ${winCount[sorted[1]]} (2nd).`,
  ];
  if (winnerMargin >= 3) {
    axisLeanSummary.push(`Clear ${sorted[0]} dominance.`);
  }

  const scoreDetail = sorted.map((a) => `${a}: ${winCount[a]} wins`);

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
