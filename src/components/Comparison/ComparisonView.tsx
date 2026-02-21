import type { CharacterDiff, ComparisonSlot } from "../../types/comparison.ts";
import { VersusHeader } from "./VersusHeader.tsx";
import { STAT_CONFIG } from "../../data/stats.ts";
import { CenterAxisStatBar } from "./CenterAxisStatBar.tsx";
import { StatSummary } from "./StatSummary.tsx";
import { TypologySources } from "./TypologySources.tsx";
import { QuickDiffs } from "./QuickDiffs.tsx";
import { AbilitySlotTable } from "./AbilitySlotTable.tsx";
import { ExpandableSections } from "./ExpandableSections.tsx";

// ============================================================
// PROPS
// ============================================================

interface ComparisonViewProps {
  slotA: ComparisonSlot | null;
  slotB: ComparisonSlot | null;
  diff: CharacterDiff | null;
  onClearSlot: (slot: "A" | "B") => void;
  onClearAll: () => void;
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function ComparisonView({
  slotA,
  slotB,
  diff,
  onClearSlot,
  onClearAll,
}: ComparisonViewProps) {
  if (!slotA && !slotB) return null;

  // Partial state — only one slot filled
  if (!slotA || !slotB || !diff) {
    const filled = slotA ?? slotB;
    const filledLabel = slotA ? "A" : "B";
    return (
      <div className="comparison-strip overflow-hidden rounded-lg border border-indigo-500/20 bg-gray-900">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-100">
                  {filled!.name}
                  <span className="ml-1.5 font-normal text-gray-500">
                    {filled!.character.archetype.className}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black tracking-tight text-gray-600">
                vs
              </span>
              <span className="rounded border border-dashed border-gray-700 px-3 py-0.5 text-xs text-gray-600">
                Waiting for slot {filledLabel === "A" ? "B" : "A"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-gray-500 sm:inline">
              Click Compare on another build
            </span>
            <button
              onClick={() => onClearSlot(filledLabel)}
              className="rounded px-2 py-1 text-[10px] font-medium text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
              aria-label={`Clear slot ${filledLabel}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full comparison
  const statTotalA = STAT_CONFIG.reduce(
    (sum, { key }) => sum + slotA.character.stats[key],
    0,
  );
  const statTotalB = STAT_CONFIG.reduce(
    (sum, { key }) => sum + slotB.character.stats[key],
    0,
  );
  const winsA = STAT_CONFIG.filter(
    ({ key }) => slotA.character.stats[key] > slotB.character.stats[key],
  ).length;
  const winsB = STAT_CONFIG.filter(
    ({ key }) => slotB.character.stats[key] > slotA.character.stats[key],
  ).length;

  return (
    <div className="comparison-strip space-y-0 overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
      <VersusHeader
        slotA={slotA}
        slotB={slotB}
        onClearSlot={onClearSlot}
        onClearAll={onClearAll}
      />
      <TypologySources slotA={slotA} slotB={slotB} />

      {/* Stat bars */}
      <div className="border-t border-gray-800 px-5 py-4">
        <div className="mb-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-600">
          <span className="text-indigo-400/60">A</span>
          <span className="text-gray-500">Stats</span>
          <span className="text-amber-400/60">B</span>
        </div>
        <div className="space-y-2">
          {STAT_CONFIG.map(({ key, shortLabel }) => (
            <CenterAxisStatBar
              key={key}
              label={shortLabel}
              valueA={slotA.character.stats[key]}
              valueB={slotB.character.stats[key]}
            />
          ))}
        </div>
        <StatSummary
          totalA={statTotalA}
          totalB={statTotalB}
          winsA={winsA}
          winsB={winsB}
        />
      </div>

      <QuickDiffs slotA={slotA} slotB={slotB} diff={diff} />
      <AbilitySlotTable diff={diff} />
      <ExpandableSections slotA={slotA} slotB={slotB} diff={diff} />
    </div>
  );
}
