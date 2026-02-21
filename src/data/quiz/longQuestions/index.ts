import type { SystemId } from "../../../engine/types/index.ts";
import type { QuizQuestion } from "../types.ts";
import { DEEP_AP_QUESTION_LIST } from "./attitudinal.ts";
import { DEEP_ENNEAGRAM_QUESTION_LIST } from "./enneagram.ts";
import { DEEP_MBTI_QUESTION_LIST } from "./mbti.ts";
import { DEEP_SOCIONICS_QUESTION_LIST } from "./socionics.ts";
import { DEEP_INSTINCT_CENTER_QUESTION_LIST } from "./instincts.ts";

export { DEEP_AP_QUESTION_LIST } from "./attitudinal.ts";
export { DEEP_ENNEAGRAM_QUESTION_LIST } from "./enneagram.ts";
export { DEEP_MBTI_QUESTION_LIST } from "./mbti.ts";
export { DEEP_SOCIONICS_QUESTION_LIST } from "./socionics.ts";
export {
  DEEP_INSTINCT_CENTER_QUESTION_LIST,
  getLongInstinctRealmQuestionList,
} from "./instincts.ts";

// ============================================================
// QUESTION LIST BUILDER
// ============================================================

/** Get the full ordered deep question list for a set of enabled systems. */
export function getLongQuestionList(
  enabledSystems: Record<SystemId, boolean>,
): QuizQuestion[] {
  const questionList: QuizQuestion[] = [];

  if (enabledSystems.attitudinal) {
    questionList.push(...DEEP_AP_QUESTION_LIST);
  }
  if (enabledSystems.enneagram) {
    questionList.push(...DEEP_ENNEAGRAM_QUESTION_LIST);
  }
  if (enabledSystems.mbti) {
    questionList.push(...DEEP_MBTI_QUESTION_LIST);
  }
  if (enabledSystems.socionics) {
    questionList.push(...DEEP_SOCIONICS_QUESTION_LIST);
  }
  if (enabledSystems.instincts) {
    questionList.push(...DEEP_INSTINCT_CENTER_QUESTION_LIST);
    // Realm questions are added dynamically after center is determined
  }

  return questionList;
}

// ============================================================
// DEEP QUESTION COUNTS (for UI display)
// ============================================================

export const DEEP_QUESTION_COUNT: Record<SystemId, number> = {
  attitudinal: 12,
  enneagram: 30,
  mbti: 32,
  socionics: 22,
  instincts: 18, // 6 center + 4 realm (12 total exist, 4 shown dynamically)
};

export const DEEP_REALM_QUESTION_COUNT = 4;
