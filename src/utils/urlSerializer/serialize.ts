import type {
  ManualOverrides,
  CharacterEdits,
  StatName,
  AbilitySlot,
  SystemId,
} from "../../engine/types/index.ts";
import type { BuilderSelections, EnabledSystems } from "../../types/builder.ts";

// ============================================================
// SERIALIZATION
// ============================================================

export function serializeToUrl(
  enabledSystems: EnabledSystems,
  selections: BuilderSelections,
  overrides: ManualOverrides,
  characterName?: string,
  edits?: CharacterEdits,
): URLSearchParams {
  const params = new URLSearchParams();

  // Systems bitmask: attitudinal, enneagram, mbti, socionics, instincts
  const systemOrder: SystemId[] = [
    "attitudinal",
    "enneagram",
    "mbti",
    "socionics",
    "instincts",
  ];
  const systemBits = systemOrder
    .map((id) => (enabledSystems[id] ? "1" : "0"))
    .join("");
  params.set("s", systemBits);

  // AP
  if (selections.attitudinal) params.set("ap", selections.attitudinal);

  // Enneagram
  if (selections.enneagramType)
    params.set("e", selections.enneagramType.toString());
  if (selections.enneagramWing)
    params.set("ew", selections.enneagramWing.toString());
  if (selections.enneagramInstinct)
    params.set("ei", selections.enneagramInstinct);

  // Instinct stacking
  if (selections.instinctStackEnabled) {
    params.set("es", "1");
    if (selections.instinctSecond) params.set("ei2", selections.instinctSecond);
  }

  // Enneagram tritype
  if (selections.tritypeEnabled) {
    params.set("et", "1");
    if (selections.tritypeSecondFix)
      params.set("e2", selections.tritypeSecondFix.toString());
    if (selections.tritypeSecondFixWing)
      params.set("e2w", selections.tritypeSecondFixWing.toString());
    if (selections.tritypeThirdFix)
      params.set("e3", selections.tritypeThirdFix.toString());
    if (selections.tritypeThirdFixWing)
      params.set("e3w", selections.tritypeThirdFixWing.toString());
  }

  // MBTI
  if (selections.mbti) params.set("m", selections.mbti);

  // Socionics
  if (selections.socionics) params.set("so", selections.socionics);

  // Instincts
  if (selections.instinctRealm) params.set("ir", selections.instinctRealm);
  if (selections.instinctTritypeEnabled) {
    params.set("irt", "1");
    if (selections.instinctSecondRealm)
      params.set("ir2", selections.instinctSecondRealm);
    if (selections.instinctThirdRealm)
      params.set("ir3", selections.instinctThirdRealm);
  }

  // Overrides
  if (overrides.stats) {
    const statKeyList: StatName[] = [
      "willpower",
      "intelligence",
      "spirit",
      "vitality",
    ];
    const statValueList = statKeyList
      .map((k) => overrides.stats?.[k] ?? "")
      .join(",");
    params.set("os", statValueList);
  }
  if (overrides.archetype) params.set("oa", overrides.archetype);
  if (overrides.abilities) {
    const slotList: AbilitySlot[] = ["hero", "parent", "child", "inferior"];
    params.set(
      "ob",
      slotList.map((slot) => overrides.abilities![slot]).join(","),
    );
  }
  if (overrides.element) params.set("oe", overrides.element);
  if (overrides.combatOrientation)
    params.set("oc", overrides.combatOrientation);

  // Character name (only if provided)
  if (characterName) params.set("n", characterName);

  // Character edits (post-generation customization)
  if (edits) {
    if (edits.stats) {
      const statKeyList: StatName[] = [
        "willpower",
        "intelligence",
        "spirit",
        "vitality",
      ];
      const statValueList = statKeyList
        .map((k) => edits.stats?.[k] ?? "")
        .join(",");
      params.set("cs", statValueList);
    }
    if (edits.className !== null) params.set("ccn", edits.className);
    if (edits.abilityNameList) {
      const slotList: AbilitySlot[] = ["hero", "parent", "child", "inferior"];
      const nameList = slotList
        .map((slot) => edits.abilityNameList?.[slot] ?? "")
        .join("|");
      params.set("can", nameList);
    }
    if (edits.element !== null) params.set("cel", edits.element);
    if (edits.combatOrientation !== null)
      params.set("cco", edits.combatOrientation);
  }

  return params;
}
