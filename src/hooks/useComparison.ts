import { useState, useMemo } from "react";
import type { Character } from "../engine/types/index.ts";
import { computeCharacterDiff } from "../engine/comparison.ts";
import type { CharacterDiff } from "../types/comparison.ts";

export type { ComparisonSlot } from "../types/comparison.ts";
import type { ComparisonSlot } from "../types/comparison.ts";

// ============================================================
// HOOK
// ============================================================

export function useComparison() {
  const [slotA, setSlotA] = useState<ComparisonSlot | null>(null);
  const [slotB, setSlotB] = useState<ComparisonSlot | null>(null);

  const saveToSlot = (slot: "A" | "B", character: Character, name: string) => {
    const snapshot: ComparisonSlot = {
      character: structuredClone(character),
      name,
    };
    if (slot === "A") setSlotA(snapshot);
    else setSlotB(snapshot);
  };

  const saveToNextSlot = (character: Character, name: string) => {
    if (!slotA) {
      saveToSlot("A", character, name);
    } else if (!slotB) {
      saveToSlot("B", character, name);
    } else {
      // Both full — replace B
      saveToSlot("B", character, name);
    }
  };

  const clearSlot = (slot: "A" | "B") => {
    if (slot === "A") setSlotA(null);
    else setSlotB(null);
  };

  const clearAll = () => {
    setSlotA(null);
    setSlotB(null);
  };

  const diff: CharacterDiff | null = useMemo(() => {
    if (!slotA || !slotB) return null;
    return computeCharacterDiff(slotA.character, slotB.character);
  }, [slotA, slotB]);

  return {
    slotA,
    slotB,
    diff,
    saveToSlot,
    saveToNextSlot,
    clearSlot,
    clearAll,
  };
}
