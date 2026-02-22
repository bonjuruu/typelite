import type {
  GeneratorInput,
  ManualOverrides,
  EnneagramNumber,
  EnneagramInstinct,
  InstinctRealm,
} from "../engine/types/index.ts";
import { ENNEAGRAM_INSTINCT_LIST } from "../data/enneagram/index.ts";
import type { BuilderSelections, EnabledSystems } from "../types/builder.ts";

// ============================================================
// PURE HELPERS
// ============================================================

export function buildGeneratorInput(
  enabledSystems: EnabledSystems,
  selections: BuilderSelections,
  overrides: ManualOverrides,
): GeneratorInput {
  return {
    attitudinal: enabledSystems.attitudinal ? selections.attitudinal : null,
    enneagram:
      enabledSystems.enneagram &&
      selections.enneagramType &&
      selections.enneagramWing &&
      selections.enneagramInstinct
        ? {
            type: selections.enneagramType,
            wing: selections.enneagramWing,
            instinct: selections.enneagramInstinct,
            ...(selections.instinctStackEnabled && selections.instinctSecond
              ? {
                  instinctStack: (() => {
                    const third = ENNEAGRAM_INSTINCT_LIST.find(
                      (i) =>
                        i !== selections.enneagramInstinct &&
                        i !== selections.instinctSecond,
                    );
                    if (!third)
                      return [
                        selections.enneagramInstinct,
                        selections.instinctSecond,
                        "sp",
                      ] as [
                        EnneagramInstinct,
                        EnneagramInstinct,
                        EnneagramInstinct,
                      ];
                    return [
                      selections.enneagramInstinct,
                      selections.instinctSecond,
                      third,
                    ] as [
                      EnneagramInstinct,
                      EnneagramInstinct,
                      EnneagramInstinct,
                    ];
                  })(),
                }
              : {}),
            ...(selections.tritypeEnabled &&
            selections.tritypeSecondFix &&
            selections.tritypeThirdFix
              ? {
                  tritype: [
                    selections.enneagramType,
                    selections.tritypeSecondFix,
                    selections.tritypeThirdFix,
                  ] as [EnneagramNumber, EnneagramNumber, EnneagramNumber],
                  ...(selections.tritypeSecondFixWing &&
                  selections.tritypeThirdFixWing
                    ? {
                        tritypeWings: [
                          selections.tritypeSecondFixWing,
                          selections.tritypeThirdFixWing,
                        ] as [EnneagramNumber, EnneagramNumber],
                      }
                    : {}),
                }
              : {}),
          }
        : null,
    mbti: enabledSystems.mbti ? selections.mbti : null,
    socionics: enabledSystems.socionics ? selections.socionics : null,
    instincts:
      enabledSystems.instincts && selections.instinctRealm
        ? {
            realm: selections.instinctRealm,
            ...(selections.instinctTritypeEnabled &&
            selections.instinctSecondRealm &&
            selections.instinctThirdRealm
              ? {
                  tritype: [
                    selections.instinctRealm,
                    selections.instinctSecondRealm,
                    selections.instinctThirdRealm,
                  ] as [InstinctRealm, InstinctRealm, InstinctRealm],
                }
              : {}),
          }
        : null,
    overrides,
  };
}

export function sanitizeEnabledSystems(
  enabled: EnabledSystems,
  selections: BuilderSelections,
): EnabledSystems {
  return {
    attitudinal: enabled.attitudinal && selections.attitudinal !== null,
    enneagram:
      enabled.enneagram &&
      selections.enneagramType !== null &&
      selections.enneagramWing !== null &&
      selections.enneagramInstinct !== null,
    mbti: enabled.mbti && selections.mbti !== null,
    socionics: enabled.socionics && selections.socionics !== null,
    instincts: enabled.instincts && selections.instinctRealm !== null,
  };
}

export function checkSelections(
  enabled: EnabledSystems,
  selections: BuilderSelections,
): boolean {
  if (enabled.attitudinal && !selections.attitudinal) return false;
  if (
    enabled.enneagram &&
    (!selections.enneagramType ||
      !selections.enneagramWing ||
      !selections.enneagramInstinct)
  )
    return false;
  if (enabled.mbti && !selections.mbti) return false;
  if (enabled.socionics && !selections.socionics) return false;
  if (enabled.instincts && !selections.instinctRealm) return false;
  return true;
}
