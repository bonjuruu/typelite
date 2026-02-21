import type { Character, CharacterEdits } from "../../engine/types/index.ts";
import { getTriadDescription } from "../../data/index.ts";
import { SectionTitle } from "../common/SectionTitle.tsx";
import { CombatField } from "./CombatField.tsx";

// ============================================================
// CONSTANTS
// ============================================================

const COMBAT_ORIENTATION_LIST = ["Frontline", "Support", "Strategist"];

// ============================================================
// COMBAT SECTION
// ============================================================

interface CombatSectionProps {
  character: Character;
  editMode: boolean;
  characterEdits: CharacterEdits;
  onUpdateEdit: <K extends keyof CharacterEdits>(
    key: K,
    value: CharacterEdits[K],
  ) => void;
}

export function CombatSection({
  character,
  editMode,
  characterEdits,
  onUpdateEdit,
}: CombatSectionProps) {
  const { combatBehavior } = character;
  const orientationIsEdited = characterEdits.combatOrientation !== null;

  return (
    <div>
      <SectionTitle>Combat Behavior</SectionTitle>
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
          {editMode ? (
            <div
              className={
                orientationIsEdited
                  ? "rounded ring-1 ring-indigo-500/30 p-1 -m-1"
                  : ""
              }
            >
              <span className="text-xs text-gray-500">Orientation</span>
              <div className="flex items-center gap-2">
                <select
                  value={combatBehavior.combatOrientation}
                  onChange={(e) =>
                    onUpdateEdit("combatOrientation", e.target.value)
                  }
                  className="rounded border border-gray-600 bg-gray-900 px-2 py-0.5 font-medium text-gray-200 focus:border-indigo-500 focus:outline-none"
                  aria-label="Select combat orientation"
                >
                  {COMBAT_ORIENTATION_LIST.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                {orientationIsEdited && (
                  <button
                    onClick={() => onUpdateEdit("combatOrientation", null)}
                    className="text-[10px] text-gray-500 hover:text-amber-400"
                    aria-label="Reset combat orientation"
                  >
                    reset
                  </button>
                )}
              </div>
            </div>
          ) : (
            <CombatField
              label="Orientation"
              value={combatBehavior.combatOrientation}
            />
          )}
          <CombatField
            label="Activation"
            value={combatBehavior.activationStyle}
            hint={getTriadDescription(
              "experiential",
              combatBehavior.activationStyle,
            )}
          />
          <CombatField
            label="Positioning"
            value={combatBehavior.positioning}
            hint={getTriadDescription("movement", combatBehavior.positioning)}
          />
          <CombatField
            label="Regen Source"
            value={combatBehavior.regenSource}
            hint={getTriadDescription("source", combatBehavior.regenSource)}
          />
        </div>
        {combatBehavior.passives.length > 0 && (
          <div className="mt-3 space-y-2">
            <span className="text-xs font-semibold uppercase text-gray-500">
              Passives
            </span>
            {combatBehavior.passives.map((passive) => {
              const isSecondary = passive.source.startsWith("2nd fix");
              const isTertiary = passive.source.startsWith("3rd fix");
              const isFixPassive = isSecondary || isTertiary;
              return (
                <div
                  key={passive.name + passive.source}
                  className={`rounded border p-2 ${isFixPassive ? "border-gray-700/50 bg-gray-900/50" : "border-gray-700 bg-gray-900"}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${isFixPassive ? "text-gray-400" : "text-gray-200"}`}
                    >
                      {passive.name}
                    </span>
                    {isFixPassive && (
                      <span className="text-[10px] text-gray-600">
                        {isSecondary ? "2nd fix" : "3rd fix"}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-xs ${isFixPassive ? "text-gray-600" : "text-gray-500"}`}
                  >
                    {passive.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
