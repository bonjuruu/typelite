import type { CharacterDiff, ComparisonSlot } from "../../types/comparison.ts";

// ============================================================
// COMBAT DETAILS
// ============================================================

interface CombatDetailsContentProps {
  slotA: ComparisonSlot;
  slotB: ComparisonSlot;
  diff: CharacterDiff;
}

export function CombatDetailsContent({
  slotA,
  slotB,
  diff,
}: CombatDetailsContentProps) {
  const triadList = [
    {
      label: "Activation",
      valueA: slotA.character.combatBehavior.activationStyle,
      valueB: slotB.character.combatBehavior.activationStyle,
      same: diff.sameActivation,
    },
    {
      label: "Positioning",
      valueA: slotA.character.combatBehavior.positioning,
      valueB: slotB.character.combatBehavior.positioning,
      same: diff.samePositioning,
    },
    {
      label: "Regen Source",
      valueA: slotA.character.combatBehavior.regenSource,
      valueB: slotB.character.combatBehavior.regenSource,
      same: diff.sameRegenSource,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {triadList.map(({ label, valueA, valueB, same }) => (
          <div
            key={label}
            className={`rounded-lg border p-3 ${same ? "border-gray-700 bg-gray-800/30" : "border-amber-800/30 bg-amber-950/10"}`}
          >
            <span className="text-[9px] font-semibold uppercase text-gray-500">
              {label}
            </span>
            {same ? (
              <p className="text-xs font-medium text-gray-300">{valueA}</p>
            ) : (
              <div>
                <p className="text-xs text-indigo-300">
                  <span className="mr-0.5 text-[8px] font-bold text-indigo-400/50">
                    A
                  </span>
                  {valueA}
                </p>
                <p className="text-xs text-amber-300">
                  <span className="mr-0.5 text-[8px] font-bold text-amber-400/50">
                    B
                  </span>
                  {valueB}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-3">
          <span className="text-[9px] font-semibold uppercase text-gray-500">
            <span className="text-indigo-400/60">A</span> Realm / Center
          </span>
          <p className="text-xs text-gray-300">
            {slotA.character.combatBehavior.realm} &middot;{" "}
            {slotA.character.combatBehavior.center}
          </p>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-800/30 p-3">
          <span className="text-[9px] font-semibold uppercase text-gray-500">
            <span className="text-amber-400/60">B</span> Realm / Center
          </span>
          <p className="text-xs text-gray-300">
            {slotB.character.combatBehavior.realm} &middot;{" "}
            {slotB.character.combatBehavior.center}
          </p>
        </div>
      </div>
    </>
  );
}
