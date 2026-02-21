import type { SystemId } from "../../engine/types/index.ts";

export interface SystemInfo {
  what: string;
  mapping: string;
  detail: string;
}

export interface SystemMeta {
  id: SystemId;
  name: string;
  description: string;
  domain: string;
  info: SystemInfo;
}

export const SYSTEM_META_LIST: SystemMeta[] = [
  {
    id: "attitudinal",
    name: "Attitudinal Psyche",
    description: "4 aspects ordered by priority",
    domain: "Base Stats",
    info: {
      what: "Attitudinal Psyche (AP) ranks four aspects - Volition, Logic, Emotion, Physics - from strongest (1st) to weakest (4th). Your ordering reveals how you assert yourself, process information, connect emotionally, and relate to the physical world.",
      mapping:
        "Each aspect maps to a stat: V\u2192Willpower, L\u2192Intelligence, E\u2192Spirit, F\u2192Vitality. Your 1st aspect gets the highest base (14), down to your 4th (4).",
      detail:
        "Position attitudes also matter: 1st is confident and imposing, 2nd is collaborative, 3rd is insecure, and 4th is accepting. These shape how your character wields each stat.",
    },
  },
  {
    id: "enneagram",
    name: "Enneagram",
    description: "9 types with wings and growth lines",
    domain: "Class",
    info: {
      what: 'The Enneagram describes 9 core motivations, each with adjacent "wings" that shade the type, and lines of integration (growth) and disintegration (stress) that show how you shift under pressure.',
      mapping:
        "Your type becomes your class archetype (e.g. Type 5 \u2192 Sage). Wings blend 30% of an adjacent type\u2019s stat modifiers. Integration/disintegration lines create empowered and stressed states.",
      detail:
        "Optional layers: instinctual variants (sp/so/sx) add passives and stat bonuses. Tritype picks one type from each center (Gut/Heart/Head) for deeper blending at 40%/20% influence.",
    },
  },
  {
    id: "mbti",
    name: "MBTI",
    description: "16 types via Beebe 4-function stack",
    domain: "Abilities",
    info: {
      what: "MBTI types are built from 8 cognitive functions (Ti, Te, Fi, Fe, Si, Se, Ni, Ne) arranged in a 4-function stack using Beebe\u2019s model. Each slot - Hero, Parent, Child, Inferior - has a distinct role.",
      mapping:
        "Each function\u2013slot combo produces a unique ability. Hero is your primary power, Parent is support/utility, Child is chaotic and high-variance, and Inferior is weak but has a comeback mechanic.",
      detail:
        "The same function plays differently in each slot - Ne as Hero is expansive and creative, but Ne as Inferior is a sudden burst of insight under pressure. Ability power scales off your stats.",
    },
  },
  {
    id: "socionics",
    name: "Socionics",
    description: "16 types across 4 quadras",
    domain: "Element",
    info: {
      what: "Socionics groups 16 types into 4 quadras (Alpha, Beta, Gamma, Delta), each sharing a pair of valued information elements. It also classifies types into clubs based on cognitive orientation.",
      mapping:
        "Your quadra determines your element: Alpha\u2192Light/Nature, Beta\u2192Fire/Shadow, Gamma\u2192Earth/Metal, Delta\u2192Wind/Water. Your club grants a passive trait that reflects your cognitive style.",
      detail:
        "Socionics uses different notation than MBTI (e.g. IEI, SLE) and types don\u2019t map 1-to-1 between the systems. The quadra element colors your character\u2019s abilities and aesthetic.",
    },
  },
  {
    id: "instincts",
    name: "Expanded Instincts",
    description: "9 realms across 3 centers",
    domain: "Combat",
    info: {
      what: "Expanded Instincts (by Rob Collopy) is separate from classic enneagram sp/so/sx. It maps 9 instinctual realms across 3 centers: Self-Survival (SUR), Interpersonal (INT), and Purpose (PUR). The core idea: types run toward aliveness, not away from fear.",
      mapping:
        "Your center sets combat orientation (SUR\u2192Frontline, INT\u2192Support, PUR\u2192Strategist). Three triad systems add activation style, positioning behavior, and resource regeneration source.",
      detail:
        "Optional tritype picks one realm from each center, adding 3\u20139 unique passives depending on triad overlap. This is the most granular system - it shapes how your character fights moment to moment.",
    },
  },
];
