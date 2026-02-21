import type { Character, CharacterEdits } from "../../engine/types/index.ts";
import { SectionTitle } from "../common/SectionTitle.tsx";
import { AbilityCard } from "./AbilityCard.tsx";

// ============================================================
// ABILITIES SECTION
// ============================================================

interface AbilitiesSectionProps {
  character: Character;
  editMode: boolean;
  characterEdits: CharacterEdits;
  onUpdateEdit: <K extends keyof CharacterEdits>(
    key: K,
    value: CharacterEdits[K],
  ) => void;
}

export function AbilitiesSection({
  character,
  editMode,
  characterEdits,
  onUpdateEdit,
}: AbilitiesSectionProps) {
  const handleAbilityNameChange = (slot: string, name: string) => {
    const current = characterEdits.abilityNameList ?? {};
    if (name) {
      onUpdateEdit("abilityNameList", { ...current, [slot]: name });
    } else {
      const rest = Object.fromEntries(
        Object.entries(current).filter(([key]) => key !== slot),
      );
      onUpdateEdit(
        "abilityNameList",
        Object.keys(rest).length > 0 ? rest : null,
      );
    }
  };

  const resetAbilityName = (slot: string) => {
    if (!characterEdits.abilityNameList) return;
    const rest = Object.fromEntries(
      Object.entries(characterEdits.abilityNameList).filter(([key]) => key !== slot),
    );
    onUpdateEdit("abilityNameList", Object.keys(rest).length > 0 ? rest : null);
  };

  return (
    <div>
      <SectionTitle>Abilities</SectionTitle>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {character.abilities.map((ability) => (
          <AbilityCard
            key={ability.slot}
            ability={ability}
            stats={character.stats}
            editMode={editMode}
            isEdited={
              characterEdits.abilityNameList?.[ability.slot] !== undefined
            }
            onNameChange={(name) => handleAbilityNameChange(ability.slot, name)}
            onResetName={() => resetAbilityName(ability.slot)}
          />
        ))}
      </div>
    </div>
  );
}
