import type { SocionicsType } from "../../../engine/types/index.ts";
import type { BuilderSelections } from "../../../types/builder.ts";
import { SOCIONICS_TYPE_LIST, getSocionicsType } from "../../../data/index.ts";
import { Select } from "../../common/Select.tsx";

interface SocionicsSelectorProps {
  selections: BuilderSelections;
  onUpdateSelection: <K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => void;
}

export function SocionicsSelector({
  selections,
  onUpdateSelection,
}: SocionicsSelectorProps) {
  return (
    <Select
      value={selections.socionics ?? ""}
      onChange={(value) =>
        onUpdateSelection("socionics", (value as SocionicsType) || null)
      }
      placeholder="Select Socionics type..."
      optionList={SOCIONICS_TYPE_LIST.map((type) => ({
        value: type,
        label: `${type} — ${getSocionicsType(type).name}`,
      }))}
    />
  );
}
