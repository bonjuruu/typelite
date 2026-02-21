import type {
  InstinctRealm,
  InstinctCenter,
  CombatBehavior,
  PassiveTrait,
} from "../../engine/types/index.ts";
import {
  INSTINCT_REALMS,
  CENTER_ORIENTATIONS,
  EXPERIENTIAL_PASSIVES,
  MOVEMENT_PASSIVES,
  SOURCE_PASSIVES,
} from "./types.ts";
import type { InstinctRealmData } from "./types.ts";

// ============================================================
// PUBLIC API
// ============================================================

export const INSTINCT_REALM_LIST: readonly InstinctRealm[] = [
  "FD",
  "SY",
  "SM",
  "AY",
  "CY",
  "BG",
  "SS",
  "EX",
  "UN",
] as const;

export const INSTINCT_CENTER_LIST: readonly InstinctCenter[] = [
  "SUR",
  "INT",
  "PUR",
] as const;

export const REALMS_BY_CENTER: Record<
  InstinctCenter,
  readonly InstinctRealm[]
> = {
  SUR: ["FD", "SY", "SM"],
  INT: ["AY", "CY", "BG"],
  PUR: ["SS", "EX", "UN"],
};

/** Get the center a realm belongs to. */
export function getRealmCenter(realm: InstinctRealm): InstinctCenter {
  return INSTINCT_REALMS[realm].center;
}

/** Get the core data for an instinct realm. */
export function getInstinctRealm(realm: InstinctRealm): InstinctRealmData {
  return INSTINCT_REALMS[realm];
}

/** Get the full display name for a realm (e.g. "FD" → "Fortitude"). */
export function getRealmName(realm: InstinctRealm): string {
  return INSTINCT_REALMS[realm].name;
}

/** Build the full CombatBehavior from a realm selection. */
export function buildCombatBehavior(realm: InstinctRealm): CombatBehavior {
  const realmData = INSTINCT_REALMS[realm];

  return {
    realm,
    center: realmData.center,
    combatOrientation: CENTER_ORIENTATIONS[realmData.center],
    activationStyle: realmData.experiential,
    positioning: realmData.movement,
    regenSource: realmData.source,
    passives: [
      EXPERIENTIAL_PASSIVES[realmData.experiential],
      MOVEMENT_PASSIVES[realmData.movement],
      SOURCE_PASSIVES[realmData.source],
    ],
  };
}

/**
 * Build CombatBehavior with tritype influences.
 * Tritype array is ordered: [core, 2nd fix, 3rd fix].
 * 2nd and 3rd fix add their passives (deduplicated by name).
 */
export function buildTritypeCombatBehavior(
  coreRealm: InstinctRealm,
  tritype: [InstinctRealm, InstinctRealm, InstinctRealm],
): CombatBehavior {
  const coreBehavior = buildCombatBehavior(coreRealm);

  const secondFixRealm = INSTINCT_REALMS[tritype[1]];
  const thirdFixRealm = INSTINCT_REALMS[tritype[2]];

  const secondFixPassiveList: PassiveTrait[] = [
    {
      ...EXPERIENTIAL_PASSIVES[secondFixRealm.experiential],
      source: `2nd fix - ${EXPERIENTIAL_PASSIVES[secondFixRealm.experiential].source}`,
    },
    {
      ...MOVEMENT_PASSIVES[secondFixRealm.movement],
      source: `2nd fix - ${MOVEMENT_PASSIVES[secondFixRealm.movement].source}`,
    },
    {
      ...SOURCE_PASSIVES[secondFixRealm.source],
      source: `2nd fix - ${SOURCE_PASSIVES[secondFixRealm.source].source}`,
    },
  ];

  const thirdFixPassiveList: PassiveTrait[] = [
    {
      ...EXPERIENTIAL_PASSIVES[thirdFixRealm.experiential],
      source: `3rd fix - ${EXPERIENTIAL_PASSIVES[thirdFixRealm.experiential].source}`,
    },
    {
      ...MOVEMENT_PASSIVES[thirdFixRealm.movement],
      source: `3rd fix - ${MOVEMENT_PASSIVES[thirdFixRealm.movement].source}`,
    },
    {
      ...SOURCE_PASSIVES[thirdFixRealm.source],
      source: `3rd fix - ${SOURCE_PASSIVES[thirdFixRealm.source].source}`,
    },
  ];

  // Deduplicate by passive name (keep core version when duplicate)
  const corePassiveNameSet = new Set(coreBehavior.passives.map((p) => p.name));
  const filteredSecondFixPassiveList = secondFixPassiveList.filter(
    (p) => !corePassiveNameSet.has(p.name),
  );

  const allPassiveNameSet = new Set([
    ...corePassiveNameSet,
    ...filteredSecondFixPassiveList.map((p) => p.name),
  ]);
  const filteredThirdFixPassiveList = thirdFixPassiveList.filter(
    (p) => !allPassiveNameSet.has(p.name),
  );

  return {
    ...coreBehavior,
    passives: [
      ...coreBehavior.passives,
      ...filteredSecondFixPassiveList,
      ...filteredThirdFixPassiveList,
    ],
  };
}

/** Get all realms in a given center. */
export function getRealmsByCenter(center: InstinctCenter): InstinctRealmData[] {
  return Object.values(INSTINCT_REALMS).filter(
    (realmData) => realmData.center === center,
  );
}
