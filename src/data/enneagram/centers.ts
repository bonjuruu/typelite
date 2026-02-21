import type { EnneagramNumber } from "../../engine/types/index.ts";

// ============================================================
// CENTERS (for tritype)
// ============================================================

export type EnneagramCenter = "Gut" | "Heart" | "Head";

const TYPE_TO_CENTER: Record<EnneagramNumber, EnneagramCenter> = {
  8: "Gut",
  9: "Gut",
  1: "Gut",
  2: "Heart",
  3: "Heart",
  4: "Heart",
  5: "Head",
  6: "Head",
  7: "Head",
};

export const CENTER_TYPES: Record<
  EnneagramCenter,
  readonly EnneagramNumber[]
> = {
  Gut: [8, 9, 1],
  Heart: [2, 3, 4],
  Head: [5, 6, 7],
};

export const CENTER_LIST: readonly EnneagramCenter[] = [
  "Gut",
  "Heart",
  "Head",
] as const;

/** Get the center a type belongs to. */
export function getCenter(type: EnneagramNumber): EnneagramCenter {
  return TYPE_TO_CENTER[type];
}
