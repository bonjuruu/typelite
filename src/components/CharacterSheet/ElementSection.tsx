import type { Character, CharacterEdits, Element } from "../../engine/types/index.ts";
import { getQuadraRationale, ELEMENT_LIST, ELEMENT_EMOJI } from "../../data/index.ts";
import { SectionTitle } from "../common/SectionTitle.tsx";

// ============================================================
// ELEMENT SECTION
// ============================================================

interface ElementSectionProps {
  character: Character;
  editMode: boolean;
  characterEdits: CharacterEdits;
  onUpdateEdit: <K extends keyof CharacterEdits>(
    key: K,
    value: CharacterEdits[K],
  ) => void;
}

export function ElementSection({
  character,
  editMode,
  characterEdits,
  onUpdateEdit,
}: ElementSectionProps) {
  const { element } = character;
  const hasSocionics = character.activeSystems.includes("socionics");
  const rationale = hasSocionics ? getQuadraRationale(element.quadra) : null;
  const elementIsEdited = characterEdits.element !== null;

  return (
    <div>
      <SectionTitle>Element</SectionTitle>
      <div
        className={`rounded-lg border border-gray-700 bg-gray-800 p-4 ${elementIsEdited ? "ring-1 ring-indigo-500/30" : ""}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{ELEMENT_EMOJI[element.element]}</span>
          <div>
            {editMode ? (
              <div className="flex items-center gap-2">
                <select
                  value={element.element}
                  onChange={(e) =>
                    onUpdateEdit("element", e.target.value as Element)
                  }
                  className="rounded border border-gray-600 bg-gray-900 px-2 py-1 font-bold text-gray-100 focus:border-indigo-500 focus:outline-none"
                  aria-label="Select element"
                >
                  {ELEMENT_LIST.map((el) => (
                    <option key={el} value={el}>
                      {el}
                    </option>
                  ))}
                </select>
                {elementIsEdited && (
                  <button
                    onClick={() => onUpdateEdit("element", null)}
                    className="text-[10px] text-gray-500 hover:text-amber-400"
                    aria-label="Reset element"
                  >
                    reset
                  </button>
                )}
              </div>
            ) : (
              <h4 className="font-bold text-gray-100">{element.element}</h4>
            )}
            <p className="text-sm text-gray-400">{element.quadra} quadra</p>
            {rationale && (
              <span className="block mt-0.5 text-xs italic text-gray-500">
                {rationale}
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 rounded border border-gray-700 bg-gray-900 p-3">
          <span className="text-xs font-semibold uppercase text-gray-500">
            Passive - {element.passiveTrait.name}
          </span>
          <p className="mt-1 text-sm text-gray-300">
            {element.passiveTrait.description}
          </p>
        </div>
      </div>
    </div>
  );
}
