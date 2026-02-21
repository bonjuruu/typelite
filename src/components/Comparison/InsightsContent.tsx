import type { ComparisonSlot } from "../../types/comparison.ts";

// ============================================================
// INSIGHTS
// ============================================================

interface InsightsContentProps {
  slotA: ComparisonSlot;
  slotB: ComparisonSlot;
  insightsA: string[];
  insightsB: string[];
}

export function InsightsContent({
  slotA,
  slotB,
  insightsA,
  insightsB,
}: InsightsContentProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <span className="text-[9px] font-semibold uppercase text-indigo-400">
          {slotA.name}
        </span>
        {insightsA.length > 0 ? (
          <ul className="mt-1 space-y-1">
            {insightsA.map((text, i) => (
              <li key={i} className="text-xs leading-relaxed text-gray-400">
                &bull; {text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-gray-600">No cross-system insights</p>
        )}
      </div>
      <div>
        <span className="text-[9px] font-semibold uppercase text-amber-400">
          {slotB.name}
        </span>
        {insightsB.length > 0 ? (
          <ul className="mt-1 space-y-1">
            {insightsB.map((text, i) => (
              <li key={i} className="text-xs leading-relaxed text-gray-400">
                &bull; {text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-gray-600">No cross-system insights</p>
        )}
      </div>
    </div>
  );
}
