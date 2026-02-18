import type {
  SystemId,
  APType,
  MBTIType,
  SocionicsType,
  EnneagramNumber,
  EnneagramInstinct,
  InstinctRealm,
  CognitiveFunction,
} from '../../engine/types.ts'
import type { ScoreBreakdown } from '../../engine/quiz/scorer.ts'

// ============================================================
// QUIZ MODE
// ============================================================

export type QuizMode = 'quick' | 'deep'

// ============================================================
// QUIZ DATA TYPES
// ============================================================

/** Identifies which typology system a question belongs to. */
export type QuizSystemId = SystemId

/** A single answer option within a question. */
export interface QuizOption {
  /** Display text (in-universe flavor). */
  label: string
  /** Scoring weights — keys depend on the system's scoring algorithm. */
  weights: Record<string, number>
}

/** A single quiz question. */
export interface QuizQuestion {
  /** Unique key, e.g. 'ap-1', 'enn-5', 'mbti-8'. */
  id: string
  /** Which system this question scores for. */
  system: QuizSystemId
  /** The question text (dark fantasy flavor). */
  prompt: string
  /** 2-4 answer choices. */
  optionList: QuizOption[]
}

/** User's answer to a question: question ID -> selected option index. */
export type QuizAnswerMap = Record<string, number>

/** Extra detail available when quiz is run in deep mode. */
export interface DeepQuizDetail {
  cognitiveFunctionScoreMap?: Record<CognitiveFunction, number>
}

/** Complete quiz results — one determined type per system. */
export interface QuizResult {
  attitudinal: APType | null
  enneagramType: EnneagramNumber | null
  enneagramWing: EnneagramNumber | null
  enneagramInstinct: EnneagramInstinct | null
  mbti: MBTIType | null
  socionics: SocionicsType | null
  instinctRealm: InstinctRealm | null
  /** Per-system scoring explanation for result transparency. */
  explanationMap?: Partial<Record<SystemId, ScoreBreakdown>>
  /** Extra detail from deep quiz mode (cognitive function scores, etc). */
  deepDetail?: DeepQuizDetail
}
