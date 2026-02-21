import type { SystemId } from "../../../engine/types/index.ts";
import type { QuizQuestion } from "../types.ts";
import { AP_QUESTION_LIST } from "./attitudinal.ts";
import { ENNEAGRAM_QUESTION_LIST } from "./enneagram.ts";
import { MBTI_QUESTION_LIST } from "./mbti.ts";
import { SOCIONICS_QUESTION_LIST } from "./socionics.ts";
import { INSTINCT_CENTER_QUESTION_LIST } from "./instincts.ts";

export { AP_QUESTION_LIST } from "./attitudinal.ts";
export { ENNEAGRAM_QUESTION_LIST } from "./enneagram.ts";
export { MBTI_QUESTION_LIST } from "./mbti.ts";
export { SOCIONICS_QUESTION_LIST } from "./socionics.ts";
export {
  INSTINCT_CENTER_QUESTION_LIST,
  getInstinctRealmQuestionList,
  isRealmQuestionId,
} from "./instincts.ts";

// ============================================================
// QUESTION COUNTS
// ============================================================

/** Number of questions per system (quick mode). Instincts includes 5 dynamically resolved realm questions. */
export const QUICK_QUESTION_COUNT: Record<SystemId, number> = {
  attitudinal: 6,
  enneagram: 15,
  mbti: 12,
  socionics: 4,
  instincts: 8, // 3 center + 5 realm
};

export const QUICK_REALM_QUESTION_COUNT = 5;

// ============================================================
// QUESTION LIST BUILDER
// ============================================================

/** Get the full ordered question list for a set of enabled systems. */
export function getQuestionList(
  enabledSystems: Record<SystemId, boolean>,
): QuizQuestion[] {
  const questionList: QuizQuestion[] = [];

  if (enabledSystems.attitudinal) {
    questionList.push(...AP_QUESTION_LIST);
  }
  if (enabledSystems.enneagram) {
    questionList.push(...ENNEAGRAM_QUESTION_LIST);
  }
  if (enabledSystems.mbti) {
    questionList.push(...MBTI_QUESTION_LIST);
  }
  if (enabledSystems.socionics) {
    questionList.push(...SOCIONICS_QUESTION_LIST);
  }
  if (enabledSystems.instincts) {
    questionList.push(...INSTINCT_CENTER_QUESTION_LIST);
    // Realm questions are added dynamically after center is determined
  }

  return questionList;
}

// ============================================================
// SECTION TRANSITIONS
// ============================================================

/** Flavor text shown between quiz sections when switching systems. */
export const SECTION_TRANSITION_TEXT: Record<
  SystemId,
  { intro: string; outro: string; detail: string }
> = {
  attitudinal: {
    intro:
      "The spirits weigh your inner compass... Which forces shape your will?",
    outro: "Your cardinal aspects are set. The wheel turns.",
    detail:
      "Determines your base stats. First aspect scores highest, fourth scores lowest.",
  },
  enneagram: {
    intro:
      "The ancient wheel of nine turns before you... What archetype do you embody?",
    outro: "Your archetype is taking shape. Now for the mind.",
    detail:
      "Nine core motivations, nine class archetypes. Wings and instincts refine the build.",
  },
  mbti: {
    intro: "The cognitive forge ignites... How does your mind shape the world?",
    outro: "Mental wiring locked in. Allegiance next.",
    detail:
      "Four cognitive functions, four ability slots. Each function plays differently depending on position.",
  },
  socionics: {
    intro:
      "The four quadras call from the void... Where does your soul find kinship?",
    outro: "Elemental allegiance sealed. One section remains.",
    detail: "Quadras set your elemental school. Separate system from MBTI.",
  },
  instincts: {
    intro: "The primal currents surge... What drives you at your core?",
    outro: "Instinctual foundation set. The reading is complete.",
    detail:
      "Nine realms across three centers shape your combat behavior. Not the classic enneagram instincts.",
  },
};
