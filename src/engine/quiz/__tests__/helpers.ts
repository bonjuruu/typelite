import type { QuizQuestion, QuizAnswerMap } from "../../../data/quiz/types.ts";

/** Build an answer map from a question list by selecting option at the given index for each question. */
export function answerAll(
  questionList: readonly QuizQuestion[],
  optionIndex: number,
): QuizAnswerMap {
  const answerMap: QuizAnswerMap = {};
  for (const question of questionList) {
    answerMap[question.id] = Math.min(
      optionIndex,
      question.optionList.length - 1,
    );
  }
  return answerMap;
}

/** Build an answer map by selecting specific options for each question. */
export function answerWith(
  questionList: readonly QuizQuestion[],
  indexList: number[],
): QuizAnswerMap {
  const answerMap: QuizAnswerMap = {};
  for (let i = 0; i < questionList.length; i++) {
    answerMap[questionList[i].id] = indexList[i] ?? 0;
  }
  return answerMap;
}
