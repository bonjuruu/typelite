// ============================================================
// STAT SUMMARY
// ============================================================

interface StatSummaryProps {
  totalA: number;
  totalB: number;
  winsA: number;
  winsB: number;
}

export function StatSummary({
  totalA,
  totalB,
  winsA,
  winsB,
}: StatSummaryProps) {
  const totalDelta = totalA - totalB;
  const tied = totalDelta === 0;

  return (
    <div className="mt-3 flex items-center justify-between border-t border-gray-800/50 pt-2.5">
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] tabular-nums text-gray-500">
          {totalA} total
        </span>
        {winsA > 0 && (
          <span className="rounded bg-indigo-950/40 px-1.5 py-0.5 text-[9px] font-bold text-indigo-400">
            {winsA}W
          </span>
        )}
      </div>
      <div className="text-center">
        {tied ? (
          <span className="text-[10px] font-medium text-gray-600">Even</span>
        ) : (
          <span
            className={`font-mono text-[10px] font-bold tabular-nums ${totalDelta > 0 ? "text-indigo-400" : "text-amber-400"}`}
          >
            {totalDelta > 0 ? "A" : "B"} +{Math.abs(totalDelta)} total
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {winsB > 0 && (
          <span className="rounded bg-amber-950/40 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">
            {winsB}W
          </span>
        )}
        <span className="font-mono text-[10px] tabular-nums text-gray-500">
          {totalB} total
        </span>
      </div>
    </div>
  );
}
