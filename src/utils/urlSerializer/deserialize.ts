import type {
  ManualOverrides,
  CharacterEdits,
  StatName,
  AbilitySlot,
  SystemId,
} from "../../engine/types/index.ts";
import { EMPTY_CHARACTER_EDITS } from "../../engine/types/index.ts";
import type { EnabledSystems } from "../../types/builder.ts";
import {
  isAPType,
  isMBTIType,
  isSocionicsType,
  isEnneagramInstinct,
  isInstinctRealm,
  isElement,
  isCognitiveFunction,
  parseEnneagramNumber,
} from "./guards.ts";
import type { DeserializedState } from "./guards.ts";

// ============================================================
// DESERIALIZATION
// ============================================================

export function deserializeFromUrl(
  params: URLSearchParams,
): DeserializedState | null {
  const systemBits = params.get("s");
  if (!systemBits || systemBits.length !== 5) return null;

  const systemOrder: SystemId[] = [
    "attitudinal",
    "enneagram",
    "mbti",
    "socionics",
    "instincts",
  ];
  const enabledSystems: EnabledSystems = {
    attitudinal: true,
    enneagram: true,
    mbti: true,
    socionics: true,
    instincts: true,
  };
  for (let i = 0; i < 5; i++) {
    enabledSystems[systemOrder[i]] = systemBits[i] === "1";
  }

  // AP
  const apRaw = params.get("ap");
  const attitudinal = apRaw && isAPType(apRaw) ? apRaw : null;

  // Enneagram
  const enneagramType = parseEnneagramNumber(params.get("e"));
  const enneagramWing = parseEnneagramNumber(params.get("ew"));
  const eiRaw = params.get("ei");
  const enneagramInstinct = eiRaw && isEnneagramInstinct(eiRaw) ? eiRaw : null;

  const instinctStackEnabled = params.get("es") === "1";
  const ei2Raw = params.get("ei2");
  const instinctSecond = ei2Raw && isEnneagramInstinct(ei2Raw) ? ei2Raw : null;

  const tritypeEnabled = params.get("et") === "1";
  const tritypeSecondFix = parseEnneagramNumber(params.get("e2"));
  const tritypeSecondFixWing = parseEnneagramNumber(params.get("e2w"));
  const tritypeThirdFix = parseEnneagramNumber(params.get("e3"));
  const tritypeThirdFixWing = parseEnneagramNumber(params.get("e3w"));

  // MBTI
  const mRaw = params.get("m");
  const mbti = mRaw && isMBTIType(mRaw) ? mRaw : null;

  // Socionics
  const soRaw = params.get("so");
  const socionics = soRaw && isSocionicsType(soRaw) ? soRaw : null;

  // Instincts
  const irRaw = params.get("ir");
  const instinctRealm = irRaw && isInstinctRealm(irRaw) ? irRaw : null;
  const instinctTritypeEnabled = params.get("irt") === "1";
  const ir2Raw = params.get("ir2");
  const instinctSecondRealm = ir2Raw && isInstinctRealm(ir2Raw) ? ir2Raw : null;
  const ir3Raw = params.get("ir3");
  const instinctThirdRealm = ir3Raw && isInstinctRealm(ir3Raw) ? ir3Raw : null;

  // Overrides
  const overrides: ManualOverrides = {
    stats: null,
    archetype: null,
    abilities: null,
    element: null,
    combatOrientation: null,
  };

  const osRaw = params.get("os");
  if (osRaw) {
    const statKeyList: StatName[] = [
      "willpower",
      "intelligence",
      "spirit",
      "vitality",
    ];
    const valueList = osRaw.split(",");
    if (valueList.length === 4) {
      const stats: Partial<Record<StatName, number>> = {};
      for (let i = 0; i < 4; i++) {
        const num = Number(valueList[i]);
        if (!isNaN(num) && num >= 1 && num <= 20) {
          stats[statKeyList[i]] = num;
        }
      }
      if (Object.keys(stats).length > 0) overrides.stats = stats;
    }
  }

  const oaRaw = params.get("oa");
  if (oaRaw) overrides.archetype = oaRaw;

  const obRaw = params.get("ob");
  if (obRaw) {
    const fnList = obRaw.split(",");
    if (fnList.length === 4 && fnList.every(isCognitiveFunction)) {
      overrides.abilities = {
        hero: fnList[0],
        parent: fnList[1],
        child: fnList[2],
        inferior: fnList[3],
      };
    }
  }

  const oeRaw = params.get("oe");
  if (oeRaw && isElement(oeRaw)) overrides.element = oeRaw;

  const ocRaw = params.get("oc");
  if (ocRaw) overrides.combatOrientation = ocRaw;

  const characterName = params.get("n") || undefined;

  // Character edits
  let edits: CharacterEdits | undefined;
  const csRaw = params.get("cs");
  const ccnRaw = params.get("ccn");
  const canRaw = params.get("can");
  const celRaw = params.get("cel");
  const ccoRaw = params.get("cco");

  if (csRaw || ccnRaw || canRaw || celRaw || ccoRaw) {
    edits = { ...EMPTY_CHARACTER_EDITS };

    if (csRaw) {
      const statKeyList: StatName[] = [
        "willpower",
        "intelligence",
        "spirit",
        "vitality",
      ];
      const valueList = csRaw.split(",");
      if (valueList.length === 4) {
        const stats: Partial<Record<StatName, number>> = {};
        for (let i = 0; i < 4; i++) {
          const num = Number(valueList[i]);
          if (!isNaN(num) && num >= 1 && num <= 20) {
            stats[statKeyList[i]] = num;
          }
        }
        if (Object.keys(stats).length > 0) edits.stats = stats;
      }
    }

    if (ccnRaw) edits.className = ccnRaw;
    if (canRaw) {
      const slotList: AbilitySlot[] = ["hero", "parent", "child", "inferior"];
      const nameList = canRaw.split("|");
      if (nameList.length === 4) {
        const abilityNameList: Partial<Record<AbilitySlot, string>> = {};
        for (let i = 0; i < 4; i++) {
          if (nameList[i]) abilityNameList[slotList[i]] = nameList[i];
        }
        if (Object.keys(abilityNameList).length > 0)
          edits.abilityNameList = abilityNameList;
      }
    }
    if (celRaw && isElement(celRaw)) edits.element = celRaw;
    if (ccoRaw) edits.combatOrientation = ccoRaw;
  }

  return {
    enabledSystems,
    edits,
    selections: {
      attitudinal,
      enneagramType,
      enneagramWing,
      enneagramInstinct,
      instinctStackEnabled,
      instinctSecond,
      tritypeEnabled,
      tritypeSecondFix,
      tritypeSecondFixWing,
      tritypeThirdFix,
      tritypeThirdFixWing,
      mbti,
      socionics,
      instinctRealm,
      instinctTritypeEnabled,
      instinctSecondRealm,
      instinctThirdRealm,
    },
    overrides,
    characterName,
  };
}
