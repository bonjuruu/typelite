// Barrel export for quiz engine modules.

export {
  scoreAttitudinal,
  scoreEnneagram,
  scoreMBTI,
  scoreSocionics,
  scoreInstinctCenter,
  scoreInstinctRealm,
  scoreInstincts,
  explainAttitudinal,
  explainEnneagram,
  explainMBTI,
  explainSocionics,
  explainInstincts,
} from "./scorers/index.ts";

export {
  scoreAttitudinalDeep,
  scoreEnneagramDeep,
  scoreMBTIDeep,
  scoreSocionicsDeep,
  scoreInstinctCenterDeep,
  scoreInstinctRealmDeep,
  explainAttitudinalDeep,
  explainEnneagramDeep,
  explainMBTIDeep,
  explainSocionicsDeep,
  explainInstinctsDeep,
} from "./deepScorers/index.ts";

export {
  computeQuizResults,
  quickScorerKit,
  deepScorerKit,
} from "./computeResults.ts";

export type { QuizScorerKit } from "./computeResults.ts";

export {
  accumulateScoreMap,
  topKey,
  buildQuestionInfluenceList,
  ASPECT_LIST,
  ASPECT_PRIORITY,
  ENNEAGRAM_NUMBER_LIST,
  ENNEAGRAM_INSTINCT_KEY_LIST,
  INSTINCT_CENTER_LIST,
} from "./shared.ts";

export type { Aspect } from "./shared.ts";
