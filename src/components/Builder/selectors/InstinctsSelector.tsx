import type { InstinctRealm } from "../../../engine/types/index.ts";
import type { BuilderSelections } from "../../../types/builder.ts";
import { INSTINCT_REALM_LIST, getRealmName } from "../../../data/index.ts";
import { Select } from "../../common/Select.tsx";
import { Toggle } from "../../common/Toggle.tsx";
import { InstinctTritypePicker } from "../pickers/InstinctTritypePicker.tsx";

interface InstinctsSelectorProps {
  selections: BuilderSelections;
  onUpdateSelection: <K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => void;
}

export function InstinctsSelector({
  selections,
  onUpdateSelection,
}: InstinctsSelectorProps) {
  return (
    <div className="space-y-3">
      <Select
        value={selections.instinctRealm ?? ""}
        onChange={(value) => {
          onUpdateSelection("instinctRealm", (value as InstinctRealm) || null);
          if (!value) {
            onUpdateSelection("instinctSecondRealm", null);
            onUpdateSelection("instinctThirdRealm", null);
          }
        }}
        placeholder="Select realm..."
        optionList={INSTINCT_REALM_LIST.map((realm) => ({
          value: realm,
          label: `${realm} — ${getRealmName(realm)}`,
        }))}
      />

      {/* Instinct tritype toggle */}
      <div className="flex items-center gap-2">
        <Toggle
          checked={selections.instinctTritypeEnabled}
          onChange={() =>
            onUpdateSelection(
              "instinctTritypeEnabled",
              !selections.instinctTritypeEnabled,
            )
          }
          aria-label="Toggle instinct tritype"
          size="sm"
        />
        <span className="text-xs text-gray-400">Tritype</span>
      </div>

      {/* Instinct tritype pickers */}
      {selections.instinctTritypeEnabled && selections.instinctRealm && (
        <InstinctTritypePicker
          coreRealm={selections.instinctRealm}
          selections={selections}
          onUpdateSelection={onUpdateSelection}
        />
      )}
    </div>
  );
}
