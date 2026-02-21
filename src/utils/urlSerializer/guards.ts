import type {
  APType,
  MBTIType,
  SocionicsType,
  EnneagramNumber,
  EnneagramInstinct,
  InstinctRealm,
  Element as GameElement,
  ManualOverrides,
  CharacterEdits,
  CognitiveFunction,
} from "../../engine/types/index.ts";
import type { BuilderSelections, EnabledSystems } from "../../types/builder.ts";

// ============================================================
// VALIDATION SETS
// ============================================================

export const AP_TYPE_SET = new Set<string>([
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
]);

export const MBTI_TYPE_SET = new Set<string>([
  "INTJ",
  "INTP",
  "ENTJ",
  "ENTP",
  "INFJ",
  "INFP",
  "ENFJ",
  "ENFP",
  "ISTJ",
  "ISFJ",
  "ESTJ",
  "ESFJ",
  "ISTP",
  "ISFP",
  "ESTP",
  "ESFP",
]);

export const SOCIONICS_TYPE_SET = new Set<string>([
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
]);

export const INSTINCT_SET = new Set<string>(["sp", "so", "sx"]);
export const REALM_SET = new Set<string>([
  "FD",
  "SY",
  "SM",
  "AY",
  "CY",
  "BG",
  "SS",
  "EX",
  "UN",
]);
export const ELEMENT_SET = new Set<string>([
  "Light",
  "Nature",
  "Fire",
  "Shadow",
  "Earth",
  "Metal",
  "Wind",
  "Water",
]);
export const COGNITIVE_FN_SET = new Set<string>([
  "Ti",
  "Te",
  "Fi",
  "Fe",
  "Si",
  "Se",
  "Ni",
  "Ne",
]);

// ============================================================
// TYPE GUARDS
// ============================================================

export function isAPType(value: string): value is APType {
  return AP_TYPE_SET.has(value);
}
export function isMBTIType(value: string): value is MBTIType {
  return MBTI_TYPE_SET.has(value);
}
export function isSocionicsType(value: string): value is SocionicsType {
  return SOCIONICS_TYPE_SET.has(value);
}
export function isEnneagramInstinct(value: string): value is EnneagramInstinct {
  return INSTINCT_SET.has(value);
}
export function isInstinctRealm(value: string): value is InstinctRealm {
  return REALM_SET.has(value);
}
export function isElement(value: string): value is GameElement {
  return ELEMENT_SET.has(value);
}
export function isCognitiveFunction(value: string): value is CognitiveFunction {
  return COGNITIVE_FN_SET.has(value);
}

export function parseEnneagramNumber(value: string | null): EnneagramNumber | null {
  if (!value) return null;
  const num = Number(value);
  if (num >= 1 && num <= 9) return num as EnneagramNumber;
  return null;
}

// ============================================================
// DESERIALIZED STATE
// ============================================================

export interface DeserializedState {
  enabledSystems: EnabledSystems;
  selections: BuilderSelections;
  overrides: ManualOverrides;
  characterName?: string;
  edits?: CharacterEdits;
}
