import { useState, useEffect } from "react";
import type {
  StatName,
  StatBreakdown,
  APType,
} from "../../engine/types/index.ts";
import { describeStack } from "../../data/index.ts";

// ============================================================
// CONSTANTS
// ============================================================

const STAT_TO_ASPECT: Record<StatName, string> = {
  willpower: "V",
  intelligence: "L",
  spirit: "E",
  vitality: "F",
};

// ============================================================
// HELPERS
// ============================================================

function getAspectFlavorSummary(
  baseSource: string,
  statName: StatName,
): string | null {
  if (baseSource === "Default" || baseSource.length !== 4) return null;
  const stackDetailList = describeStack(baseSource as APType);
  const detail = stackDetailList.find((d) => d.stat === statName);
  return detail?.flavor.summary ?? null;
}

function ordinalSuffix(n: number): string {
  if (n === 1) return "st";
  if (n === 2) return "nd";
  if (n === 3) return "rd";
  return "th";
}

// ============================================================
// STAT VALUE WITH BREAKDOWN TOOLTIP
// ============================================================

interface StatValueWithBreakdownProps {
  statName: StatName;
  value: number;
  breakdown: StatBreakdown;
}

export function StatValueWithBreakdown({
  statName,
  value,
  breakdown,
}: StatValueWithBreakdownProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const baseValue = breakdown.base[statName];
  const multiplier = breakdown.multipliers[statName];
  const hasOverride = breakdown.overrides?.[statName] != null;
  const overrideValue = hasOverride
    ? breakdown.overrides![statName]
    : undefined;
  const isAP = breakdown.baseSource !== "Default";

  const aspectLetter = STAT_TO_ASPECT[statName];
  const position = isAP ? breakdown.baseSource.indexOf(aspectLetter) + 1 : null;

  const positionLabel = position
    ? `${aspectLetter} in ${position}${ordinalSuffix(position)}`
    : null;
  const flavorSummary = isAP
    ? getAspectFlavorSummary(breakdown.baseSource, statName)
    : null;

  useEffect(() => {
    if (!showBreakdown) return;
    const handleClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-stat-breakdown]")) {
        setShowBreakdown(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowBreakdown(false);
    };
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showBreakdown]);

  return (
    <span
      className="group relative cursor-help"
      tabIndex={0}
      role="button"
      aria-label={`${statName} breakdown`}
      aria-expanded={showBreakdown}
      aria-haspopup="true"
      data-stat-breakdown
      onClick={(e) => {
        e.stopPropagation();
        setShowBreakdown((prev) => !prev);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          setShowBreakdown((prev) => !prev);
        }
      }}
    >
      <span className="w-8 text-right text-sm font-bold text-gray-100 inline-block">
        {value}
      </span>
      <span
        className={`absolute right-0 top-full z-10 mt-1.5 w-56 rounded bg-gray-950 px-2.5 py-2 text-[11px] leading-relaxed text-gray-400 shadow-lg ring-1 ring-gray-700 transition-opacity ${
          showBreakdown
            ? "opacity-100"
            : "pointer-events-none opacity-0 sm:group-hover:pointer-events-auto sm:group-hover:opacity-100 sm:group-focus-within:pointer-events-auto sm:group-focus-within:opacity-100"
        }`}
      >
        <span className="block text-gray-300">
          Base: {baseValue}
          {isAP && positionLabel ? (
            <span className="text-gray-500">
              {" "}
              ({positionLabel} - {breakdown.baseSource})
            </span>
          ) : (
            <span className="text-gray-500"> (default)</span>
          )}
        </span>
        {flavorSummary && (
          <span className="block text-gray-500 italic">{flavorSummary}</span>
        )}
        {multiplier != null && !hasOverride && (
          <>
            <span className="block text-gray-300">
              Scaling: &times;{multiplier}{" "}
              <span className="text-gray-500">
                ({breakdown.multiplierSource})
              </span>
            </span>
            <span className="block text-gray-500 italic">
              Scaled by your {breakdown.multiplierSource} archetype
            </span>
          </>
        )}
        {hasOverride && (
          <span className="block text-gray-300">
            Override &rarr; {overrideValue}
          </span>
        )}
        <span className="mt-1 block border-t border-gray-800 pt-1 font-bold text-gray-200">
          = {value}
        </span>
      </span>
    </span>
  );
}
