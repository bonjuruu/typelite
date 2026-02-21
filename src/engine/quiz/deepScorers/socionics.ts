import type {
  SocionicsType,
  CognitiveFunction,
} from "../../types/index.ts";
import type { QuizQuestion, QuizAnswerMap } from "../../../data/quiz/types.ts";
import type { ScoreBreakdown, ScoreEntry } from "../../../types/quiz.ts";
import {
  accumulateScoreMap,
  topKey,
  buildQuestionInfluenceList,
} from "../shared.ts";

// ============================================================
// DEEP SOCIONICS — Model A Stack-Fit + Quadra/Club
// ============================================================

type SocionicsQuadra = "Alpha" | "Beta" | "Gamma" | "Delta";
type SocionicsClub = "Researcher" | "Social" | "Practical" | "Humanitarian";

const QUADRA_LIST: readonly SocionicsQuadra[] = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
] as const;
const CLUB_LIST: readonly SocionicsClub[] = [
  "Researcher",
  "Social",
  "Practical",
  "Humanitarian",
] as const;

type InfoElement =
  | "ie_Ti"
  | "ie_Te"
  | "ie_Fi"
  | "ie_Fe"
  | "ie_Si"
  | "ie_Se"
  | "ie_Ni"
  | "ie_Ne";

const INFO_ELEMENT_LIST: readonly InfoElement[] = [
  "ie_Ti",
  "ie_Te",
  "ie_Fi",
  "ie_Fe",
  "ie_Si",
  "ie_Se",
  "ie_Ni",
  "ie_Ne",
] as const;

const COGNITIVE_FUNCTION_LIST: readonly CognitiveFunction[] = [
  "Ti",
  "Te",
  "Fi",
  "Fe",
  "Si",
  "Se",
  "Ni",
  "Ne",
] as const;

const SOCIONICS_FUNCTION_STACK: Record<
  SocionicsType,
  readonly [InfoElement, InfoElement, InfoElement, InfoElement]
> = {
  ILE: ["ie_Ne", "ie_Ti", "ie_Se", "ie_Fi"],
  SEI: ["ie_Si", "ie_Fe", "ie_Ni", "ie_Te"],
  ESE: ["ie_Fe", "ie_Si", "ie_Te", "ie_Ni"],
  LII: ["ie_Ti", "ie_Ne", "ie_Fi", "ie_Se"],
  SLE: ["ie_Se", "ie_Ti", "ie_Ne", "ie_Fi"],
  IEI: ["ie_Ni", "ie_Fe", "ie_Si", "ie_Te"],
  EIE: ["ie_Fe", "ie_Ni", "ie_Te", "ie_Si"],
  LSI: ["ie_Ti", "ie_Se", "ie_Fi", "ie_Ne"],
  SEE: ["ie_Se", "ie_Fi", "ie_Ne", "ie_Ti"],
  ILI: ["ie_Ni", "ie_Te", "ie_Si", "ie_Fe"],
  LIE: ["ie_Te", "ie_Ni", "ie_Fe", "ie_Si"],
  ESI: ["ie_Fi", "ie_Se", "ie_Ti", "ie_Ne"],
  IEE: ["ie_Ne", "ie_Fi", "ie_Se", "ie_Ti"],
  SLI: ["ie_Si", "ie_Te", "ie_Ni", "ie_Fe"],
  LSE: ["ie_Te", "ie_Si", "ie_Fe", "ie_Ni"],
  EII: ["ie_Fi", "ie_Ne", "ie_Ti", "ie_Se"],
};

const SOCIONICS_TYPE_LIST: readonly SocionicsType[] = [
  "ILE",
  "SEI",
  "ESE",
  "LII",
  "SLE",
  "IEI",
  "EIE",
  "LSI",
  "SEE",
  "ILI",
  "LIE",
  "ESI",
  "IEE",
  "SLI",
  "LSE",
  "EII",
] as const;

