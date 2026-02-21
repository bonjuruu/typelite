import type { Character, Ability } from "../../engine/types/index.ts";
import { computeAbilityPower } from "../../engine/modifiers.ts";
import {
  getCognitiveFunctionEssence,
  getTagDescription,
  SLOT_LABELS,
} from "../../data/index.ts";

// ============================================================
// CONSTANTS
// ============================================================

const SLOT_COLORS: Record<string, string> = {
  hero: "border-amber-600 bg-amber-950/30",
  parent: "border-blue-600 bg-blue-950/30",
  child: "border-purple-600 bg-purple-950/30",
  inferior: "border-gray-600 bg-gray-900",
};

const SLOT_DESCRIPTIONS: Record<string, string> = {
  hero: "Your dominant function — most natural, most powerful.",
  parent: "Your supporting function — responsible and reliable.",
  child: "Your playful function — creative but unpredictable.",
  inferior: "Your aspirational function — weak, but clutch under pressure.",
};

// ============================================================
// ABILITY CARD
// ============================================================

interface AbilityCardProps {
  ability: Ability;
  stats: Character["stats"];
  editMode: boolean;
  isEdited: boolean;
  onNameChange: (name: string) => void;
  onResetName: () => void;
}

export function AbilityCard({
  ability,
  stats,
  editMode,
  isEdited,
  onNameChange,
  onResetName,
}: AbilityCardProps) {
  const power = computeAbilityPower(ability, stats);
  const statValue = stats[ability.scalingStat];
  const scalingFactor = (1 + statValue / 20).toFixed(2);
  const statLabel =
    ability.scalingStat.charAt(0).toUpperCase() + ability.scalingStat.slice(1);
  const cardStyle = SLOT_COLORS[ability.slot] ?? "border-gray-600 bg-gray-900";
  const essence = getCognitiveFunctionEssence(ability.cognitiveFunction);

  return (
    <div
      className={`rounded-lg border p-3 ${cardStyle} ${isEdited ? "ring-1 ring-indigo-500/30" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase text-gray-400">
            {SLOT_LABELS[ability.slot]} &mdash; {ability.cognitiveFunction}
          </span>
          <p className="text-[11px] text-gray-500">
            {SLOT_DESCRIPTIONS[ability.slot]}
          </p>
          <p className="mt-0.5 text-[10px] italic text-indigo-400/70">
            {essence}
          </p>
          {editMode ? (
            <div className="flex items-center gap-1">
              <input
                value={ability.name}
                onChange={(e) => onNameChange(e.target.value)}
                className="rounded border border-gray-600 bg-gray-900 px-1.5 py-0.5 text-sm font-bold text-gray-100 focus:border-indigo-500 focus:outline-none"
                aria-label={`Edit ${SLOT_LABELS[ability.slot]} ability name`}
              />
              {isEdited && (
                <button
                  onClick={onResetName}
                  className="text-[10px] text-gray-500 hover:text-amber-400"
                  aria-label={`Reset ${SLOT_LABELS[ability.slot]} ability name`}
                >
                  reset
                </button>
              )}
            </div>
          ) : (
            <h5 className="text-sm font-bold text-gray-100">{ability.name}</h5>
          )}
        </div>
        <span
          className="group relative cursor-help"
          tabIndex={0}
          role="button"
          aria-label={`${ability.name} power breakdown`}
        >
          <span className="rounded bg-gray-700 px-2 py-0.5 text-xs font-bold text-gray-200">
            {power}
          </span>
          <span className="pointer-events-none absolute right-0 top-full z-10 mt-1.5 w-52 rounded bg-gray-950 px-2.5 py-2 text-[11px] leading-relaxed text-gray-400 opacity-0 shadow-lg ring-1 ring-gray-700 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <span className="block text-gray-300">
              Base: {ability.basePower}{" "}
              <span className="text-gray-500">
                (innate to {ability.cognitiveFunction}{" "}
                {SLOT_LABELS[ability.slot]})
              </span>
            </span>
            <span className="block text-gray-300">
              Scaling: 1 + {statValue}/20 = {scalingFactor}{" "}
              <span className="text-gray-500">(from {statLabel})</span>
            </span>
            <span className="mt-1 block border-t border-gray-800 pt-1 text-gray-500">
              {ability.basePower} &times; {scalingFactor} ={" "}
              <span className="font-bold text-gray-200">{power}</span>
            </span>
          </span>
        </span>
      </div>
      <p className="mt-1 text-xs text-gray-400">{ability.description}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {ability.tags.map((tag) => (
          <span
            key={tag}
            className="group/tag relative cursor-help rounded-full bg-gray-700/60 px-2 py-0.5 text-[10px] text-gray-400"
            tabIndex={0}
            role="button"
            aria-label={`${tag} tag description`}
          >
            {tag}
            <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 w-44 -translate-x-1/2 rounded bg-gray-950 px-2 py-1.5 text-[10px] leading-relaxed text-gray-400 opacity-0 shadow-lg ring-1 ring-gray-700 transition-opacity group-hover/tag:opacity-100 group-focus-within/tag:opacity-100">
              {getTagDescription(tag)}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
