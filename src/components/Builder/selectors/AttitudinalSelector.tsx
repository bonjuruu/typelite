import type { APType } from "../../../engine/types/index.ts";
import type { BuilderSelections } from "../../../types/builder.ts";
import { AP_TYPE_LIST } from "../../../data/index.ts";
import { Select } from "../../common/Select.tsx";
import { StackBreakdown } from "./StackBreakdown.tsx";

// ============================================================
// SELECTOR
// ============================================================

interface AttitudinalSelectorProps {
  selections: BuilderSelections;
  onUpdateSelection: <K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => void;
}

export function AttitudinalSelector({
  selections,
  onUpdateSelection,
}: AttitudinalSelectorProps) {
  return (
    <div className="space-y-3">
      <Select
        value={selections.attitudinal ?? ""}
        onChange={(value) =>
          onUpdateSelection("attitudinal", (value as APType) || null)
        }
        placeholder="Select AP type..."
        optionList={AP_TYPE_LIST.map((type) => ({ value: type, label: type }))}
      />
      {selections.attitudinal && (
        <StackBreakdown apType={selections.attitudinal} />
      )}
    </div>
  );
}
