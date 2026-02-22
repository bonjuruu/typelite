/**
 * Barrel export for data modules.
 * Components should import data constants and helpers from here
 * instead of importing individual data files directly.
 */

// Attitudinal Psyche
export { AP_TYPE_LIST, describeStack } from "./attitudinal.ts";
export type { StackPositionDetail } from "./attitudinal.ts";

// Enneagram
export {
  ENNEAGRAM_TYPE_LIST,
  ENNEAGRAM_INSTINCT_LIST,
  getWings,
  CENTER_TYPES,
  CENTER_LIST,
  getCenter,
  getEnneagramType,
  getInstinctLabel,
  getInstinctFullName,
  getWingFlavor,
} from "./enneagram/index.ts";
export type { EnneagramCenter } from "./enneagram/index.ts";

// MBTI
export {
  MBTI_TYPE_LIST,
  getAbilityName,
  getCognitiveFunctionEssence,
  getTagDescription,
  getFunctionStack,
  getCognitiveFunctionName,
} from "./mbti/index.ts";

// Socionics
export {
  SOCIONICS_TYPE_LIST,
  getSocionicsType,
  getQuadraRationale,
  getQuadraDescription,
  getClubDescription,
  CLUB_PASSIVES,
} from "./socionics.ts";

// Instincts
export {
  INSTINCT_REALM_LIST,
  getRealmName,
  getRealmCenter,
  getInstinctRealm,
  getTriadDescription,
  getTriadEPDescription,
  TRIAD_CATEGORY_DESCRIPTIONS,
  INSTINCT_CENTER_LIST,
  REALMS_BY_CENTER,
} from "./instincts/index.ts";

// Abilities
export { SLOT_LABELS } from "./abilities.ts";

// Elements
export { ELEMENT_LIST, ELEMENT_EMOJI } from "./elements.ts";

// Stats
export { STAT_CONFIG, STAT_LABELS } from "./stats.ts";
