import type { QuizQuestion, QuizAnswerMap } from "../../data/quiz/types.ts";
import type { ScoreContribution, QuestionInfluence } from "../../types/quiz.ts";

// ============================================================
// GENERIC HELPERS
// ============================================================

/** Accumulate weighted scores from answered questions. */
export function accumulateScoreMap<K extends string>(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  validKeySet: Set<K>,
): Record<K, number> {
  const scoreMap = {} as Record<K, number>;
  for (const key of validKeySet) scoreMap[key] = 0;

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id];
    if (selectedIndex === undefined) continue;
    const option = question.optionList[selectedIndex];
    for (const [key, value] of Object.entries(option.weights)) {
      if (validKeySet.has(key as K)) {
        scoreMap[key as K] += value;
      }
    }
  }

  return scoreMap;
}

/** Get the key with the highest score. */
export function topKey<K extends string>(
  scoreMap: Record<K, number>,
  keyList: readonly K[],
): K {
  return keyList.reduce((best, key) =>
    scoreMap[key] > scoreMap[best] ? key : best,
  );
}

// ============================================================
// QUESTION INFLUENCE BUILDER
// ============================================================

/** Build questionInfluenceList from answered questions, filtering weights by a valid key set. */
export function buildQuestionInfluenceList(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  validKeySet: Set<string>,
): QuestionInfluence[] {
  const influenceList: QuestionInfluence[] = [];

  for (const question of questionList) {
    const selectedIndex = answerMap[question.id];
    if (selectedIndex === undefined) continue;
    const option = question.optionList[selectedIndex];

    const contributionList: ScoreContribution[] = [];
    for (const [key, value] of Object.entries(option.weights)) {
      if (validKeySet.has(key)) {
        contributionList.push({ target: key, points: value });
      }
    }

    if (contributionList.length > 0) {
      influenceList.push({
        questionId: question.id,
        questionPrompt: question.prompt,
        selectedOptionLabel: option.label,
        contributionList,
      });
    }
  }

  return influenceList;
}

// ============================================================
// SHARED CONSTANTS
// ============================================================

export type Aspect = "V" | "L" | "E" | "F";

export const ASPECT_LIST: readonly Aspect[] = ["V", "L", "E", "F"] as const;

/** Tie-breaking priority: V > L > E > F */
export const ASPECT_PRIORITY: Record<Aspect, number> = {
  V: 4,
  L: 3,
  E: 2,
  F: 1,
};

export const ENNEAGRAM_NUMBER_LIST: readonly (
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export const ENNEAGRAM_INSTINCT_KEY_LIST: readonly ("sp" | "so" | "sx")[] = [
  "sp",
  "so",
  "sx",
] as const;

export const INSTINCT_CENTER_LIST: readonly ("SUR" | "INT" | "PUR")[] = [
  "SUR",
  "INT",
  "PUR",
] as const;
