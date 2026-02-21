// All quiz types are defined in src/types/quiz.ts
// This file re-exports them for backwards compatibility with data/quiz imports.

export type {
  QuizMode,
  QuizSystemId,
  QuizOption,
  QuizQuestion,
  QuizAnswerMap,
  DeepQuizDetail,
  QuizResult,
  ScoreBreakdown,
  ScoreEntry,
  ScoreContribution,
  QuestionInfluence,
} from "../../types/quiz.ts";
