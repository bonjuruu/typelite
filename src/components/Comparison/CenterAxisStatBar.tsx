import { MAX_STAT } from "../../engine/modifiers.ts";

// ============================================================
// CENTER-AXIS STAT BAR
// ============================================================

interface CenterAxisStatBarProps {
  label: string;
  valueA: number;
  valueB: number;
}

export function CenterAxisStatBar({
  label,
  valueA,
  valueB,
}: CenterAxisStatBarProps) {
  const pctA = (valueA / MAX_STAT) * 100;
  const pctB = (valueB / MAX_STAT) * 100;
  const delta = valueB - valueA;
  const aWins = valueA > valueB;
  const bWins = valueB > valueA;
  const tied = valueA === valueB;

  return (
    <div className="flex items-center gap-0">
      {/* A value */}
      <span
        className={`w-7 shrink-0 text-right font-mono text-xs font-semibold tabular-nums ${
          aWins ? "text-indigo-300" : tied ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {valueA}
      </span>

      {/* A bar — grows right-to-left from center */}
      <div
        className="relative h-2.5 flex-1 overflow-hidden rounded-l-sm bg-gray-800/50"
        aria-label={`A: ${valueA}`}
      >
        <div
          className="comparison-stat-bar absolute inset-y-0 right-0 rounded-l-sm"
          style={{
            width: `${pctA}%`,
            background: aWins
              ? "linear-gradient(to left, rgb(129 140 248), rgb(99 102 241 / 0.5))"
              : "linear-gradient(to left, rgb(129 140 248 / 0.4), rgb(99 102 241 / 0.15))",
            boxShadow: aWins ? "0 0 8px rgb(129 140 248 / 0.3)" : "none",
          }}
        />
        {aWins && (
          <span className="absolute inset-y-0 right-1 flex items-center text-[8px] font-bold text-indigo-200/60">
            A
          </span>
        )}
      </div>

      {/* Center label + delta */}
      <div className="flex w-16 shrink-0 flex-col items-center justify-center">
        <span className="text-[10px] font-bold text-gray-400">{label}</span>
        {!tied && (
          <span
            className={`font-mono text-[9px] font-bold tabular-nums leading-none ${
              bWins ? "text-amber-400/80" : "text-indigo-400/80"
            }`}
          >
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>

      {/* B bar — grows left-to-right from center */}
      <div
        className="relative h-2.5 flex-1 overflow-hidden rounded-r-sm bg-gray-800/50"
        aria-label={`B: ${valueB}`}
      >
        <div
          className="comparison-stat-bar absolute inset-y-0 left-0 rounded-r-sm"
          style={{
            width: `${pctB}%`,
            background: bWins
              ? "linear-gradient(to right, rgb(251 191 36), rgb(245 158 11 / 0.5))"
              : "linear-gradient(to right, rgb(251 191 36 / 0.4), rgb(245 158 11 / 0.15))",
            boxShadow: bWins ? "0 0 8px rgb(251 191 36 / 0.3)" : "none",
          }}
        />
        {bWins && (
          <span className="absolute inset-y-0 left-1 flex items-center text-[8px] font-bold text-amber-200/60">
            B
          </span>
        )}
      </div>

      {/* B value */}
      <span
        className={`w-7 shrink-0 text-left font-mono text-xs font-semibold tabular-nums ${
          bWins ? "text-amber-300" : tied ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {valueB}
      </span>
    </div>
  );
}