const TYPE_QUADRA: Record<SocionicsType, SocionicsQuadra> = {
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

const TYPE_CLUB: Record<SocionicsType, SocionicsClub> = {
  ILE: "Researcher",
  LII: "Researcher",
  ILI: "Researcher",
  LIE: "Researcher",
  ESE: "Humanitarian",
  SEI: "Humanitarian",
  SEE: "Humanitarian",
  ESI: "Humanitarian",
  EIE: "Social",
  IEI: "Social",
  IEE: "Social",
  EII: "Social",
  SLE: "Practical",
  LSI: "Practical",
  SLI: "Practical",
  LSE: "Practical",
};

const CROSS_SCORED_ELEMENT_MAP: Record<CognitiveFunction, InfoElement> = {
  Ne: "ie_Ne",
  Ti: "ie_Ti",
  Te: "ie_Te",
} as Record<CognitiveFunction, InfoElement>;

const CROSS_SCORED_FUNCTION_LIST: readonly CognitiveFunction[] = [
  "Ne",
  "Ti",
  "Te",
] as const;

// Position weights for stack-fit scoring
const POSITION_WEIGHT_LIST = [4, 3, 2, 1] as const;

function buildInfoElementScoreMap(
  answerMap: QuizAnswerMap,
  socionicsQuestionList: QuizQuestion[],
  mbtiQuestionList: QuizQuestion[],
): Record<InfoElement, number> {
  const socIeScoreMap = accumulateScoreMap(
    answerMap,
    socionicsQuestionList,
    new Set(INFO_ELEMENT_LIST),
  );

  if (mbtiQuestionList.length > 0) {
    const mbtiScoreMap = accumulateScoreMap(
      answerMap,
      mbtiQuestionList,
      new Set(COGNITIVE_FUNCTION_LIST),
    );

    for (const fn of CROSS_SCORED_FUNCTION_LIST) {
      const ieKey = CROSS_SCORED_ELEMENT_MAP[fn];
      socIeScoreMap[ieKey] = mbtiScoreMap[fn];
    }
  }

  return socIeScoreMap;
}

/**
 * Score socionics type using 3 signals:
 *
 * 1. Information element stack-fit (hybrid: cross-scored Ti/Te/Ne from MBTI + Augusta-specific Se/Si/Ni/Fe/Fi)
 * 2. Quadra preference bonus
 * 3. Club preference bonus
 *
 * The final score = stackFit + (quadraBonus * 2) + clubBonus
 */
export function scoreSocionicsDeep(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  mbtiQuestionList: QuizQuestion[] = [],
): SocionicsType {
  const quadraClubKeySet = new Set<string>([...QUADRA_LIST, ...CLUB_LIST]);
  const quadraClubScoreMap = accumulateScoreMap(
    answerMap,
    questionList,
    quadraClubKeySet,
  );

  const ieScoreMap = buildInfoElementScoreMap(
    answerMap,
    questionList,
    mbtiQuestionList,
  );

  const rankedElementList = [...INFO_ELEMENT_LIST]
    .map((ie, originalIndex) => ({
      ie,
      score: ieScoreMap[ie] ?? 0,
      originalIndex,
    }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);

  const rankMap: Record<string, number> = {};
  for (let i = 0; i < rankedElementList.length; i++) {
    rankMap[rankedElementList[i].ie] = i;
  }

  const bestQuadra = topKey(
    quadraClubScoreMap as Record<SocionicsQuadra, number>,
    QUADRA_LIST,
  );
  const bestClub = topKey(
    quadraClubScoreMap as Record<SocionicsClub, number>,
    CLUB_LIST,
  );

  let bestType: SocionicsType = "ILE";
  let bestScore = -Infinity;

  for (const socType of SOCIONICS_TYPE_LIST) {
    const stack = SOCIONICS_FUNCTION_STACK[socType];

    let fitScore = 0;
    for (let pos = 0; pos < 4; pos++) {
      fitScore += POSITION_WEIGHT_LIST[pos] * (7 - rankMap[stack[pos]]);
    }

    const quadraBonus = TYPE_QUADRA[socType] === bestQuadra ? 6 : 0;
    const clubBonus = TYPE_CLUB[socType] === bestClub ? 3 : 0;

    const totalScore = fitScore + quadraBonus + clubBonus;

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestType = socType;
    }
  }

  return bestType;
}

// ============================================================
// DEEP EXPLAIN — Socionics (unique: quadra/club + ie ranking)
// ============================================================

export function explainSocionicsDeep(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
  mbtiQuestionList: QuizQuestion[] = [],
): ScoreBreakdown {
  const quadraClubKeySet = new Set<string>([...QUADRA_LIST, ...CLUB_LIST]);
  const quadraClubScoreMap = accumulateScoreMap(
    answerMap,
    questionList,
    quadraClubKeySet,
  );

  const ieScoreMap = buildInfoElementScoreMap(
    answerMap,
    questionList,
    mbtiQuestionList,
  );

  const rankedElementList = [...INFO_ELEMENT_LIST]
    .map((ie, originalIndex) => ({
      ie,
      score: ieScoreMap[ie] ?? 0,
      originalIndex,
    }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);

  const sortedQuadraList = [...QUADRA_LIST]
    .map((q) => ({ quadra: q, score: quadraClubScoreMap[q] }))
    .sort((a, b) => b.score - a.score);

  const sortedClubList = [...CLUB_LIST]
    .map((c) => ({ club: c, score: quadraClubScoreMap[c] }))
    .sort((a, b) => b.score - a.score);

  const hasCrossScoring = mbtiQuestionList.length > 0;
  const crossScoreNote = hasCrossScoring
    ? "Ti/Te/Ne cross-scored from MBTI."
    : "No MBTI data — Ti/Te/Ne from Socionics questions only.";

  const winnerMargin = sortedQuadraList[0].score - sortedQuadraList[1].score;
  const answeredCount = questionList.filter(
    (q) => answerMap[q.id] !== undefined,
  ).length;

  const axisLeanSummary = [
    `Quadra: ${sortedQuadraList[0].quadra} (${sortedQuadraList[0].score}), runner-up ${sortedQuadraList[1].quadra} (${sortedQuadraList[1].score}).`,
    `Top functions: ${rankedElementList[0].ie.replace("ie_", "")} (${rankedElementList[0].score}), ${rankedElementList[1].ie.replace("ie_", "")} (${rankedElementList[1].score}). ${crossScoreNote}`,
  ];

  const scoreDetail = [
    ...rankedElementList.map((e) => `${e.ie.replace("ie_", "")}: ${e.score}`),
    "---",
    ...sortedQuadraList.map((q) => `${q.quadra}: ${q.score}`),
    ...sortedClubList.map((c) => `${c.club}: ${c.score}`),
  ];

  const scoreEntryList: ScoreEntry[] = [
    ...sortedQuadraList.map((q) => ({
      label: q.quadra,
      score: q.score,
      maxPossible: answeredCount,
    })),
    ...sortedClubList.map((c) => ({
      label: c.club,
      score: c.score,
      maxPossible: answeredCount,
    })),
  ];

  const questionInfluenceList = buildQuestionInfluenceList(
    answerMap,
    questionList,
    quadraClubKeySet,
  );

  return {
    axisLeanSummary,
    scoreDetail,
    scoreEntryList,
    winnerMargin,
    questionInfluenceList,
  };
}
