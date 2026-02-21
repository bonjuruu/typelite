import type { StatName, StatBlock } from "../../engine/types/index.ts";

// ============================================================
// STAT BUDGET INDICATOR
// ============================================================

interface StatBudgetIndicatorProps {
  originalStats: StatBlock;
  currentStats: StatBlock;
  isEdited: boolean;
}

export function StatBudgetIndicator({
  originalStats,
  currentStats,
  isEdited,
}: StatBudgetIndicatorProps) {
  const STAT_KEY_LIST: StatName[] = [
    "willpower",
    "intelligence",
    "spirit",
    "vitality",
  ];
  const originalTotal = STAT_KEY_LIST.reduce(
    (sum, key) => sum + originalStats[key],
    0,
  );
  const currentTotal = STAT_KEY_LIST.reduce(
    (sum, key) => sum + currentStats[key],
    0,
  );
  const spent = Math.abs(currentTotal - originalTotal);
  const remaining = 4 - spent;
  const overBudget = remaining < 0;

  if (!isEdited) {
    return (
      <p className="mt-2 text-[10px] text-gray-600">
        Stat budget: 4 points to redistribute
      </p>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="text-[10px] text-gray-500">Budget:</span>
      <div className="flex gap-0.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-3 rounded-sm ${
              i < spent
                ? overBudget
                  ? "bg-red-500"
                  : "bg-indigo-500"
                : "bg-gray-700"
            }`}
          />
        ))}
      </div>
      <span
        className={`font-mono text-[10px] tabular-nums ${
          overBudget
            ? "text-red-400"
            : remaining === 0
              ? "text-amber-400"
              : "text-gray-400"
        }`}
      >
        {remaining > 0
          ? `${remaining} left`
          : remaining === 0
            ? "full"
            : "over"}
      </span>
      {currentTotal !== originalTotal && (
        <span className="text-[10px] text-gray-600">
          ({currentTotal > originalTotal ? "+" : ""}
          {currentTotal - originalTotal} net)
        </span>
      )}
    </div>
  );
}
