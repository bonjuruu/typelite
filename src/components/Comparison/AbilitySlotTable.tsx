import type {
  CharacterDiff,
  AbilityComparison,
} from "../../types/comparison.ts";
import { SLOT_LABELS } from "../../data/index.ts";

// ============================================================
// ABILITY SLOT TABLE
// ============================================================

export function AbilitySlotTable({ diff }: { diff: CharacterDiff }) {
  return (
    <div className="border-t border-gray-800 px-5 py-4">
      <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
        Abilities
      </h4>
      {/* Desktop: dense row layout */}
      <div className="hidden space-y-1 sm:block">
        {diff.abilityComparisonList.map((ac) => (
          <AbilityRowDesktop
            key={ac.cognitiveFunction}
            comparison={ac}
            powerDiff={diff.abilityPowerDiffMap[ac.cognitiveFunction]}
          />
        ))}
      </div>
      {/* Mobile: stacked card layout */}
      <div className="space-y-2 sm:hidden">
        {diff.abilityComparisonList.map((ac) => (
          <AbilityRowMobile
            key={ac.cognitiveFunction}
            comparison={ac}
            powerDiff={diff.abilityPowerDiffMap[ac.cognitiveFunction]}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// DESKTOP ROW
// ============================================================

function AbilityRowDesktop({
  comparison,
  powerDiff,
}: {
  comparison: AbilityComparison;
  powerDiff?: { powerA: number; powerB: number };
}) {
  const isShared = comparison.slotA != null && comparison.slotB != null;
  const isUniqueToA = comparison.slotA != null && comparison.slotB == null;
  const isUniqueToB = comparison.slotA == null && comparison.slotB != null;

  return (
    <div className="flex items-center gap-2 rounded bg-gray-800/40 px-3 py-1.5 text-xs">
      <span className="w-6 shrink-0 font-bold text-indigo-400">
        {comparison.cognitiveFunction}
      </span>

      <div className="w-18 shrink-0 text-gray-400">
        {comparison.slotA ? (
          SLOT_LABELS[comparison.slotA]
        ) : (
          <span className="text-gray-700">&mdash;</span>
        )}
      </div>

      {isShared && comparison.slotA !== comparison.slotB ? (
        <span className="shrink-0 text-amber-500">&rarr;</span>
      ) : (
        <span className="shrink-0 text-gray-700">&rarr;</span>
      )}

      <div className="w-18 shrink-0 text-gray-400">
        {comparison.slotB ? (
          SLOT_LABELS[comparison.slotB]
        ) : (
          <span className="text-gray-700">&mdash;</span>
        )}
      </div>

      <div className="min-w-0 flex-1 truncate text-gray-300">
        {isShared && (
          <>
            <span className="text-gray-200">{comparison.nameA}</span>
            {comparison.nameA !== comparison.nameB && (
              <>
                <span className="mx-1 text-gray-600">&rarr;</span>
                <span className="text-gray-200">{comparison.nameB}</span>
              </>
            )}
          </>
        )}
        {isUniqueToA && (
          <span className="text-indigo-300/70">
            unique to A &middot; {comparison.nameA}
          </span>
        )}
        {isUniqueToB && (
          <span className="text-amber-300/70">
            unique to B &middot; {comparison.nameB}
          </span>
        )}
      </div>

      {powerDiff && (
        <div className="shrink-0 text-right font-mono tabular-nums">
          <span className="text-gray-500">{powerDiff.powerA}</span>
          <span className="mx-0.5 text-gray-700">/</span>
          <span className="text-gray-500">{powerDiff.powerB}</span>
          {powerDiff.powerA !== powerDiff.powerB && (
            <span
              className={`ml-1 ${powerDiff.powerB > powerDiff.powerA ? "text-green-400" : "text-red-400"}`}
            >
              {powerDiff.powerB > powerDiff.powerA ? "+" : ""}
              {powerDiff.powerB - powerDiff.powerA}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// MOBILE ROW
// ============================================================

function AbilityRowMobile({
  comparison,
  powerDiff,
}: {
  comparison: AbilityComparison;
  powerDiff?: { powerA: number; powerB: number };
}) {
  const isShared = comparison.slotA != null && comparison.slotB != null;
  const isUniqueToA = comparison.slotA != null && comparison.slotB == null;
  const isUniqueToB = comparison.slotA == null && comparison.slotB != null;

  return (
    <div className="rounded-md bg-gray-800/40 px-3 py-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-indigo-400">
          {comparison.cognitiveFunction}
        </span>
        {powerDiff && (
          <span className="font-mono tabular-nums text-gray-500">
            {powerDiff.powerA}/{powerDiff.powerB}
            {powerDiff.powerA !== powerDiff.powerB && (
              <span
                className={`ml-1 ${powerDiff.powerB > powerDiff.powerA ? "text-green-400" : "text-red-400"}`}
              >
                {powerDiff.powerB > powerDiff.powerA ? "+" : ""}
                {powerDiff.powerB - powerDiff.powerA}
              </span>
            )}
          </span>
        )}
      </div>
      {isShared && (
        <div className="mt-1 flex items-center gap-1.5 text-gray-400">
          <span className="text-[9px] font-bold text-indigo-400/50">A</span>
          <span>{SLOT_LABELS[comparison.slotA!]}</span>
          <span className="text-gray-200">{comparison.nameA}</span>
          {(comparison.slotA !== comparison.slotB ||
            comparison.nameA !== comparison.nameB) && (
            <>
              <span className="text-amber-500">&rarr;</span>
              <span className="text-[9px] font-bold text-amber-400/50">B</span>
              <span>{SLOT_LABELS[comparison.slotB!]}</span>
              <span className="text-gray-200">{comparison.nameB}</span>
            </>
          )}
        </div>
      )}
      {isUniqueToA && (
        <p className="mt-1 text-indigo-300/70">
          <span className="text-[9px] font-bold text-indigo-400/50">A</span>{" "}
          {SLOT_LABELS[comparison.slotA!]} &middot; {comparison.nameA}
        </p>
      )}
      {isUniqueToB && (
        <p className="mt-1 text-amber-300/70">
          <span className="text-[9px] font-bold text-amber-400/50">B</span>{" "}
          {SLOT_LABELS[comparison.slotB!]} &middot; {comparison.nameB}
        </p>
      )}
    </div>
  );
}
