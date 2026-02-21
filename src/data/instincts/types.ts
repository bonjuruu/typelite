import type {
  InstinctRealm,
  InstinctCenter,
  ExperientialTriad,
  MovementTriad,
  SourceTriad,
  PassiveTrait,
} from "../../engine/types/index.ts";

// ============================================================
// REALM DATA
// ============================================================

export interface InstinctRealmData {
  realm: InstinctRealm;
  name: string;
  center: InstinctCenter;
  experiential: ExperientialTriad;
  movement: MovementTriad;
  source: SourceTriad;
}

export const INSTINCT_REALMS: Record<InstinctRealm, InstinctRealmData> = {
  // SUR (Self-Survival)
  FD: {
    realm: "FD",
    name: "Fortitude",
    center: "SUR",
    experiential: "Immersing",
    movement: "Directing",
    source: "Externalizing",
  },
  SY: {
    realm: "SY",
    name: "Security",
    center: "SUR",
    experiential: "Distinguishing",
    movement: "Escaping",
    source: "Internalizing",
  },
  SM: {
    realm: "SM",
    name: "Self-Management",
    center: "SUR",
    experiential: "Memorializing",
    movement: "Aligning",
    source: "Exchanging",
  },

  // INT (Interpersonal)
  AY: {
    realm: "AY",
    name: "Alchemy",
    center: "INT",
    experiential: "Immersing",
    movement: "Escaping",
    source: "Exchanging",
  },
  CY: {
    realm: "CY",
    name: "Community",
    center: "INT",
    experiential: "Distinguishing",
    movement: "Aligning",
    source: "Externalizing",
  },
  BG: {
    realm: "BG",
    name: "Bonding",
    center: "INT",
    experiential: "Memorializing",
    movement: "Directing",
    source: "Internalizing",
  },

  // PUR (Purpose)
  SS: {
    realm: "SS",
    name: "Self-Significance",
    center: "PUR",
    experiential: "Immersing",
    movement: "Aligning",
    source: "Internalizing",
  },
  EX: {
    realm: "EX",
    name: "Existentialism",
    center: "PUR",
    experiential: "Distinguishing",
    movement: "Directing",
    source: "Exchanging",
  },
  UN: {
    realm: "UN",
    name: "Unknown",
    center: "PUR",
    experiential: "Memorializing",
    movement: "Escaping",
    source: "Externalizing",
  },
};

// ============================================================
// CENTER → COMBAT ORIENTATION
// ============================================================

export const CENTER_ORIENTATIONS: Record<InstinctCenter, string> = {
  SUR: "Frontline",
  INT: "Support",
  PUR: "Strategist",
};

// ============================================================
// TRIAD → PASSIVES
// ============================================================

export const EXPERIENTIAL_PASSIVES: Record<ExperientialTriad, PassiveTrait> = {
  Memorializing: {
    name: "Afterimage",
    description:
      "Abilities leave lingering effects that persist for extra ticks.",
    source: "Experiential triad (Memorializing)",
  },
  Immersing: {
    name: "Flow State",
    description: "Consecutive ability uses build momentum, increasing power.",
    source: "Experiential triad (Immersing)",
  },
  Distinguishing: {
    name: "Precision Timing",
    description:
      "Abilities have a critical window that deals bonus damage when hit.",
    source: "Experiential triad (Distinguishing)",
  },
};

export const MOVEMENT_PASSIVES: Record<MovementTriad, PassiveTrait> = {
  Escaping: {
    name: "Evasive",
    description: "Gains dodge chance and can reposition after taking damage.",
    source: "Movement triad (Escaping/Yin)",
  },
  Aligning: {
    name: "Adaptive Stance",
    description:
      "Automatically adjusts positioning to match the flow of combat.",
    source: "Movement triad (Aligning/Neutral)",
  },
  Directing: {
    name: "Aggressive Advance",
    description:
      "Closes distance after attacking. Pressures enemies relentlessly.",
    source: "Movement triad (Directing/Yang)",
  },
};

export const SOURCE_PASSIVES: Record<SourceTriad, PassiveTrait> = {
  Internalizing: {
    name: "Inner Reserve",
    description:
      "Passively regenerates resources over time, independent of combat.",
    source: "Source triad (Internalizing)",
  },
  Externalizing: {
    name: "Siphon",
    description: "Regenerates resources when dealing damage to enemies.",
    source: "Source triad (Externalizing)",
  },
  Exchanging: {
    name: "Equilibrium",
    description:
      "Regenerates resources from both dealing and receiving damage.",
    source: "Source triad (Exchanging)",
  },
};

// ============================================================
// TRIAD GAMEPLAY DESCRIPTIONS
// ============================================================

const TRIAD_DESCRIPTIONS = {
  experiential: {
    Memorializing:
      "Abilities leave echoes - effects linger past their base duration, stacking pressure over time.",
    Immersing:
      "Consecutive casts build flow state - each use ramps power for the next.",
    Distinguishing:
      "Perfect timing windows - hit the critical moment for burst damage, miss it for weak output.",
  } as Record<ExperientialTriad, string>,
  movement: {
    Escaping:
      "Evasive and reactive - dodge chance increases, repositions after taking damage.",
    Aligning:
      "Adaptive flow - positioning auto-adjusts to match the flow of combat.",
    Directing:
      "Relentless aggression - closes distance after attacks, applies constant pressure.",
  } as Record<MovementTriad, string>,
  source: {
    Internalizing:
      "Passive regen - resources restore slowly over time, independent of combat.",
    Externalizing:
      "Damage-fueled - siphon energy from hitting enemies, rewarding aggression.",
    Exchanging:
      "Bidirectional flow - gain resources from both dealing and receiving damage.",
  } as Record<SourceTriad, string>,
} as const;

type TriadCategory = keyof typeof TRIAD_DESCRIPTIONS;

/** Get the gameplay description for a specific triad value. */
export function getTriadDescription(
  category: TriadCategory,
  triadValue: string,
): string {
  const descriptions: Record<string, string> = TRIAD_DESCRIPTIONS[category];
  return descriptions[triadValue] ?? "";
}
