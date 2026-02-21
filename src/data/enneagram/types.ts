import type {
  EnneagramNumber,
  StatName,
  StatusEffect,
} from "../../engine/types/index.ts";

// ============================================================
// CORE TYPE DATA
// ============================================================

export interface EnneagramTypeData {
  type: EnneagramNumber;
  name: string;
  className: string;
  description: string;
  wings: [EnneagramNumber, EnneagramNumber];
  integrationTarget: EnneagramNumber;
  disintegrationTarget: EnneagramNumber;
  statModifiers: Partial<Record<StatName, number>>;
  empoweredState: StatusEffect;
  stressedState: StatusEffect;
}

export const ENNEAGRAM_TYPES: Record<EnneagramNumber, EnneagramTypeData> = {
  1: {
    type: 1,
    name: "The Reformer",
    className: "Justicar",
    description:
      "Wreathed in cold judgment, every strike is a verdict — precise, final, and without mercy. Inner conviction burns hotter than any flame.",
    wings: [9, 2],
    integrationTarget: 7,
    disintegrationTarget: 4,
    statModifiers: { willpower: 1.15, intelligence: 1.05 },
    empoweredState: {
      name: "Liberated",
      description: "Gains the spontaneity of 7 — becomes joyful and open.",
      statChanges: { spirit: 3 },
    },
    stressedState: {
      name: "Melancholic",
      description:
        "Falls into the moodiness of 4 — becomes withdrawn and envious.",
      statChanges: { spirit: -3 },
    },
  },
  2: {
    type: 2,
    name: "The Helper",
    className: "Cleric",
    description:
      "Binds wounds with devotion and breaks curses with sacrifice. Power swells with every ally shielded — and every debt left unpaid.",
    wings: [1, 3],
    integrationTarget: 4,
    disintegrationTarget: 8,
    statModifiers: { spirit: 1.15, vitality: 1.05 },
    empoweredState: {
      name: "Self-Aware",
      description:
        "Gains the depth of 4 — becomes emotionally honest and creative.",
      statChanges: { intelligence: 3 },
    },
    stressedState: {
      name: "Domineering",
      description:
        "Falls into the aggression of 8 — becomes controlling and confrontational.",
      statChanges: { intelligence: -3 },
    },
  },
  3: {
    type: 3,
    name: "The Achiever",
    className: "Warlord",
    description:
      "Born to conquer, reads the battlefield like a ledger and always comes out ahead. Victory itself is worn as armor, every stance reshaped to exploit the next weakness.",
    wings: [2, 4],
    integrationTarget: 6,
    disintegrationTarget: 9,
    statModifiers: { willpower: 1.1, intelligence: 1.1 },
    empoweredState: {
      name: "Devoted",
      description:
        "Gains the loyalty of 6 — becomes cooperative and committed.",
      statChanges: { vitality: 3 },
    },
    stressedState: {
      name: "Disengaged",
      description: "Falls into the apathy of 9 — becomes passive and numb.",
      statChanges: { willpower: -3 },
    },
  },
  4: {
    type: 4,
    name: "The Individualist",
    className: "Bard",
    description:
      "Grief, longing, and fury are the only instruments needed — each note a spell that warps reality. Most dangerous when the ache runs deepest.",
    wings: [3, 5],
    integrationTarget: 1,
    disintegrationTarget: 2,
    statModifiers: { spirit: 1.2 },
    empoweredState: {
      name: "Disciplined",
      description: "Gains the principle of 1 — becomes focused and purposeful.",
      statChanges: { willpower: 3 },
    },
    stressedState: {
      name: "Dependent",
      description:
        "Falls into the neediness of 2 — becomes clingy and resentful.",
      statChanges: { willpower: -3 },
    },
  },
  5: {
    type: 5,
    name: "The Investigator",
    className: "Sage",
    description:
      "Devours forbidden knowledge and waits in silence until the perfect moment to unleash it. One carefully hoarded secret can unravel an entire army.",
    wings: [4, 6],
    integrationTarget: 8,
    disintegrationTarget: 7,
    statModifiers: { intelligence: 1.2 },
    empoweredState: {
      name: "Assertive",
      description: "Gains the confidence of 8 — becomes decisive and powerful.",
      statChanges: { willpower: 3 },
    },
    stressedState: {
      name: "Scattered",
      description:
        "Falls into the excess of 7 — becomes impulsive and unfocused.",
      statChanges: { intelligence: -3 },
    },
  },
  6: {
    type: 6,
    name: "The Loyalist",
    className: "Sentinel",
    description:
      "Has already mapped every ambush, every trap, every betrayal that could befall the party. Vigilance is a fortress — and paranoia, a weapon.",
    wings: [5, 7],
    integrationTarget: 9,
    disintegrationTarget: 3,
    statModifiers: { vitality: 1.15, willpower: 1.05 },
    empoweredState: {
      name: "Serene",
      description: "Gains the peace of 9 — becomes calm and receptive.",
      statChanges: { spirit: 3 },
    },
    stressedState: {
      name: "Performative",
      description:
        "Falls into the image-focus of 3 — becomes competitive and hollow.",
      statChanges: { vitality: -3 },
    },
  },
  7: {
    type: 7,
    name: "The Enthusiast",
    className: "Trickster",
    description:
      "Dances through ruin with a grin, turning every catastrophe into an opportunity. Probability bends in their wake — fortune favors the unhinged.",
    wings: [6, 8],
    integrationTarget: 5,
    disintegrationTarget: 1,
    statModifiers: { spirit: 1.1, intelligence: 1.1 },
    empoweredState: {
      name: "Focused",
      description:
        "Gains the depth of 5 — becomes contemplative and masterful.",
      statChanges: { intelligence: 3 },
    },
    stressedState: {
      name: "Rigid",
      description:
        "Falls into the perfectionism of 1 — becomes critical and inflexible.",
      statChanges: { spirit: -3 },
    },
  },
  8: {
    type: 8,
    name: "The Challenger",
    className: "Berserker",
    description:
      "Does not strategize — only annihilates. Sheer willpower replaces armor, and every wound taken only deepens the fury that makes the next blow unstoppable.",
    wings: [7, 9],
    integrationTarget: 2,
    disintegrationTarget: 5,
    statModifiers: { willpower: 1.2 },
    empoweredState: {
      name: "Compassionate",
      description:
        "Gains the warmth of 2 — becomes protective and magnanimous.",
      statChanges: { spirit: 3 },
    },
    stressedState: {
      name: "Withdrawn",
      description:
        "Falls into the isolation of 5 — becomes secretive and detached.",
      statChanges: { vitality: -3 },
    },
  },
  9: {
    type: 9,
    name: "The Peacemaker",
    className: "Druid",
    description:
      "Still as ancient stone, draws power from the land itself and channels it through those nearby. Allies endure, enemies slowly wither, and the earth remembers.",
    wings: [8, 1],
    integrationTarget: 3,
    disintegrationTarget: 6,
    statModifiers: { vitality: 1.1, spirit: 1.1 },
    empoweredState: {
      name: "Driven",
      description: "Gains the ambition of 3 — becomes energetic and effective.",
      statChanges: { willpower: 3 },
    },
    stressedState: {
      name: "Anxious",
      description:
        "Falls into the worry of 6 — becomes suspicious and reactive.",
      statChanges: { spirit: -3 },
    },
  },
};
