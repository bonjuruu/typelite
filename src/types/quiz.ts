import type {
  SystemId,
  APType,
  MBTIType,
  SocionicsType,
  EnneagramNumber,
  EnneagramInstinct,
  InstinctRealm,
  CognitiveFunction,
} from "../engine/types/index.ts";

// ============================================================
// SCORE BREAKDOWN
// ============================================================

export interface ScoreEntry {
  label: string;
  score: number;
  maxPossible: number;
}

export interface ScoreContribution {
  target: string;
  points: number;
}

export interface QuestionInfluence {
  questionId: string;
  questionPrompt: string;
  selectedOptionLabel: string;
  contributionList: ScoreContribution[];
}

export interface ScoreBreakdown {
  axisLeanSummary: string[];
  scoreDetail: string[];
  scoreEntryList?: ScoreEntry[];
  winnerMargin?: number;
  questionInfluenceList?: QuestionInfluence[];
}

// ============================================================
// QUIZ DATA
// ============================================================

export type QuizMode = "quick" | "deep";

export type QuizSystemId = SystemId;

export interface QuizOption {
  label: string;
  weights: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  system: QuizSystemId;
  prompt: string;
  optionList: QuizOption[];
}

export type QuizAnswerMap = Record<string, number>;

export interface DeepQuizDetail {
  cognitiveFunctionScoreMap?: Record<CognitiveFunction, number>;
}

export interface QuizResult {
  attitudinal: APType | null;
  enneagramType: EnneagramNumber | null;
  enneagramWing: EnneagramNumber | null;
  enneagramInstinct: EnneagramInstinct | null;
  mbti: MBTIType | null;
  socionics: SocionicsType | null;
  instinctRealm: InstinctRealm | null;
  explanationMap?: Partial<Record<SystemId, ScoreBreakdown>>;
  deepDetail?: DeepQuizDetail;
}
