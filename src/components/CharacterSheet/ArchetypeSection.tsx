import type {
  Character,
  StatName,
  CharacterEdits,
} from "../../engine/types/index.ts";
import { getArchetypePassiveList } from "../../engine/types/index.ts";
import { getWingFlavor } from "../../data/index.ts";
import { SectionTitle } from "../common/SectionTitle.tsx";
import { StatusEffectCard } from "./StatusEffectCard.tsx";

// ============================================================
// ARCHETYPE SECTION
// ============================================================

interface ArchetypeSectionProps {
  character: Character;
  editMode: boolean;
  characterEdits: CharacterEdits;
  onUpdateEdit: <K extends keyof CharacterEdits>(
    key: K,
    value: CharacterEdits[K],
  ) => void;
}

export function ArchetypeSection({
  character,
  editMode,
  characterEdits,
  onUpdateEdit,
}: ArchetypeSectionProps) {
  const { archetype } = character;
  const hasEnneagram = character.activeSystems.includes("enneagram");
  const wingFlavor = hasEnneagram
    ? getWingFlavor(archetype.wing as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9)
    : null;
  const classNameIsEdited = characterEdits.className !== null;

  return (
    <div>
      <SectionTitle>Archetype</SectionTitle>
      <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
        {editMode ? (
          <div
            className={`flex items-center gap-2 ${classNameIsEdited ? "rounded ring-1 ring-indigo-500/30 p-1 -m-1" : ""}`}
          >
            <input
              value={archetype.className}
              onChange={(e) =>
                onUpdateEdit("className", e.target.value || null)
              }
              className="rounded border border-gray-600 bg-gray-900 px-2 py-1 text-lg font-bold text-gray-100 focus:border-indigo-500 focus:outline-none"
              aria-label="Edit class name"
            />
            {classNameIsEdited && (
              <button
                onClick={() => onUpdateEdit("className", null)}
                className="text-[10px] text-gray-500 hover:text-amber-400"
                aria-label="Reset class name"
              >
                reset
              </button>
            )}
          </div>
        ) : (
          <h4 className="text-lg font-bold text-gray-100">
            {archetype.className}
          </h4>
        )}
        {wingFlavor && (
          <p className="mt-1 text-xs text-indigo-400/80">
            Wing {archetype.wing} ({wingFlavor.label}): {wingFlavor.description}
          </p>
        )}
        <p className="mt-1 text-sm text-gray-400">{archetype.description}</p>
        {getArchetypePassiveList(archetype).length > 0 && (
          <div className="mt-2 space-y-1">
            {getArchetypePassiveList(archetype).map((passive) => {
              const isSecondary = passive.source.startsWith("2nd instinct");
              const isTertiary = passive.source.startsWith("3rd instinct");
              const isStackedPassive = isSecondary || isTertiary;

              if (isTertiary) {
                return (
                  <div
                    key={passive.name + passive.source}
                    className="rounded border border-red-800/30 bg-red-950/10 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-red-400">
                        {passive.name}
                      </span>
                      <span className="text-[10px] font-semibold text-red-600">
                        BLIND SPOT
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {passive.description} — This instinct is your weakest
                      area, providing minimal benefit.
                    </p>
                  </div>
                );
              }

              return (
                <div
                  key={passive.name + passive.source}
                  className={`rounded border p-2 ${isStackedPassive ? "border-indigo-800/30 bg-indigo-950/10" : "border-indigo-800/50 bg-indigo-950/20"}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${isStackedPassive ? "text-indigo-500" : "text-indigo-400"}`}
                    >
                      {passive.name}
                    </span>
                    {isSecondary && (
                      <span className="text-[10px] text-gray-600">2nd</span>
                    )}
                  </div>
                  <p
                    className={`text-xs ${isStackedPassive ? "text-gray-600" : "text-gray-500"}`}
                  >
                    {passive.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        {archetype.statBlendChain && archetype.statBlendChain.length > 1 && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs font-semibold uppercase text-gray-500">
              Stat Modifier Breakdown
            </summary>
            <div className="mt-2 space-y-1.5 text-xs">
              {archetype.statBlendChain.map((step, index) => {
                const modifierEntryList = Object.entries(step.modifiers) as [
                  StatName,
                  number,
                ][];
                const nonTrivialModifierList = modifierEntryList.filter(
                  ([, v]) => v !== 1,
                );
                return (
                  <div
                    key={index}
                    className="flex items-baseline gap-2 text-gray-400"
                  >
                    <span className="font-medium text-gray-300">
                      {step.source}
                    </span>
                    <span className="text-gray-600">
                      ({Math.round(step.influence * 100)}%)
                    </span>
                    {nonTrivialModifierList.length > 0 && (
                      <span className="text-gray-500">
                        {nonTrivialModifierList
                          .map(([stat, val]) => `${stat}: x${val}`)
                          .join(", ")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </details>
        )}
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatusEffectCard
            label="Empowered"
            name={archetype.empoweredState.name}
            description={archetype.empoweredState.description}
            variant="positive"
            lineContext={archetype.integrationLine}
          />
          <StatusEffectCard
            label="Stressed"
            name={archetype.stressedState.name}
            description={archetype.stressedState.description}
            variant="negative"
            lineContext={archetype.disintegrationLine}
          />
        </div>
      </div>
    </div>
  );
}
