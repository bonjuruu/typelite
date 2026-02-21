import { useState, useCallback } from "react";
import type { Character, CharacterEdits } from "../engine/types/index.ts";
import { EMPTY_CHARACTER_EDITS } from "../engine/types/index.ts";
import { applyEdits } from "../engine/editLayer.ts";

export function useCharacterEdits(rawCharacter: Character | null) {
  const [characterEdits, setCharacterEdits] = useState<CharacterEdits>(
    EMPTY_CHARACTER_EDITS,
  );

  const character = rawCharacter
    ? applyEdits(rawCharacter, characterEdits)
    : null;

  const updateCharacterEdit = useCallback(
    <K extends keyof CharacterEdits>(key: K, value: CharacterEdits[K]) => {
      setCharacterEdits((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetCharacterEdits = useCallback(() => {
    setCharacterEdits(EMPTY_CHARACTER_EDITS);
  }, []);

  return {
    character,
    characterEdits,
    setCharacterEdits,
    updateCharacterEdit,
    resetCharacterEdits,
  };
}
