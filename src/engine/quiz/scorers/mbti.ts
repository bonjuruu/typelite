import type { MBTIType } from "../../types/index.ts";
import type { QuizQuestion, QuizAnswerMap } from "../../../data/quiz/types.ts";
import type { ScoreBreakdown, ScoreEntry } from "../../../types/quiz.ts";
import {
  accumulateScoreMap,
  buildQuestionInfluenceList,
} from "../shared.ts";

// ============================================================
// MBTI — 4-Axis Binary Scoring
// ============================================================

type MBTIAxis = "EI" | "SN" | "TF" | "JP";

const MBTI_AXIS_LIST: readonly MBTIAxis[] = ["EI", "SN", "TF", "JP"] as const;

/**
 * Score MBTI type from 4-axis questions (3 per axis).
 * Weight keys: 'EI', 'SN', 'TF', 'JP'. Positive leans toward first letter (E, S, T, J),
 * negative leans toward second letter (I, N, F, P). Zero defaults to second letter.
 */
export function scoreMBTI(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): MBTIType {
  const axisScore = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(MBTI_AXIS_LIST),
  );

  const letterList = MBTI_AXIS_LIST.map((axis) => {
    const score = axisScore[axis];
    switch (axis) {
      case "EI":
        return score > 0 ? "E" : "I";
      case "SN":
        return score > 0 ? "S" : "N";
      case "TF":
        return score > 0 ? "T" : "F";
      case "JP":
        return score > 0 ? "J" : "P";
    }
  });

  return letterList.join("") as MBTIType;
}

/** Explain MBTI scoring: show axis scores with lean direction. */
export function explainMBTI(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): ScoreBreakdown {
  const axisScore = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(MBTI_AXIS_LIST),
  );

  const leanDescription = (axis: MBTIAxis, score: number): string => {
    const abs = Math.abs(score);
    const strength = abs >= 4 ? "Strong" : abs >= 2 ? "Moderate" : "Slight";
    const letterMap: Record<MBTIAxis, [string, string]> = {
      EI: ["E", "I"],
      SN: ["S", "N"],
      TF: ["T", "F"],
      JP: ["J", "P"],
    };
    const [pos, neg] = letterMap[axis];
    const direction = score > 0 ? pos : score < 0 ? neg : neg;
    return `${strength} ${direction} preference (${axis}: ${score > 0 ? "+" : ""}${score})`;
  };

  const questionsPerAxis: Record<MBTIAxis, number> = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };
  for (const question of questionList) {
    for (const [key] of Object.entries(question.optionList[0]?.weights ?? {})) {
      if (key in questionsPerAxis) questionsPerAxis[key as MBTIAxis]++;
    }
  }

  const axisLeanSummary = MBTI_AXIS_LIST.map(
    (axis) => leanDescription(axis, axisScore[axis]) + ".",
  );
  const scoreDetail = MBTI_AXIS_LIST.map(
    (axis) => `${axis}: ${axisScore[axis]}`,
  );

  const scoreEntryList: ScoreEntry[] = MBTI_AXIS_LIST.map((axis) => ({
    label: axis,
    score: Math.abs(axisScore[axis]),
    maxPossible: questionsPerAxis[axis],
  }));

  const questionInfluenceList = buildQuestionInfluenceList(
    answerMap,
    questionList,
    new Set(MBTI_AXIS_LIST as readonly string[]),
  );

  return {
    axisLeanSummary,
    scoreDetail,
    scoreEntryList,
    questionInfluenceList,
  };
}
