import type { MBTIType, SocionicsType } from "../../types/index.ts";
import type { QuizQuestion, QuizAnswerMap } from "../../../data/quiz/types.ts";
import type { ScoreBreakdown, ScoreEntry } from "../../../types/quiz.ts";
import {
  accumulateScoreMap,
  topKey,
  buildQuestionInfluenceList,
} from "../shared.ts";

// ============================================================
// SOCIONICS - MBTI Derivation + Quadra Adjustment
// ============================================================

type SocionicsQuadra = "Alpha" | "Beta" | "Gamma" | "Delta";

const MBTI_TO_SOCIONICS: Record<MBTIType, SocionicsType> = {
  INTJ: "ILI",
  INTP: "LII",
  ENTJ: "LIE",
  ENTP: "ILE",
  INFJ: "IEI",
  INFP: "EII",
  ENFJ: "EIE",
  ENFP: "IEE",
  ISTJ: "LSI",
  ISFJ: "ESI",
  ESTJ: "LSE",
  ESFJ: "ESE",
  ISTP: "SLI",
  ISFP: "SEI",
  ESTP: "SLE",
  ESFP: "SEE",
};

const SOCIONICS_TYPE_QUADRA: Record<SocionicsType, SocionicsQuadra> = {
  ILE: "Alpha",
  SEI: "Alpha",
  ESE: "Alpha",
  LII: "Alpha",
  SLE: "Beta",
  IEI: "Beta",
  EIE: "Beta",
  LSI: "Beta",
  SEE: "Gamma",
  ILI: "Gamma",
  LIE: "Gamma",
  ESI: "Gamma",
  IEE: "Delta",
  SLI: "Delta",
  LSE: "Delta",
  EII: "Delta",
};

/** Types grouped by quadra, for fallback matching. */
const TYPES_BY_QUADRA: Record<SocionicsQuadra, readonly SocionicsType[]> = {
  Alpha: ["ILE", "SEI", "ESE", "LII"],
  Beta: ["SLE", "IEI", "EIE", "LSI"],
  Gamma: ["SEE", "ILI", "LIE", "ESI"],
  Delta: ["IEE", "SLI", "LSE", "EII"],
};

/** Reverse mapping: socionics type → MBTI type that maps to it. */
const SOCIONICS_TO_MBTI: Record<SocionicsType, MBTIType> = {} as Record<
  SocionicsType,
  MBTIType
>;
for (const [mbti, soc] of Object.entries(MBTI_TO_SOCIONICS)) {
  SOCIONICS_TO_MBTI[soc] = mbti as MBTIType;
}

/** Count how many MBTI letter positions match between two MBTI types. */
function mbtiOverlap(a: MBTIType, b: MBTIType): number {
  let count = 0;
  for (let i = 0; i < 4; i++) {
    if (a[i] === b[i]) count++;
  }
  return count;
}

/**
 * Score socionics type by deriving from MBTI result and adjusting with quadra preference questions.
 * Weight keys: 'Alpha', 'Beta', 'Gamma', 'Delta'.
 */
export function scoreSocionics(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  mbtiResult: MBTIType,
): SocionicsType {
  const derivedType = MBTI_TO_SOCIONICS[mbtiResult];
  const derivedQuadra = SOCIONICS_TYPE_QUADRA[derivedType];

  const quadraKeyList: SocionicsQuadra[] = ["Alpha", "Beta", "Gamma", "Delta"];
  const quadraScore = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(quadraKeyList),
  );

  const scoredQuadra = topKey(quadraScore, quadraKeyList);

  if (scoredQuadra === derivedQuadra) {
    return derivedType;
  }

  const candidateList = TYPES_BY_QUADRA[scoredQuadra];
  let bestCandidate = candidateList[0];
  let bestOverlap = -1;

  for (const candidate of candidateList) {
    const candidateMBTI = SOCIONICS_TO_MBTI[candidate];
    const overlap = mbtiOverlap(mbtiResult, candidateMBTI);
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      bestCandidate = candidate;
    }
  }

  return bestCandidate;
}

/** Explain Socionics scoring: show quadra scores + derivation match. */
export function explainSocionics(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  mbtiResult: MBTIType,
): ScoreBreakdown {
  const derivedType = MBTI_TO_SOCIONICS[mbtiResult];
  const derivedQuadra = SOCIONICS_TYPE_QUADRA[derivedType];

  const quadraKeyList: SocionicsQuadra[] = ["Alpha", "Beta", "Gamma", "Delta"];
  const quadraScore = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(quadraKeyList),
  );

  const sortedQuadraList = (
    Object.entries(quadraScore) as [SocionicsQuadra, number][]
  ).sort((a, b) => b[1] - a[1]);

  const scoredQuadra = sortedQuadraList[0][0];
  const matched = scoredQuadra === derivedQuadra;
  const winnerMargin = sortedQuadraList[0][1] - sortedQuadraList[1][1];
  const answeredCount = questionList.filter(
    (q) => answerMap[q.id] !== undefined,
  ).length;

  const axisLeanSummary = [
    `${sortedQuadraList[0][0]} scored ${sortedQuadraList[0][1]}, ${sortedQuadraList[1][0]} scored ${sortedQuadraList[1][1]}.`,
    matched
      ? `Derived ${derivedType} matched ${derivedQuadra}, keeping result.`
      : `Derived ${derivedType} (${derivedQuadra}) overridden by ${scoredQuadra} preference.`,
  ];

  const scoreDetail = sortedQuadraList.map(([q, s]) => `${q}: ${s}`);

  const scoreEntryList: ScoreEntry[] = sortedQuadraList.map(([q, s]) => ({
    label: q,
    score: s,
    maxPossible: answeredCount,
  }));

  const questionInfluenceList = buildQuestionInfluenceList(
    answerMap,
    questionList,
    new Set(quadraKeyList as string[]),
  );

  return {
    axisLeanSummary,
    scoreDetail,
    scoreEntryList,
    winnerMargin,
    questionInfluenceList,
  };
}
