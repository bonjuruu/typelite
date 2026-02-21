import type { SystemId } from "../../engine/types/index.ts";
import type { BuilderSelections } from "../../types/builder.ts";

export function getSelectionSummary(
  systemId: SystemId,
  selections: BuilderSelections,
): string | null {
  switch (systemId) {
    case "attitudinal":
      return selections.attitudinal ?? null;
    case "enneagram": {
      if (!selections.enneagramType) return null;
      const wing = selections.enneagramWing
        ? `w${selections.enneagramWing}`
        : "";
      const instinct = selections.enneagramInstinct ?? "";
      const stack =
        selections.instinctStackEnabled && selections.instinctSecond
          ? `/${selections.instinctSecond}`
          : "";
      const tritype =
        selections.tritypeEnabled &&
        selections.tritypeSecondFix &&
        selections.tritypeThirdFix
          ? ` ${selections.enneagramType}${selections.tritypeSecondFix}${selections.tritypeThirdFix}`
          : "";
      return `${selections.enneagramType}${wing} ${instinct}${stack}${tritype}`.trim();
    }
    case "mbti":
      return selections.mbti ?? null;
    case "socionics":
      return selections.socionics ?? null;
    case "instincts": {
      if (!selections.instinctRealm) return null;
      if (
        selections.instinctTritypeEnabled &&
        selections.instinctSecondRealm &&
        selections.instinctThirdRealm
      ) {
        return `${selections.instinctRealm} / ${selections.instinctSecondRealm} / ${selections.instinctThirdRealm}`;
      }
      return selections.instinctRealm;
    }
  }
}
