import type { APType, StatBlock, StatName } from "../engine/types/index.ts";

// ============================================================
// ASPECTS
// ============================================================

type Aspect = "V" | "L" | "E" | "F";

const ASPECT_TO_STAT: Record<Aspect, StatName> = {
  V: "willpower",
  L: "intelligence",
  E: "spirit",
  F: "vitality",
};

const ASPECT_LABELS: Record<Aspect, string> = {
  V: "Volition",
  L: "Logic",
  E: "Emotion",
  F: "Physics",
};

// ============================================================
// POSITION ATTITUDES
// ============================================================

type Orientation = "Result" | "Process";
type Polarity = "+" | "-";

export interface PositionAttitude {
  position: number;
  label: string;
  orientation: Orientation;
  selfAttitude: Polarity;
  othersAttitude: Polarity;
  description: string;
}

/**
 * Position attitudes define how a person relates to each aspect.
 * 1st: Result-oriented, confident (self+), dismissive of others (others-)
 * 2nd: Process-oriented, creative (self+), supportive of others (others+)
 * 3rd: Process-oriented, insecure (self-), critical of others (others-)
 * 4th: Result-oriented, unbothered (self-), deferring to others (others+)
 */
const POSITION_ATTITUDES: PositionAttitude[] = [
  {
    position: 1,
    label: "1st",
    orientation: "Result",
    selfAttitude: "+",
    othersAttitude: "-",
    description:
      "Confident and decisive. Strong personal command, but dismissive of how others approach it.",
  },
  {
    position: 2,
    label: "2nd",
    orientation: "Process",
    selfAttitude: "+",
    othersAttitude: "+",
    description:
      "Creative and flexible. Enjoys the process and actively supports others in this area.",
  },
  {
    position: 3,
    label: "3rd",
    orientation: "Process",
    selfAttitude: "-",
    othersAttitude: "-",
    description:
      "Insecure and sensitive. Doubts own ability and is critical of others in this area.",
  },
  {
    position: 4,
    label: "4th",
    orientation: "Result",
    selfAttitude: "-",
    othersAttitude: "+",
    description:
      "Unbothered and deferring. Low personal investment, trusts others to handle it.",
  },
];

// Per-aspect flavor text at each position
interface AspectPositionFlavor {
  summary: string;
  gameplayHint: string;
}

const ASPECT_POSITION_FLAVORS: Record<
  Aspect,
  Record<number, AspectPositionFlavor>
> = {
  V: {
    1: {
      summary: "Commanding will. Knows what they want and takes it.",
      gameplayHint: "Willpower abilities are forceful and self-directed.",
    },
    2: {
      summary:
        "Encouraging will. Motivates self and others through shared goals.",
      gameplayHint: "Willpower abilities support and empower the party.",
    },
    3: {
      summary: "Uncertain will. Struggles with direction, easily shaken.",
      gameplayHint:
        "Willpower abilities are volatile - high ceiling, low floor.",
    },
    4: {
      summary: "Yielding will. Follows others' lead without friction.",
      gameplayHint: "Willpower abilities are passive and reactive.",
    },
  },
  L: {
    1: {
      summary: "Authoritative logic. Trusts own analysis completely.",
      gameplayHint: "Intelligence abilities are precise and self-assured.",
    },
    2: {
      summary: "Collaborative logic. Enjoys reasoning together, open to input.",
      gameplayHint: "Intelligence abilities create shared advantages.",
    },
    3: {
      summary: "Defensive logic. Doubts own reasoning, bristles at criticism.",
      gameplayHint: "Intelligence abilities are inconsistent but can spike.",
    },
    4: {
      summary:
        "Detached logic. Doesn't bother with analysis, defers to experts.",
      gameplayHint: "Intelligence abilities are minimal but efficient.",
    },
  },
  E: {
    1: {
      summary:
        "Dominant emotion. Expresses freely, doesn't accommodate others' feelings.",
      gameplayHint: "Spirit abilities are powerful but self-centered.",
    },
    2: {
      summary: "Nurturing emotion. Emotionally attuned to self and others.",
      gameplayHint: "Spirit abilities heal and harmonize the party.",
    },
    3: {
      summary:
        "Guarded emotion. Sensitive and easily hurt, distrusts others' emotions.",
      gameplayHint:
        "Spirit abilities are erratic - burst potential with drawbacks.",
    },
    4: {
      summary:
        "Unburdened emotion. Doesn't dwell on feelings, accepts others' emotional lead.",
      gameplayHint: "Spirit abilities are steady but understated.",
    },
  },
  F: {
    1: {
      summary:
        "Commanding physicality. Takes charge of material needs without hesitation.",
      gameplayHint: "Vitality abilities are aggressive and self-reliant.",
    },
    2: {
      summary:
        "Generous physicality. Attends to others' physical comfort and wellbeing.",
      gameplayHint: "Vitality abilities provide sustain for the party.",
    },
    3: {
      summary: "Anxious physicality. Uneasy with body and material world.",
      gameplayHint: "Vitality abilities are unreliable - feast or famine.",
    },
    4: {
      summary:
        "Indifferent physicality. Neglects material concerns, relies on others.",
      gameplayHint: "Vitality abilities are low-maintenance and passive.",
    },
  },
};

// ============================================================
// POSITION VALUES
// ============================================================

/** Base stat value for each stack position (1st → 4th) */
const POSITION_BASE_VALUES = [14, 10, 7, 4] as const;

// ============================================================
// ALL 24 AP TYPES
// ============================================================

export const AP_TYPE_LIST: readonly APType[] = [
  "VLEF",
  "VLFE",
  "VELF",
  "VEFL",
  "VFEL",
  "VFLE",
  "LVEF",
  "LVFE",
  "LEVF",
  "LEFV",
  "LFEV",
  "LFVE",
  "EVLF",
  "EVFL",
  "ELVF",
  "ELFV",
  "EFLV",
  "EFVL",
  "FVLE",
  "FVEL",
  "FLVE",
  "FLEV",
  "FEVL",
  "FELV",
] as const;

// ============================================================
// STAT DERIVATION
// ============================================================

/** Derive base stats from an AP type ordering. 1st aspect gets the highest value, 4th the lowest. */
export function getBaseStats(apType: APType): StatBlock {
  const aspectList = apType.split("") as Aspect[];

  const stats: StatBlock = {
    willpower: 0,
    intelligence: 0,
    spirit: 0,
    vitality: 0,
  };

  for (let position = 0; position < aspectList.length; position++) {
    const aspect = aspectList[position];
    const statName = ASPECT_TO_STAT[aspect];
    stats[statName] = POSITION_BASE_VALUES[position];
  }

  return stats;
}

// ============================================================
// STACK DESCRIPTION
// ============================================================

export interface StackPositionDetail {
  position: number;
  label: string;
  aspect: string;
  aspectCode: string;
  stat: StatName;
  statValue: number;
  attitude: PositionAttitude;
  flavor: AspectPositionFlavor;
}

/** Get detailed breakdown of an AP type's stack with position attitudes and aspect flavors. */
export function describeStack(apType: APType): StackPositionDetail[] {
  const aspectList = apType.split("") as Aspect[];

  return aspectList.map(
    (aspect, index): StackPositionDetail => ({
      position: index + 1,
      label: POSITION_ATTITUDES[index].label,
      aspect: ASPECT_LABELS[aspect],
      aspectCode: aspect,
      stat: ASPECT_TO_STAT[aspect],
      statValue: POSITION_BASE_VALUES[index],
      attitude: POSITION_ATTITUDES[index],
      flavor: ASPECT_POSITION_FLAVORS[aspect][index + 1],
    }),
  );
}
