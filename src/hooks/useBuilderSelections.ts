import { useState, useCallback } from "react";
import type {
  SystemId,
  ManualOverrides,
  EnneagramNumber,
} from "../engine/types/index.ts";
import type { BuilderSelections, EnabledSystems } from "../types/builder.ts";
import { AP_TYPE_LIST } from "../data/attitudinal.ts";
import {
  ENNEAGRAM_TYPE_LIST,
  ENNEAGRAM_INSTINCT_LIST,
  getWings,
  CENTER_TYPES,
  CENTER_LIST,
  getCenter,
} from "../data/enneagram/index.ts";
import { MBTI_TYPE_LIST } from "../data/mbti/index.ts";
import { SOCIONICS_TYPE_LIST } from "../data/socionics.ts";
import {
  INSTINCT_REALM_LIST,
  INSTINCT_CENTER_LIST,
  REALMS_BY_CENTER,
  getRealmCenter,
} from "../data/instincts/index.ts";

// ============================================================
// CONSTANTS
// ============================================================

export const INITIAL_ENABLED: EnabledSystems = {
  attitudinal: true,
  enneagram: true,
  mbti: true,
  socionics: true,
  instincts: true,
};

export const INITIAL_SELECTIONS: BuilderSelections = {
  attitudinal: null,
  enneagramType: null,
  enneagramWing: null,
  enneagramInstinct: null,
  instinctStackEnabled: false,
  instinctSecond: null,
  tritypeEnabled: false,
  tritypeSecondFix: null,
  tritypeSecondFixWing: null,
  tritypeThirdFix: null,
  tritypeThirdFixWing: null,
  mbti: null,
  socionics: null,
  instinctRealm: null,
  instinctTritypeEnabled: false,
  instinctSecondRealm: null,
  instinctThirdRealm: null,
};

export const INITIAL_OVERRIDES: ManualOverrides = {
  stats: null,
  archetype: null,
  abilities: null,
  element: null,
  combatOrientation: null,
};

// ============================================================
// HOOK
// ============================================================

export function useBuilderSelections() {
  const [enabledSystems, setEnabledSystems] =
    useState<EnabledSystems>(INITIAL_ENABLED);
  const [selections, setSelections] =
    useState<BuilderSelections>(INITIAL_SELECTIONS);
  const [overrides, setOverrides] =
    useState<ManualOverrides>(INITIAL_OVERRIDES);

  const toggleSystem = useCallback((systemId: SystemId) => {
    setEnabledSystems((prev) => ({ ...prev, [systemId]: !prev[systemId] }));
  }, []);

  const updateSelection = useCallback(
    <K extends keyof BuilderSelections>(
      key: K,
      value: BuilderSelections[K],
    ) => {
      setSelections((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const updateOverride = useCallback(
    <K extends keyof ManualOverrides>(key: K, value: ManualOverrides[K]) => {
      setOverrides((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const setEnneagramType = useCallback((type: EnneagramNumber | null) => {
    setSelections((prev) => {
      if (!type)
        return {
          ...prev,
          enneagramType: null,
          enneagramWing: null,
          enneagramInstinct: null,
          instinctSecond: null,
          tritypeSecondFix: null,
          tritypeSecondFixWing: null,
          tritypeThirdFix: null,
          tritypeThirdFixWing: null,
        };
      const validWingList = getWings(type);
      return {
        ...prev,
        enneagramType: type,
        enneagramWing: validWingList[0],
        enneagramInstinct: prev.enneagramInstinct ?? "sp",
        tritypeSecondFix: null,
        tritypeSecondFixWing: null,
        tritypeThirdFix: null,
        tritypeThirdFixWing: null,
      };
    });
  }, []);

  const randomizeSystem = useCallback(
    (systemId: SystemId) => {
      switch (systemId) {
        case "attitudinal":
          updateSelection("attitudinal", pickRandom(AP_TYPE_LIST));
          break;
        case "enneagram":
          setSelections((prev) => ({
            ...prev,
            ...randomizeEnneagramSelections(prev),
          }));
          break;
        case "mbti":
          updateSelection("mbti", pickRandom(MBTI_TYPE_LIST));
          break;
        case "socionics":
          updateSelection("socionics", pickRandom(SOCIONICS_TYPE_LIST));
          break;
        case "instincts":
          setSelections((prev) => ({
            ...prev,
            ...randomizeInstinctsSelections(prev),
          }));
          break;
      }
    },
    [updateSelection],
  );

  return {
    enabledSystems,
    selections,
    overrides,
    setEnabledSystems,
    setSelections,
    setOverrides,
    toggleSystem,
    updateSelection,
    updateOverride,
    setEnneagramType,
    randomizeSystem,
  };
}

// ============================================================
// HELPERS
// ============================================================

export function pickRandom<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

export function randomizeEnneagramSelections(
  prev: BuilderSelections,
): Partial<BuilderSelections> {
  const type = pickRandom(ENNEAGRAM_TYPE_LIST);
  const instinct = pickRandom(ENNEAGRAM_INSTINCT_LIST);
  const coreCenter = getCenter(type);

  const update: Partial<BuilderSelections> = {
    enneagramType: type,
    enneagramWing: pickRandom(getWings(type)),
    enneagramInstinct: instinct,
  };

  if (prev.instinctStackEnabled) {
    const remainingInstinctList = ENNEAGRAM_INSTINCT_LIST.filter(
      (i) => i !== instinct,
    );
    update.instinctSecond = pickRandom(remainingInstinctList);
  }

  if (prev.tritypeEnabled) {
    const otherCenterList = CENTER_LIST.filter((c) => c !== coreCenter);
    const secondFix = pickRandom(CENTER_TYPES[otherCenterList[0]]);
    const thirdFix = pickRandom(CENTER_TYPES[otherCenterList[1]]);
    update.tritypeSecondFix = secondFix;
    update.tritypeSecondFixWing = pickRandom(getWings(secondFix));
    update.tritypeThirdFix = thirdFix;
    update.tritypeThirdFixWing = pickRandom(getWings(thirdFix));
  }

  return update;
}

export function randomizeInstinctsSelections(
  prev: BuilderSelections,
): Partial<BuilderSelections> {
  const realm = pickRandom(INSTINCT_REALM_LIST);
  const update: Partial<BuilderSelections> = { instinctRealm: realm };

  if (prev.instinctTritypeEnabled) {
    const realmCenter = getRealmCenter(realm);
    const otherCenterList = INSTINCT_CENTER_LIST.filter(
      (c) => c !== realmCenter,
    );
    update.instinctSecondRealm = pickRandom(
      REALMS_BY_CENTER[otherCenterList[0]],
    );
    update.instinctThirdRealm = pickRandom(
      REALMS_BY_CENTER[otherCenterList[1]],
    );
  }

  return update;
}
