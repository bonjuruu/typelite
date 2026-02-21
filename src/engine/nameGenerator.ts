import type { Element, Archetype, ElementAffinity } from "./types/index.ts";

// ============================================================
// NAME GENERATION
// ============================================================

const NAME_PREFIXES = [
  "Ar",
  "Bel",
  "Cas",
  "Dor",
  "El",
  "Fen",
  "Gal",
  "Hal",
  "Ir",
  "Jas",
  "Kel",
  "Lor",
  "Mir",
  "Nor",
  "Or",
  "Pel",
  "Quin",
  "Ras",
  "Sol",
  "Thar",
  "Ul",
  "Vel",
  "Wen",
  "Xan",
  "Yor",
  "Zen",
];

const NAME_SUFFIXES = [
  "ith",
  "an",
  "os",
  "ara",
  "iel",
  "on",
  "is",
  "wyn",
  "ak",
  "en",
  "ur",
  "ova",
  "ix",
  "us",
  "ea",
  "or",
  "ine",
  "ash",
  "ek",
  "al",
];

const HARSH_PREFIXES = [
  "Krag",
  "Vex",
  "Brok",
  "Drak",
  "Thorn",
  "Grim",
  "Skar",
  "Rok",
  "Vor",
  "Zul",
  "Gor",
  "Brak",
  "Kael",
  "Mord",
  "Rax",
  "Durn",
];

const HARSH_SUFFIXES = [
  "ax",
  "urn",
  "ek",
  "ash",
  "or",
  "uk",
  "ath",
  "ark",
  "ex",
  "ol",
  "ag",
  "orn",
  "us",
  "an",
  "ik",
  "oz",
];

const FLOWING_PREFIXES = [
  "Ael",
  "Lumi",
  "Syl",
  "Eira",
  "Thel",
  "Ari",
  "Cel",
  "Ilya",
  "Mael",
  "Nai",
  "Sera",
  "Vel",
  "Wyn",
  "Elara",
  "Fael",
  "Liora",
];

const FLOWING_SUFFIXES = [
  "wyn",
  "iel",
  "ara",
  "ine",
  "ea",
  "iel",
  "ana",
  "ova",
  "ith",
  "ael",
  "wen",
  "ira",
  "iel",
  "ora",
  "una",
  "is",
];

const HARSH_CLASS_SET = new Set(["Berserker", "Warlord", "Justicar"]);
const HARSH_ELEMENT_SET = new Set<Element>(["Fire", "Shadow"]);
const FLOWING_CLASS_SET = new Set(["Cleric", "Druid", "Sage", "Bard"]);
const FLOWING_ELEMENT_SET = new Set<Element>(["Light", "Nature", "Water"]);

function pickNamePool(
  className: string,
  element: Element,
): { prefixList: string[]; suffixList: string[] } {
  const isHarsh =
    HARSH_CLASS_SET.has(className) || HARSH_ELEMENT_SET.has(element);
  const isFlowing =
    FLOWING_CLASS_SET.has(className) || FLOWING_ELEMENT_SET.has(element);

  if (isHarsh && !isFlowing)
    return { prefixList: HARSH_PREFIXES, suffixList: HARSH_SUFFIXES };
  if (isFlowing && !isHarsh)
    return { prefixList: FLOWING_PREFIXES, suffixList: FLOWING_SUFFIXES };
  return { prefixList: NAME_PREFIXES, suffixList: NAME_SUFFIXES };
}

export function generateName(className?: string, element?: Element): string {
  const { prefixList, suffixList } =
    className && element
      ? pickNamePool(className, element)
      : { prefixList: NAME_PREFIXES, suffixList: NAME_SUFFIXES };

  const prefix = prefixList[Math.floor(Math.random() * prefixList.length)];
  const suffix = suffixList[Math.floor(Math.random() * suffixList.length)];
  return prefix + suffix;
}

export function generateTitle(
  archetype: Archetype,
  element: ElementAffinity,
): string {
  return `${element.element} ${archetype.className}`;
}
