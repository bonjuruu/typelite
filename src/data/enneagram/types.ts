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
  motivation: string;
  coreFear: string;
  coreDesire: string;
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
    name: "Justicar",
    className: "Justicar",
    description:
      "Wreathed in cold judgment. Every strike is a verdict, precise and without mercy. Inner conviction burns hotter than any flame.",
    motivation: "Driven by a need to be good, right, and consistent with their ideals.",
    coreFear: "Being corrupt, evil, or defective.",
    coreDesire: "To have integrity and be morally good.",
    wings: [9, 2],
    integrationTarget: 7,
    disintegrationTarget: 4,
    statModifiers: { willpower: 1.15, intelligence: 1.05 },
    empoweredState: {
      name: "Liberated",
      description: "Gains the spontaneity of 7. Becomes joyful and open.",
      statChanges: { spirit: 3 },
    },
    stressedState: {
      name: "Melancholic",
      description:
        "Falls into the moodiness of 4. Becomes withdrawn and envious.",
      statChanges: { spirit: -3 },
    },
  },
  2: {
    type: 2,
    name: "Cleric",
    className: "Cleric",
    description:
      "Binds wounds with devotion and breaks curses with sacrifice. Power swells with every ally shielded, and every debt left unpaid.",
    motivation: "Driven by a need to be loved and needed by others.",
    coreFear: "Being unwanted or unworthy of love.",
    coreDesire: "To feel loved and appreciated.",
    wings: [1, 3],
    integrationTarget: 4,
    disintegrationTarget: 8,
    statModifiers: { spirit: 1.15, vitality: 1.05 },
    empoweredState: {
      name: "Self-Aware",
      description:
        "Gains the depth of 4. Becomes emotionally honest and creative.",
      statChanges: { intelligence: 3 },
    },
    stressedState: {
      name: "Domineering",
      description:
        "Falls into the aggression of 8. Becomes controlling and confrontational.",
      statChanges: { intelligence: -3 },
    },
  },
  3: {
    type: 3,
    name: "Warlord",
    className: "Warlord",
    description:
      "Born to conquer, reads the battlefield like a ledger and always comes out ahead. Victory itself is worn as armor, every stance reshaped to exploit the next weakness.",
    motivation: "Driven by a need to succeed and be seen as valuable.",
    coreFear: "Being worthless or a failure.",
    coreDesire: "To feel valuable and admired.",
    wings: [2, 4],
    integrationTarget: 6,
    disintegrationTarget: 9,
    statModifiers: { willpower: 1.1, intelligence: 1.1 },
    empoweredState: {
      name: "Devoted",
      description:
        "Gains the loyalty of 6. Becomes cooperative and committed.",
      statChanges: { vitality: 3 },
    },
    stressedState: {
      name: "Disengaged",
      description: "Falls into the apathy of 9. Becomes passive and numb.",
      statChanges: { willpower: -3 },
    },
  },
  4: {
    type: 4,
    name: "Bard",
    className: "Bard",
    description:
      "Grief, longing, and fury are the only instruments needed. Each note is a spell that warps reality. Most dangerous when the ache runs deepest.",
    motivation: "Driven by a need to be unique and true to themselves.",
    coreFear: "Having no identity or personal significance.",
    coreDesire: "To find themselves and their significance.",
    wings: [3, 5],
    integrationTarget: 1,
    disintegrationTarget: 2,
    statModifiers: { spirit: 1.2 },
    empoweredState: {
      name: "Disciplined",
      description: "Gains the principle of 1. Becomes focused and purposeful.",
      statChanges: { willpower: 3 },
    },
    stressedState: {
      name: "Dependent",
      description:
        "Falls into the neediness of 2. Becomes clingy and resentful.",
      statChanges: { willpower: -3 },
    },
  },
  5: {
    type: 5,
    name: "Sage",
    className: "Sage",
    description:
      "Devours forbidden knowledge and waits in silence until the perfect moment to unleash it. One carefully hoarded secret can unravel an entire army.",
    motivation: "Driven by a need to understand and make sense of the world.",
    coreFear: "Being useless, helpless, or overwhelmed.",
    coreDesire: "To be capable and competent.",
    wings: [4, 6],
    integrationTarget: 8,
    disintegrationTarget: 7,
    statModifiers: { intelligence: 1.2 },
    empoweredState: {
      name: "Assertive",
      description: "Gains the confidence of 8. Becomes decisive and powerful.",
      statChanges: { willpower: 3 },
    },
    stressedState: {
      name: "Scattered",
      description:
        "Falls into the excess of 7. Becomes impulsive and unfocused.",
      statChanges: { intelligence: -3 },
    },
  },
  6: {
    type: 6,
    name: "Sentinel",
    className: "Sentinel",
    description:
      "Has already mapped every ambush, trap, and betrayal that could befall the party. Vigilance is a fortress. Paranoia is a weapon.",
    motivation: "Driven by a need for security and support.",
    coreFear: "Being without guidance or support.",
    coreDesire: "To have security and feel supported.",
    wings: [5, 7],
    integrationTarget: 9,
    disintegrationTarget: 3,
    statModifiers: { vitality: 1.15, willpower: 1.05 },
    empoweredState: {
      name: "Serene",
      description: "Gains the peace of 9. Becomes calm and receptive.",
      statChanges: { spirit: 3 },
    },
    stressedState: {
      name: "Performative",
      description:
        "Falls into the image-focus of 3. Becomes competitive and hollow.",
      statChanges: { vitality: -3 },
    },
  },
  7: {
    type: 7,
    name: "Trickster",
    className: "Trickster",
    description:
      "Dances through ruin with a grin, turning every catastrophe into an opportunity. Probability bends in their wake. Fortune favors the unhinged.",
    motivation: "Driven by a need to experience everything and avoid pain.",
    coreFear: "Being deprived or trapped in suffering.",
    coreDesire: "To be satisfied and content.",
    wings: [6, 8],
    integrationTarget: 5,
    disintegrationTarget: 1,
    statModifiers: { spirit: 1.1, intelligence: 1.1 },
    empoweredState: {
      name: "Focused",
      description:
        "Gains the depth of 5. Becomes contemplative and masterful.",
      statChanges: { intelligence: 3 },
    },
    stressedState: {
      name: "Rigid",
      description:
        "Falls into the perfectionism of 1. Becomes critical and inflexible.",
      statChanges: { spirit: -3 },
    },
  },
  8: {
    type: 8,
    name: "Berserker",
    className: "Berserker",
    description:
      "Does not strategize. Only annihilates. Sheer willpower replaces armor, and every wound taken only deepens the fury that makes the next blow unstoppable.",
    motivation: "Driven by a need to be strong and in control of their own life.",
    coreFear: "Being controlled or vulnerable.",
    coreDesire: "To protect themselves and be in control.",
    wings: [7, 9],
    integrationTarget: 2,
    disintegrationTarget: 5,
    statModifiers: { willpower: 1.2 },
    empoweredState: {
      name: "Compassionate",
      description:
        "Gains the warmth of 2. Becomes protective and magnanimous.",
      statChanges: { spirit: 3 },
    },
    stressedState: {
      name: "Withdrawn",
      description:
        "Falls into the isolation of 5. Becomes secretive and detached.",
      statChanges: { vitality: -3 },
    },
  },
  9: {
    type: 9,
    name: "Druid",
    className: "Druid",
    description:
      "Still as ancient stone, draws power from the land itself and channels it through those nearby. Allies endure, enemies slowly wither, and the earth remembers.",
    motivation: "Driven by a need for inner peace and harmony.",
    coreFear: "Loss, fragmentation, or conflict.",
    coreDesire: "To have inner stability and peace of mind.",
    wings: [8, 1],
    integrationTarget: 3,
    disintegrationTarget: 6,
    statModifiers: { vitality: 1.1, spirit: 1.1 },
    empoweredState: {
      name: "Driven",
      description: "Gains the ambition of 3. Becomes energetic and effective.",
      statChanges: { willpower: 3 },
    },
    stressedState: {
      name: "Anxious",
      description:
        "Falls into the worry of 6. Becomes suspicious and reactive.",
      statChanges: { spirit: -3 },
    },
  },
};
