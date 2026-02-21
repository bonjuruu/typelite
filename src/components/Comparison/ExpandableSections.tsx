import { useMemo } from "react";
import type { CharacterDiff, ComparisonSlot } from "../../types/comparison.ts";
import { generateSystemInsights } from "../../engine/insights.ts";
import { ExpandablePanel } from "./ExpandablePanel.tsx";
import { CombatDetailsContent } from "./CombatDetailsContent.tsx";
import { PassivesContent } from "./PassivesContent.tsx";
import { InsightsContent } from "./InsightsContent.tsx";

// ============================================================
// EXPANDABLE SECTIONS (container)
// ============================================================

interface ExpandableSectionsProps {
  slotA: ComparisonSlot;
  slotB: ComparisonSlot;
  diff: CharacterDiff;
}

export function ExpandableSections({
  slotA,
  slotB,
  diff,
}: ExpandableSectionsProps) {
  const combatDiffCount = [
    diff.sameActivation,
    diff.samePositioning,
    diff.sameRegenSource,
  ].filter((same) => !same).length;
  const { passiveDiff } = diff;
  const passiveUniqueCount =
    passiveDiff.uniqueToA.length + passiveDiff.uniqueToB.length;
  const passiveTotalCount =
    passiveDiff.sharedNameList.length + passiveUniqueCount;
  const insightsA = useMemo(
    () => generateSystemInsights(slotA.character),
    [slotA.character],
  );
  const insightsB = useMemo(
    () => generateSystemInsights(slotB.character),
    [slotB.character],
  );
  const insightTotalCount = insightsA.length + insightsB.length;

  return (
    <div className="border-t border-gray-800">
      <ExpandablePanel
        title="Combat Details"
        teaser={combatDiffCount > 0 ? `${combatDiffCount} differ` : "all match"}
        accentColor={combatDiffCount > 0 ? "amber" : "gray"}
      >
        <CombatDetailsContent slotA={slotA} slotB={slotB} diff={diff} />
      </ExpandablePanel>

      {passiveTotalCount > 0 && (
        <ExpandablePanel
          title="Passives"
          teaser={
            passiveUniqueCount > 0
              ? `${passiveUniqueCount} unique`
              : `${passiveTotalCount} shared`
          }
          accentColor={passiveUniqueCount > 0 ? "amber" : "gray"}
        >
          <PassivesContent diff={diff} />
        </ExpandablePanel>
      )}

      {insightTotalCount > 0 && (
        <ExpandablePanel
          title="Insights"
          teaser={`${insightsA.length} + ${insightsB.length}`}
          accentColor="gray"
        >
          <InsightsContent
            slotA={slotA}
            slotB={slotB}
            insightsA={insightsA}
            insightsB={insightsB}
          />
        </ExpandablePanel>
      )}
    </div>
  );
}
