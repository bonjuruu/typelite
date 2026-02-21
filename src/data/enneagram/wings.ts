import type { EnneagramNumber } from "../../engine/types/index.ts";
import { ENNEAGRAM_TYPES } from "./types.ts";

// ============================================================
// WING LABELS
// ============================================================

/** Subclass flavor a wing adds to the base class. */
export const WING_LABELS: Record<EnneagramNumber, string> = {
  1: "Principled",
  2: "Compassionate",
  3: "Ambitious",
  4: "Expressive",
  5: "Cerebral",
  6: "Vigilant",
  7: "Chaotic",
  8: "Fierce",
  9: "Serene",
};

// ============================================================
// WING FLAVOR
// ============================================================

interface WingFlavor {
  label: string;
  description: string;
}

const WING_FLAVOR: Record<EnneagramNumber, WingFlavor> = {
  1: {
    label: "Principled",
    description:
      "Adds rigorous structure and moral clarity — every action is measured against an internal code.",
  },
  2: {
    label: "Compassionate",
    description:
      "Softens edges with warmth and generosity — power is wielded in service of connection.",
  },
  3: {
    label: "Ambitious",
    description:
      "Injects competitive drive and image-consciousness — success becomes both goal and armor.",
  },
  4: {
    label: "Expressive",
    description:
      "Deepens emotional intensity and aesthetic vision — combat becomes an art form.",
  },
  5: {
    label: "Cerebral",
    description:
      "Withdraws into analysis and resource hoarding — knowledge is weaponized with precision.",
  },
  6: {
    label: "Vigilant",
    description:
      "Heightens threat detection and preparedness — every scenario has been war-gamed.",
  },
  7: {
    label: "Chaotic",
    description:
      "Embraces spontaneity and possibility — constraint is the only true enemy.",
  },
  8: {
    label: "Fierce",
    description:
      "Amplifies raw intensity and dominance — power flows without hesitation or apology.",
  },
  9: {
    label: "Serene",
    description:
      "Mellows conflict with acceptance and calm — battles are won through endurance, not force.",
  },
};

/** Get the flavor text for a wing type. */
export function getWingFlavor(wing: EnneagramNumber): WingFlavor {
  return WING_FLAVOR[wing];
}

/** Get the valid wings for a given enneagram type. */
export function getWings(
  type: EnneagramNumber,
): [EnneagramNumber, EnneagramNumber] {
  return ENNEAGRAM_TYPES[type].wings;
}
