// ============================================================
// STATS
// ============================================================

export interface StatBlock {
  willpower: number;    // derived from Volition (AP)
  intelligence: number; // derived from Logic (AP)
  spirit: number;       // derived from Emotion (AP)
  vitality: number;     // derived from Physics (AP)
}

export type StatName = keyof StatBlock;

// ============================================================
// ABILITIES (from MBTI)
// ============================================================

export type AbilitySlot = 'hero' | 'parent' | 'child' | 'inferior';

export interface Ability {
  name: string;
  description: string;
  slot: AbilitySlot;
  cognitiveFunction: CognitiveFunction;
  /** Base power before stat scaling */
  basePower: number;
  /** Which stat this ability scales off */
  scalingStat: StatName;
  /** Tags for flavor/categorization */
  tags: AbilityTag[];
}

export type AbilityTag =
  | 'damage'
  | 'heal'
  | 'buff'
  | 'debuff'
  | 'utility'
  | 'aoe'
  | 'single-target'
  | 'self'
  | 'chaotic'
  | 'defensive'
  | 'reactive';

// ============================================================
// ARCHETYPE (from Enneagram)
// ============================================================

export interface Archetype {
  className: string;
  description: string;
  enneagramType: EnneagramNumber;
  wing: number;
  /** Stat modifiers applied on top of AP base stats (multipliers) */
  statModifiers: Partial<Record<StatName, number>>;
  /** Buff when character is "empowered" (integration line) */
  empoweredState: StatusEffect;
  /** Debuff when character is "stressed" (disintegration line) */
  stressedState: StatusEffect;
  /** Passive from dominant instinctual variant (sp/so/sx) */
  instinctPassive?: PassiveTrait;
  /** Full instinct stacking passives (dominant + 2nd + blind spot) */
  instinctPassiveList?: PassiveTrait[];
}

export interface StatusEffect {
  name: string;
  description: string;
  statChanges: Partial<Record<StatName, number>>;
}

// ============================================================
// ELEMENT (from Socionics)
// ============================================================

export type Element =
  | 'Light'
  | 'Nature'
  | 'Fire'
  | 'Shadow'
  | 'Earth'
  | 'Metal'
  | 'Wind'
  | 'Water';

export type Quadra = 'Alpha' | 'Beta' | 'Gamma' | 'Delta';

export type Club = 'Researcher' | 'Social' | 'Practical' | 'Humanitarian';

export interface ElementAffinity {
  element: Element;
  quadra: Quadra;
  club: Club;
  passiveTrait: PassiveTrait;
}

export interface PassiveTrait {
  name: string;
  description: string;
  source: string;
}

// ============================================================
// COMBAT BEHAVIOR (from Expanded Instincts)
// ============================================================

export type InstinctCenter = 'SUR' | 'INT' | 'PUR';

export type InstinctRealm =
  | 'FD'  // Fortitude
  | 'SY'  // Security
  | 'SM'  // Self-Management
  | 'AY'  // Alchemy
  | 'CY'  // Community
  | 'BG'  // Bonding
  | 'SS'  // Self-Significance
  | 'EX'  // Existentialism
  | 'UN'; // Unknown

export type ExperientialTriad = 'Memorializing' | 'Immersing' | 'Distinguishing';
export type MovementTriad = 'Escaping' | 'Aligning' | 'Directing';
export type SourceTriad = 'Internalizing' | 'Externalizing' | 'Exchanging';

export interface CombatBehavior {
  realm: InstinctRealm;
  center: InstinctCenter;
  combatOrientation: string;
  activationStyle: ExperientialTriad;
  positioning: MovementTriad;
  regenSource: SourceTriad;
  passives: PassiveTrait[];
}

// ============================================================
// TYPOLOGY SYSTEM INPUTS
// ============================================================

export type CognitiveFunction =
  | 'Ti' | 'Te'
  | 'Fi' | 'Fe'
  | 'Si' | 'Se'
  | 'Ni' | 'Ne';

export type MBTIType =
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export type EnneagramNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type EnneagramInstinct = 'sp' | 'so' | 'sx';

/** All 24 AP type orderings */
export type APType =
  | 'VLEF' | 'VLFE' | 'VELF' | 'VEFL' | 'VFEL' | 'VFLE'
  | 'LVEF' | 'LVFE' | 'LEVF' | 'LEFV' | 'LFEV' | 'LFVE'
  | 'EVLF' | 'EVFL' | 'ELVF' | 'ELFV' | 'EFLV' | 'EFVL'
  | 'FVLE' | 'FVEL' | 'FLVE' | 'FLEV' | 'FEVL' | 'FELV';

export type SocionicsType =
  | 'ILE' | 'SEI' | 'ESE' | 'LII'   // Alpha
  | 'SLE' | 'IEI' | 'EIE' | 'LSI'   // Beta
  | 'SEE' | 'ILI' | 'LIE' | 'ESI'   // Gamma
  | 'IEE' | 'SLI' | 'LSE' | 'EII';  // Delta

// ============================================================
// GENERATOR INPUT / OUTPUT
// ============================================================

export interface GeneratorInput {
  mbti: MBTIType | null;
  enneagram: { type: EnneagramNumber; wing: EnneagramNumber; instinct: EnneagramInstinct; instinctStack?: [EnneagramInstinct, EnneagramInstinct, EnneagramInstinct]; tritype?: [EnneagramNumber, EnneagramNumber, EnneagramNumber]; tritypeWings?: [EnneagramNumber, EnneagramNumber] } | null;
  attitudinal: APType | null;
  socionics: SocionicsType | null;
  instincts: { realm: InstinctRealm; tritype?: [InstinctRealm, InstinctRealm, InstinctRealm] } | null;
  overrides: ManualOverrides;
}

export interface AbilityOverrides {
  hero: CognitiveFunction;
  parent: CognitiveFunction;
  child: CognitiveFunction;
  inferior: CognitiveFunction;
}

export interface ManualOverrides {
  stats: Partial<StatBlock> | null;
  archetype: string | null;
  abilities: AbilityOverrides | null;
  element: Element | null;
  combatOrientation: string | null;
}

export type SystemId = 'mbti' | 'enneagram' | 'attitudinal' | 'socionics' | 'instincts';

export interface SystemConfig {
  id: SystemId;
  name: string;
  description: string;
  enabled: boolean;
}

export interface StatBreakdown {
  base: StatBlock;
  baseSource: string;
  multipliers: Partial<Record<StatName, number>>;
  multiplierSource: string;
  overrides: Partial<StatBlock> | null;
}

export interface Character {
  name: string;
  title: string;
  stats: StatBlock;
  statBreakdown: StatBreakdown;
  archetype: Archetype;
  abilities: Ability[];
  element: ElementAffinity;
  combatBehavior: CombatBehavior;
  /** Track which systems contributed to this character */
  activeSystems: SystemId[];
}
