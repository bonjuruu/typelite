import type { CharacterDiff, ComparisonSlot } from "../../types/comparison.ts";

// ============================================================
// QUICK DIFFS
// ============================================================

interface QuickDiffsProps {
  slotA: ComparisonSlot;
  slotB: ComparisonSlot;
  diff: CharacterDiff;
}

export function QuickDiffs({ slotA, slotB, diff }: QuickDiffsProps) {
  const chipList: { label: string; valueA: string; valueB: string }[] = [];

  if (!diff.sameArchetype) {
    chipList.push({
      label: "Archetype",
      valueA: slotA.character.archetype.className,
      valueB: slotB.character.archetype.className,
    });
  }
  if (!diff.sameElement) {
    chipList.push({
      label: "Element",
      valueA: slotA.character.element.element,
      valueB: slotB.character.element.element,
    });
  }
  if (!diff.sameQuadra) {
    chipList.push({
      label: "Quadra",
      valueA: slotA.character.element.quadra,
      valueB: slotB.character.element.quadra,
    });
  }
  if (!diff.sameOrientation) {
    chipList.push({
      label: "Orientation",
      valueA: slotA.character.combatBehavior.combatOrientation,
      valueB: slotB.character.combatBehavior.combatOrientation,
    });
  }
  if (!diff.sameActivation) {
    chipList.push({
      label: "Activation",
      valueA: slotA.character.combatBehavior.activationStyle,
      valueB: slotB.character.combatBehavior.activationStyle,
    });
  }
  if (!diff.samePositioning) {
    chipList.push({
      label: "Positioning",
      valueA: slotA.character.combatBehavior.positioning,
      valueB: slotB.character.combatBehavior.positioning,
    });
  }

  if (chipList.length === 0) {
    const matchCount = [
      diff.sameArchetype,
      diff.sameElement,
      diff.sameQuadra,
      diff.sameOrientation,
      diff.sameActivation,
      diff.samePositioning,
    ].filter(Boolean).length;
    return (
      <div className="border-t border-gray-800 px-5 py-3">
        <p className="text-xs text-gray-500">
          Identical across all {matchCount} traits (archetype, element, quadra,
          orientation, activation, positioning).
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-800 px-5 py-3">
      <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
        Differences
        <span className="ml-1.5 font-normal text-gray-600">
          {chipList.length} of 6
        </span>
      </h4>
      <div className="flex flex-wrap gap-2">
        {chipList.map(({ label, valueA, valueB }) => (
          <div
            key={label}
            className="rounded-md border border-gray-700 bg-gray-800/60 px-2.5 py-1.5"
          >
            <span className="text-[9px] font-semibold uppercase text-gray-500">
              {label}
            </span>
            <p className="text-xs text-gray-300">
              <span className="mr-0.5 text-[9px] font-bold text-indigo-400/60">
                A
              </span>
              <span className="text-indigo-300">{valueA}</span>
              <span className="mx-1.5 text-gray-600">&rarr;</span>
              <span className="mr-0.5 text-[9px] font-bold text-amber-400/60">
                B
              </span>
              <span className="text-amber-300">{valueB}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
