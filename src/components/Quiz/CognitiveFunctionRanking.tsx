import type { CognitiveFunction } from "../../engine/types/index.ts";
import { ScoreBarChart } from "./ScoreBarChart.tsx";

// ============================================================
// COGNITIVE FUNCTION RANKING
// ============================================================

interface CognitiveFunctionRankingProps {
  scoreMap: Record<CognitiveFunction, number>;
}

export function CognitiveFunctionRanking({
  scoreMap,
}: CognitiveFunctionRankingProps) {
  const sortedFunctionList = (
    Object.entries(scoreMap) as [CognitiveFunction, number][]
  ).sort((a, b) => b[1] - a[1]);

  const maxScore = sortedFunctionList[0]?.[1] ?? 1;
  const winnerLabel = sortedFunctionList[0]?.[0];

  const scoreEntryList = sortedFunctionList.map(([fn, score]) => ({
    label: fn,
    score,
    maxPossible: maxScore,
  }));

  return (
    <div className="mt-3">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Cognitive Function Scores
      </p>
      <ScoreBarChart
        scoreEntryList={scoreEntryList}
        winnerLabel={winnerLabel}
      />
    </div>
  );
}
