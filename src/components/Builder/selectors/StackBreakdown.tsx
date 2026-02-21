import type { APType } from "../../../engine/types/index.ts";
import { describeStack } from "../../../data/index.ts";

// ============================================================
// STACK BREAKDOWN
// ============================================================

const ATTITUDE_COLORS: Record<string, string> = {
  "1": "border-amber-700 bg-amber-950/30",
  "2": "border-green-700 bg-green-950/30",
  "3": "border-red-700 bg-red-950/30",
  "4": "border-gray-700 bg-gray-800/30",
};

export function StackBreakdown({ apType }: { apType: APType }) {
  const stackDetailList = describeStack(apType);

  return (
    <div className="space-y-1.5">
      {stackDetailList.map((detail) => (
        <div
          key={detail.position}
          className={`rounded border p-2 ${ATTITUDE_COLORS[detail.position.toString()]}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-300">
                {detail.label} {detail.aspect}
              </span>
              <span className="text-[10px] text-gray-500">
                {detail.attitude.orientation} &middot; Self
                {detail.attitude.selfAttitude} &middot; Others
                {detail.attitude.othersAttitude}
              </span>
            </div>
            <span className="text-xs font-semibold text-gray-400">
              {detail.stat}: {detail.statValue}
            </span>
          </div>
          <p className="mt-0.5 text-[11px] text-gray-400">
            {detail.flavor.summary}
          </p>
          <p className="text-[10px] italic text-gray-600">
            {detail.flavor.gameplayHint}
          </p>
        </div>
      ))}
    </div>
  );
}
