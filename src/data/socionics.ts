import type {
  SocionicsType,
  Quadra,
  Club,
  Element,
  ElementAffinity,
  PassiveTrait,
} from "../engine/types/index.ts";

// ============================================================
// TYPE DATA
// ============================================================

interface SocionicsTypeData {
  type: SocionicsType;
  name: string;
  quadra: Quadra;
  club: Club;
  element: Element;
}

const SOCIONICS_TYPES: Record<SocionicsType, SocionicsTypeData> = {
  // Alpha - Light / Nature
  ILE: {
    type: "ILE",
    name: "The Inventor",
    quadra: "Alpha",
    club: "Researcher",
    element: "Light",
  },
  SEI: {
    type: "SEI",
    name: "The Mediator",
    quadra: "Alpha",
    club: "Humanitarian",
    element: "Nature",
  },
  ESE: {
    type: "ESE",
    name: "The Enthusiast",
    quadra: "Alpha",
    club: "Humanitarian",
    element: "Light",
  },
  LII: {
    type: "LII",
    name: "The Analyst",
    quadra: "Alpha",
    club: "Researcher",
    element: "Nature",
  },

  // Beta - Fire / Shadow
  SLE: {
    type: "SLE",
    name: "The Commander",
    quadra: "Beta",
    club: "Practical",
    element: "Fire",
  },
  IEI: {
    type: "IEI",
    name: "The Romantic",
    quadra: "Beta",
    club: "Social",
    element: "Shadow",
  },
  EIE: {
    type: "EIE",
    name: "The Mentor",
    quadra: "Beta",
    club: "Social",
    element: "Fire",
  },
  LSI: {
    type: "LSI",
    name: "The Inspector",
    quadra: "Beta",
    club: "Practical",
    element: "Shadow",
  },

  // Gamma - Earth / Metal
  SEE: {
    type: "SEE",
    name: "The Politician",
    quadra: "Gamma",
    club: "Humanitarian",
    element: "Earth",
  },
  ILI: {
    type: "ILI",
    name: "The Critic",
    quadra: "Gamma",
    club: "Researcher",
    element: "Metal",
  },
  LIE: {
    type: "LIE",
    name: "The Pioneer",
    quadra: "Gamma",
    club: "Researcher",
    element: "Earth",
  },
  ESI: {
    type: "ESI",
    name: "The Guardian",
    quadra: "Gamma",
    club: "Humanitarian",
    element: "Metal",
  },

  // Delta - Wind / Water
  IEE: {
    type: "IEE",
    name: "The Advisor",
    quadra: "Delta",
    club: "Social",
    element: "Wind",
  },
  SLI: {
    type: "SLI",
    name: "The Craftsman",
    quadra: "Delta",
    club: "Practical",
    element: "Water",
  },
  LSE: {
    type: "LSE",
    name: "The Director",
    quadra: "Delta",
    club: "Practical",
    element: "Wind",
  },
  EII: {
    type: "EII",
    name: "The Humanist",
    quadra: "Delta",
    club: "Social",
    element: "Water",
  },
};

// ============================================================
// CLUB → PASSIVE TRAIT
// ============================================================

export const CLUB_PASSIVES: Record<Club, PassiveTrait> = {
  Researcher: {
    name: "Analytical Mind",
    description:
      "Abilities that hit debuffed targets deal 15% increased damage. Stacks with existing vulnerability effects.",
    source: "Researcher club",
  },
  Social: {
    name: "Social Grace",
    description:
      "Party-wide buffs and heals are 20% more effective. Aura abilities gain +1 turn duration.",
    source: "Social club",
  },
  Practical: {
    name: "Resourceful",
    description:
      "All ability cooldowns are reduced by 1 turn. Consecutive ability uses cost 10% less.",
    source: "Practical club",
  },
  Humanitarian: {
    name: "Compassionate Aura",
    description:
      "Allies within range passively regenerate 2% max health per turn. Doubles when an ally is below 30% health.",
    source: "Humanitarian club",
  },
};

// ============================================================
// QUADRA RATIONALE
// ============================================================

const QUADRA_RATIONALE: Record<Quadra, string> = {
  Alpha:
    "Cooperative and curious (Ne/Si + Fe/Ti) - Light and Nature fit the warm, exploratory vibe.",
  Beta: "Intense and hierarchical (Se/Ni + Fe/Ti) - Fire and Shadow match the power dynamics.",
  Gamma:
    "Pragmatic and competitive (Se/Ni + Te/Fi) - Earth and Metal for the results-oriented approach.",
  Delta:
    "Steady and craft-oriented (Ne/Si + Te/Fi) - Wind and Water for the quieter, hands-on style.",
};

/** Get the rationale for why a quadra maps to its elements. */
export function getQuadraRationale(quadra: Quadra): string {
  return QUADRA_RATIONALE[quadra];
}

// ============================================================
// QUADRA DESCRIPTIONS
// ============================================================

const QUADRA_DESCRIPTIONS: Record<Quadra, string> = {
  Alpha:
    "Values Ne/Si + Fe/Ti. Cooperative, exploratory, values comfort and shared understanding.",
  Beta:
    "Values Se/Ni + Fe/Ti. Hierarchical, intense, values willpower and decisive action.",
  Gamma:
    "Values Se/Ni + Te/Fi. Competitive, pragmatic, values results and personal conviction.",
  Delta:
    "Values Ne/Si + Te/Fi. Steady, craft-oriented, values practical skill and quiet authenticity.",
};

/** Get a concise description of what a quadra values. */
export function getQuadraDescription(quadra: Quadra): string {
  return QUADRA_DESCRIPTIONS[quadra];
}

// ============================================================
// CLUB DESCRIPTIONS
// ============================================================

const CLUB_DESCRIPTIONS: Record<Club, string> = {
  Researcher:
    "Types that pair intuition with logic (NT). Oriented toward understanding systems and possibilities.",
  Social:
    "Types that pair intuition with ethics (NF). Oriented toward people, meaning, and emotional dynamics.",
  Practical:
    "Types that pair sensing with logic (ST). Oriented toward concrete results and efficient methods.",
  Humanitarian:
    "Types that pair sensing with ethics (SF). Oriented toward wellbeing, comfort, and relational harmony.",
};

/** Get a concise description of what a club grouping means. */
export function getClubDescription(club: Club): string {
  return CLUB_DESCRIPTIONS[club];
}

// ============================================================
// PUBLIC API
// ============================================================

export const SOCIONICS_TYPE_LIST: readonly SocionicsType[] = [
  "ILE",
  "SEI",
  "ESE",
  "LII",
  "SLE",
  "IEI",
  "EIE",
  "LSI",
  "SEE",
  "ILI",
  "LIE",
  "ESI",
  "IEE",
  "SLI",
  "LSE",
  "EII",
] as const;

/** Get the core data for a socionics type. */
export function getSocionicsType(type: SocionicsType): SocionicsTypeData {
  return SOCIONICS_TYPES[type];
}

/** Build the full ElementAffinity from a socionics type selection. */
export function buildElementAffinity(type: SocionicsType): ElementAffinity {
  const typeData = SOCIONICS_TYPES[type];

  return {
    element: typeData.element,
    quadra: typeData.quadra,
    club: typeData.club,
    passiveTrait: CLUB_PASSIVES[typeData.club],
  };
}

/** Get all socionics types in a given quadra. */
export function getTypesByQuadra(quadra: Quadra): SocionicsTypeData[] {
  return Object.values(SOCIONICS_TYPES).filter(
    (typeData) => typeData.quadra === quadra,
  );
}
