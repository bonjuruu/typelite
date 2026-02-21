import { useState, useEffect } from "react";
import type {
  Character,
  StatName,
  CharacterEdits,
} from "../../engine/types/index.ts";
import { isStatBudgetValid } from "../../engine/editLayer.ts";
import { STAT_CONFIG } from "../../data/stats.ts";
import { MAX_STAT } from "../../engine/modifiers.ts";
import { SectionTitle } from "../common/SectionTitle.tsx";
import { StatBudgetIndicator } from "./StatBudgetIndicator.tsx";
import { StatValueWithBreakdown } from "./StatValueWithBreakdown.tsx";

// ============================================================
// STATS SECTION
// ============================================================

interface StatsSectionProps {
  character: Character;
  rawCharacter: Character | null;
  editMode: boolean;
  characterEdits: CharacterEdits;
  onUpdateEdit: <K extends keyof CharacterEdits>(
    key: K,
    value: CharacterEdits[K],
  ) => void;
}

export function StatsSection({
  character,
  rawCharacter,
  editMode,
  characterEdits,
  onUpdateEdit,
}: StatsSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const originalStats = rawCharacter?.stats ?? character.stats;
  const isEdited = characterEdits.stats !== null;

  const handleStatChange = (statName: StatName, delta: number) => {
    const currentValue = character.stats[statName];
    const newValue = Math.max(1, Math.min(20, currentValue + delta));
    if (newValue === currentValue) return;
    const newStats = { ...(characterEdits.stats ?? {}), [statName]: newValue };
    const previewStats = { ...character.stats, [statName]: newValue };
    if (!isStatBudgetValid(originalStats, previewStats)) return;
    onUpdateEdit("stats", newStats);
  };

  const resetStat = (statName: StatName) => {
    if (!characterEdits.stats) return;
    const rest = Object.fromEntries(
      Object.entries(characterEdits.stats).filter(([key]) => key !== statName),
    );
    onUpdateEdit("stats", Object.keys(rest).length > 0 ? rest : null);
  };

  return (
    <div>
      <SectionTitle>Stats</SectionTitle>
      <div className="space-y-2">
        {STAT_CONFIG.map(({ key, label, tailwindColor }) => {
          const value = character.stats[key];
          const percentage = Math.min((value / MAX_STAT) * 100, 100);
          const statIsEdited = characterEdits.stats?.[key] !== undefined;
          return (
            <div
              key={key}
              className={`flex items-center gap-3 ${statIsEdited ? "rounded-md ring-1 ring-indigo-500/30 px-1 -mx-1" : ""}`}
            >
              <span className="w-20 text-sm font-medium text-gray-300 sm:w-24">
                {label}
              </span>
              {editMode && (
                <button
                  onClick={() => handleStatChange(key, -1)}
                  className="rounded bg-gray-700 px-1.5 py-0.5 text-xs font-bold text-gray-300 hover:bg-gray-600 disabled:opacity-30"
                  disabled={value <= 1}
                  aria-label={`Decrease ${label}`}
                >
                  -
                </button>
              )}
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-700">
                <div
                  className={`h-full rounded-full ${tailwindColor} transition-[width] duration-600 ease-out`}
                  style={{ width: mounted ? `${percentage}%` : "0%" }}
                />
              </div>
              {editMode && (
                <button
                  onClick={() => handleStatChange(key, 1)}
                  className="rounded bg-gray-700 px-1.5 py-0.5 text-xs font-bold text-gray-300 hover:bg-gray-600 disabled:opacity-30"
                  disabled={value >= 20}
                  aria-label={`Increase ${label}`}
                >
                  +
                </button>
              )}
              <StatValueWithBreakdown
                statName={key}
                value={value}
                breakdown={character.statBreakdown}
              />
              {editMode && statIsEdited && (
                <button
                  onClick={() => resetStat(key)}
                  className="text-[10px] text-gray-500 hover:text-amber-400"
                  aria-label={`Reset ${label}`}
                >
                  reset
                </button>
              )}
            </div>
          );
        })}
      </div>
      {editMode && (
        <StatBudgetIndicator
          originalStats={originalStats}
          currentStats={character.stats}
          isEdited={isEdited}
        />
      )}
    </div>
  );
}
