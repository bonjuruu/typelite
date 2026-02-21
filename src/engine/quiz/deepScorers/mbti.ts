import type { MBTIType, CognitiveFunction } from "../../types/index.ts";
import type { QuizQuestion, QuizAnswerMap } from "../../../data/quiz/types.ts";
import type { ScoreBreakdown, ScoreEntry } from "../../../types/quiz.ts";
import { getFunctionStack } from "../../../data/mbti/index.ts";
import {
  accumulateScoreMap,
  buildQuestionInfluenceList,
} from "../shared.ts";

// ============================================================
// COGNITIVE FUNCTION CONSTANTS
// ============================================================

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

const MBTI_TYPE_LIST: readonly MBTIType[] = [
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
] as const;

// Position weights for stack-fit scoring
const POSITION_WEIGHT_LIST = [4, 3, 2, 1] as const;

// ============================================================
// DEEP MBTI — Cognitive Function Stack-Fit Scoring
// ============================================================

/**
 * Score MBTI type from cognitive function questions using stack-fit correlation.
 *
 * 1. Accumulate raw scores for all 8 functions
 * 2. Rank functions by score
 * 3. For each of the 16 types, compute a fit score using position weights
 * 4. Return the type with the highest fit score
 */
export function scoreMBTIDeep(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): { type: MBTIType; functionScoreMap: Record<CognitiveFunction, number> } {
  const functionScoreMap = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(COGNITIVE_FUNCTION_LIST),
  );

  const rankedFunctionList = [...COGNITIVE_FUNCTION_LIST]
    .map((fn, originalIndex) => ({
      fn,
      score: functionScoreMap[fn],
      originalIndex,
    }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);

  const rankMap: Record<string, number> = {};
  for (let i = 0; i < rankedFunctionList.length; i++) {
    rankMap[rankedFunctionList[i].fn] = i;
  }

  let bestType: MBTIType = "INFP";
  let bestFitScore = -Infinity;
  let bestHeroScore = -Infinity;

  for (const mbtiType of MBTI_TYPE_LIST) {
    const stack = getFunctionStack(mbtiType);
    let fitScore = 0;

    for (let pos = 0; pos < 4; pos++) {
      const functionAtPosition = stack[pos];
      const userRank = rankMap[functionAtPosition];
      fitScore += POSITION_WEIGHT_LIST[pos] * (7 - userRank);
    }

    const heroScore = functionScoreMap[stack[0]];

    if (
      fitScore > bestFitScore ||
      (fitScore === bestFitScore && heroScore > bestHeroScore)
    ) {
      bestFitScore = fitScore;
      bestType = mbtiType;
      bestHeroScore = heroScore;
    }
  }

  return { type: bestType, functionScoreMap };
}

// ============================================================
// DEEP EXPLAIN — MBTI (unique: function-based, not axis-based)
// ============================================================

export function explainMBTIDeep(
  answerMap: QuizAnswerMap,
  questionList: QuizQuestion[],
): ScoreBreakdown {
  const functionScoreMap = accumulateScoreMap(
    answerMap,
    questionList,
    new Set(COGNITIVE_FUNCTION_LIST),
  );

  const rankedFunctionList = [...COGNITIVE_FUNCTION_LIST]
    .map((fn, originalIndex) => ({
      fn,
      score: functionScoreMap[fn],
      originalIndex,
    }))
    .sort((a, b) => b.score - a.score || a.originalIndex - b.originalIndex);

  const rankMap: Record<string, number> = {};
  for (let i = 0; i < rankedFunctionList.length; i++) {
    rankMap[rankedFunctionList[i].fn] = i;
  }

  const typeFitList: { type: MBTIType; fitScore: number }[] = [];
  for (const mbtiType of MBTI_TYPE_LIST) {
    const stack = getFunctionStack(mbtiType);
    let fitScore = 0;
    for (let pos = 0; pos < 4; pos++) {
      fitScore += POSITION_WEIGHT_LIST[pos] * (7 - rankMap[stack[pos]]);
    }
    typeFitList.push({ type: mbtiType, fitScore });
  }
  typeFitList.sort((a, b) => b.fitScore - a.fitScore);

  const top3 = typeFitList.slice(0, 3);
  const margin = top3[0].fitScore - top3[1].fitScore;

  const axisLeanSummary = [
    `Function-based: ${top3[0].type} (fit: ${top3[0].fitScore}), ${top3[1].type} (fit: ${top3[1].fitScore}). Margin: ${margin}.`,
    `Top functions: ${rankedFunctionList[0].fn} (${rankedFunctionList[0].score}), ${rankedFunctionList[1].fn} (${rankedFunctionList[1].score}).`,
  ];

  const scoreDetail = [
    ...rankedFunctionList.map((f) => `${f.fn}: ${f.score}`),
    "---",
    ...top3.map((t) => `${t.type}: fit ${t.fitScore}`),
  ];

  const maxFnScore = rankedFunctionList[0]?.score ?? 1;
  const scoreEntryList: ScoreEntry[] = rankedFunctionList.map((f) => ({
    label: f.fn,
    score: f.score,
    maxPossible: maxFnScore,
  }));

  const questionInfluenceList = buildQuestionInfluenceList(
    answerMap,
    questionList,
    new Set(COGNITIVE_FUNCTION_LIST as readonly string[]),
  );

  return {
    axisLeanSummary,
    scoreDetail,
    scoreEntryList,
    questionInfluenceList,
  };
}
