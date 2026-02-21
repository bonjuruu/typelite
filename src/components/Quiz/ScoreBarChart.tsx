import type { ScoreEntry } from "../../types/quiz.ts";

interface ScoreBarChartProps {
  scoreEntryList: ScoreEntry[];
  winnerLabel?: string;
}

export function ScoreBarChart({
  scoreEntryList,
  winnerLabel,
}: ScoreBarChartProps) {
  const maxScore = Math.max(1, ...scoreEntryList.map((e) => e.score));

  return (
    <div className="mt-3 space-y-1.5">
      {scoreEntryList.map((entry) => {
        const isWinner =
          winnerLabel !== undefined && entry.label === winnerLabel;
        return (
          <div key={entry.label} className="flex items-center gap-2 text-xs">
            <span
              className={`w-12 text-right font-mono font-medium ${isWinner ? "text-indigo-300" : "text-gray-300"}`}
            >
              {entry.label}
            </span>
            <div className="h-1.5 flex-1 rounded-full bg-gray-700">
              <div
                className={`h-full rounded-full ${isWinner ? "bg-indigo-500" : "bg-indigo-500/40"}`}
                style={{ width: `${(entry.score / maxScore) * 100}%` }}
              />
            </div>
            <span className="w-10 text-right font-mono text-gray-500">
              {entry.score}/{entry.maxPossible}
            </span>
          </div>
        );
      })}
    </div>
  );
}
