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
  description: string;
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
    description:
      "Feels alive through full immersion in the physical world and claiming ownership of one's environment. Driven by immediate sensory engagement and the need to possess resources and spaces.",
    center: "SUR",
    experiential: "Immersing",
    movement: "Directing",
    source: "Externalizing",
  },
  SY: {
    realm: "SY",
    name: "Security",
    description:
      "Feels alive through the creation and cultivation of stability, comfort, and protection. Safety and stability are sources of joy and vitality, not just means of survival.",
    center: "SUR",
    experiential: "Distinguishing",
    movement: "Escaping",
    source: "Internalizing",
  },
  SM: {
    realm: "SM",
    name: "Self-Management",
    description:
      "Feels alive through tracking the elements that sustain and enhance ideal bodily vitality. Focused on creating optimal conditions for the body to thrive through aligned routines and habits.",
    center: "SUR",
    experiential: "Memorializing",
    movement: "Aligning",
    source: "Exchanging",
  },

  // INT (Interpersonal)
  AY: {
    realm: "AY",
    name: "Alchemy",
    description:
      "Feels alive through tracking the intensity of attraction, chemistry, and energy in interpersonal dynamics. Seeks transformative experiences through profound engagement with others.",
    center: "INT",
    experiential: "Immersing",
    movement: "Escaping",
    source: "Exchanging",
  },
  CY: {
    realm: "CY",
    name: "Community",
    description:
      "Feels alive through tracking interpersonal standards and understanding where individuals are located in the web of human connections. Driven by belonging, shared values, and social positioning.",
    center: "INT",
    experiential: "Distinguishing",
    movement: "Aligning",
    source: "Externalizing",
  },
  BG: {
    realm: "BG",
    name: "Bonding",
    description:
      "Feels alive through tracking the intensity of bonds between oneself and chosen relationships. Seeks to be genuinely known and psychologically connected at profound levels.",
    center: "INT",
    experiential: "Memorializing",
    movement: "Directing",
    source: "Internalizing",
  },

  // PUR (Purpose)
  SS: {
    realm: "SS",
    name: "Self-Significance",
    description:
      "Feels alive through tracking one's unique reasons for existing. Driven by introspection and the need to align actions with a deeper sense of personal meaning and identity.",
    center: "PUR",
    experiential: "Immersing",
    movement: "Aligning",
    source: "Internalizing",
  },
  EX: {
    realm: "EX",
    name: "Existentialism",
    description:
      "Feels alive through tracking the purpose that connects all experiences, people, and ideas together. Driven by the need to make sense of the vast amount of meaning in the world.",
    center: "PUR",
    experiential: "Distinguishing",
    movement: "Directing",
    source: "Exchanging",
  },
  UN: {
    realm: "UN",
    name: "Unknown",
    description:
      "Feels alive through tracking missing experiences that can be manifested into reality. Driven by mystery and the conviction that something hidden is waiting to be discovered.",
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
// TRIAD CATEGORY DESCRIPTIONS (what each triad axis means in EP)
// ============================================================

export const TRIAD_CATEGORY_DESCRIPTIONS = {
  experiential:
    "How you perceive reality to feel fully alive.",
  movement:
    "How you manage your current circumstances.",
  source:
    "Where you believe fulfillment originates.",
} as const;

// ============================================================
// TRIAD EP DESCRIPTIONS (what each value means in Expanded Instincts)
// ============================================================

const TRIAD_EP_DESCRIPTIONS: Record<string, Record<string, string>> = {
  experiential: {
    Immersing:
      "Views reality through fully present feelings, emotions, or energy. Must experience life through full engrossment to feel alive.",
    Distinguishing:
      "Views reality through separate pieces of information. Gathering and categorizing information provides the instinctual high.",
    Memorializing:
      "Views reality through memories it can create. Experiences are tokenized through memorials that persist and accumulate meaning.",
  },
  movement: {
    Directing:
      "Yang energy. Moves against reality, forcefully changing undesired states. Manages the environment.",
    Escaping:
      "Yin energy. Moves away from undesired states, abandons rather than transforms. Manages the self.",
    Aligning:
      "Neutral energy. Moves toward and with reality methodically. Manages the details between environment and self.",
  },
  source: {
    Internalizing:
      "Believes happiness is located within the self. Information is extracted from internal experience.",
    Externalizing:
      "Believes happiness is located outside the self. Information is extracted from external experience.",
    Exchanging:
      "Believes happiness is located in the exchange between internal and external. Information from shared or comparative experiences.",
  },
};

/** Get the EP description for a specific triad value (what it means psychologically). */
export function getTriadEPDescription(
  category: string,
  triadValue: string,
): string {
  return TRIAD_EP_DESCRIPTIONS[category]?.[triadValue] ?? "";
}

// ============================================================
// TRIAD GAMEPLAY DESCRIPTIONS (how each value translates to combat)
// ============================================================

const TRIAD_GAMEPLAY_DESCRIPTIONS: Record<string, Record<string, string>> = {
  experiential: {
    Memorializing:
      "Abilities leave echoes that linger past their base duration, stacking pressure over time.",
    Immersing:
      "Consecutive casts build flow state, each use ramps power for the next.",
    Distinguishing:
      "Perfect timing windows. Hit the critical moment for burst damage, miss it for weak output.",
  },
  movement: {
    Escaping:
      "Evasive and reactive. Dodge chance increases, repositions after taking damage.",
    Aligning:
      "Adaptive flow. Positioning auto-adjusts to match the state of combat.",
    Directing:
      "Relentless aggression. Closes distance after attacks, applies constant pressure.",
  },
  source: {
    Internalizing:
      "Passive regen. Resources restore slowly over time, independent of combat.",
    Externalizing:
      "Damage-fueled. Siphon energy from hitting enemies, rewarding aggression.",
    Exchanging:
      "Bidirectional flow. Gain resources from both dealing and receiving damage.",
  },
};

/** Get the gameplay description for a specific triad value (how it translates to combat). */
export function getTriadDescription(
  category: string,
  triadValue: string,
): string {
  return TRIAD_GAMEPLAY_DESCRIPTIONS[category]?.[triadValue] ?? "";
}
