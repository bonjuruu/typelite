import type {
  EnneagramNumber,
  EnneagramInstinct,
  StatName,
  PassiveTrait,
} from "../../engine/types/index.ts";
import type { EnneagramTypeData } from "./types.ts";
import { ENNEAGRAM_TYPES } from "./types.ts";

// ============================================================
// INSTINCTUAL VARIANTS (sp/so/sx)
// ============================================================

interface InstinctData {
  variant: EnneagramInstinct;
  label: string;
  fullName: string;
  statModifiers: Partial<Record<StatName, number>>;
  passive: PassiveTrait;
}

export const ENNEAGRAM_INSTINCTS: Record<EnneagramInstinct, InstinctData> = {
  sp: {
    variant: "sp",
    label: "Guardian",
    fullName: "Self-Preservation",
    statModifiers: { vitality: 1.08 },
    passive: {
      name: "Fortified",
      description: "Passively regenerates a small amount of health over time.",
      source: "Instinctual variant (sp)",
    },
  },
  so: {
    variant: "so",
    label: "Herald",
    fullName: "Social",
    statModifiers: { spirit: 1.08 },
    passive: {
      name: "Rally",
      description: "Nearby allies gain a minor stat boost when grouped.",
      source: "Instinctual variant (so)",
    },
  },
  sx: {
    variant: "sx",
    label: "Intense",
    fullName: "Sexual",
    statModifiers: { willpower: 1.08 },
    passive: {
      name: "Fixation",
      description:
        "Damage against a single target increases with consecutive hits.",
      source: "Instinctual variant (sx)",
    },
  },
};

export const INSTINCT_INFLUENCE = 0.3;

// ============================================================
// PUBLIC API
// ============================================================

export const ENNEAGRAM_TYPE_LIST: readonly EnneagramNumber[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9,
] as const;

export const ENNEAGRAM_INSTINCT_LIST: readonly EnneagramInstinct[] = [
  "sp",
  "so",
  "sx",
] as const;

/** Get the display label for an instinctual variant. */
export function getInstinctLabel(instinct: EnneagramInstinct): string {
  return ENNEAGRAM_INSTINCTS[instinct].label;
}

/** Get the full name for an instinctual variant. */
export function getInstinctFullName(instinct: EnneagramInstinct): string {
  return ENNEAGRAM_INSTINCTS[instinct].fullName;
}

/** Get the core data for an enneagram type. */
export function getEnneagramType(type: EnneagramNumber): EnneagramTypeData {
  return ENNEAGRAM_TYPES[type];
}
