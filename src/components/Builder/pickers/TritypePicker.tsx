import type { EnneagramNumber } from "../../../engine/types/index.ts";
import type { BuilderSelections } from "../../../types/builder.ts";
import {
  getWings,
  getCenter,
  getEnneagramType,
  CENTER_TYPES,
  CENTER_LIST,
} from "../../../data/index.ts";
import { Select } from "../../common/Select.tsx";

interface TritypePickerProps {
  coreType: EnneagramNumber;
  selections: BuilderSelections;
  onUpdateSelection: <K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => void;
}

export function TritypePicker({
  coreType,
  selections,
  onUpdateSelection,
}: TritypePickerProps) {
  const coreCenter = getCenter(coreType);
  const otherCenterList = CENTER_LIST.filter((c) => c !== coreCenter);

  // Determine which center each fix belongs to (for labels)
  const secondFix = selections.tritypeSecondFix;
  const secondFixCenter = secondFix ? getCenter(secondFix) : null;
  // 3rd fix must come from whichever remaining center the 2nd fix didn't use
  const thirdFixCenterOptions = secondFixCenter
    ? otherCenterList.filter((c) => c !== secondFixCenter)
    : otherCenterList;

  // Options for 2nd fix: all types from both non-core centers
  const secondFixOptionList = otherCenterList.flatMap((center) =>
    CENTER_TYPES[center].map((type) => ({
      value: type.toString(),
      label: `${type} - ${getEnneagramType(type).className} (${center})`,
    })),
  );

  // Options for 3rd fix: only types from the remaining center
  const thirdFixOptionList = thirdFixCenterOptions.flatMap((center) =>
    CENTER_TYPES[center].map((type) => ({
      value: type.toString(),
      label: `${type} - ${getEnneagramType(type).className} (${center})`,
    })),
  );

  return (
    <div className="space-y-1.5">
      <span className="block text-[10px] font-semibold uppercase text-gray-500">
        Tritype - order affects stat influence
      </span>

      {/* Core (locked) */}
      <div className="flex items-center gap-2">
        <span className="w-14 text-xs font-medium text-indigo-400">Core</span>
        <span className="flex-1 rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-400">
          {coreType} - {getEnneagramType(coreType).className} (
          {coreCenter})
        </span>
      </div>

      {/* 2nd Fix */}
      <div className="flex items-center gap-2">
        <span className="w-14 text-xs font-medium text-gray-400">2nd</span>
        <div className="flex-1">
          <Select
            value={secondFix?.toString() ?? ""}
            onChange={(value) => {
              const newSecondFix = value
                ? (Number(value) as EnneagramNumber)
                : null;
              onUpdateSelection("tritypeSecondFix", newSecondFix);
              // Auto-set default wing for the new fix
              if (newSecondFix) {
                onUpdateSelection(
                  "tritypeSecondFixWing",
                  getWings(newSecondFix)[0],
                );
              } else {
                onUpdateSelection("tritypeSecondFixWing", null);
              }
              // Clear 3rd fix if it conflicts with the new 2nd fix's center
              if (newSecondFix && selections.tritypeThirdFix) {
                const newSecondCenter = getCenter(newSecondFix);
                const thirdCenter = getCenter(selections.tritypeThirdFix);
                if (newSecondCenter === thirdCenter) {
                  onUpdateSelection("tritypeThirdFix", null);
                  onUpdateSelection("tritypeThirdFixWing", null);
                }
              }
            }}
            placeholder="2nd fix..."
            optionList={secondFixOptionList}
          />
        </div>
        {secondFix && (
          <div className="w-20">
            <Select
              value={selections.tritypeSecondFixWing?.toString() ?? ""}
              onChange={(value) =>
                onUpdateSelection(
                  "tritypeSecondFixWing",
                  value ? (Number(value) as EnneagramNumber) : null,
                )
              }
              placeholder="w..."
              optionList={getWings(secondFix).map((wing) => ({
                value: wing.toString(),
                label: `w${wing}`,
              }))}
            />
          </div>
        )}
      </div>

      {/* 3rd Fix */}
      <div className="flex items-center gap-2">
        <span className="w-14 text-xs font-medium text-gray-400">3rd</span>
        <div className="flex-1">
          <Select
            value={selections.tritypeThirdFix?.toString() ?? ""}
            onChange={(value) => {
              const newThirdFix = value
                ? (Number(value) as EnneagramNumber)
                : null;
              onUpdateSelection("tritypeThirdFix", newThirdFix);
              if (newThirdFix) {
                onUpdateSelection(
                  "tritypeThirdFixWing",
                  getWings(newThirdFix)[0],
                );
              } else {
                onUpdateSelection("tritypeThirdFixWing", null);
              }
            }}
            placeholder="3rd fix..."
            optionList={thirdFixOptionList}
          />
        </div>
        {selections.tritypeThirdFix && (
          <div className="w-20">
            <Select
              value={selections.tritypeThirdFixWing?.toString() ?? ""}
              onChange={(value) =>
                onUpdateSelection(
                  "tritypeThirdFixWing",
                  value ? (Number(value) as EnneagramNumber) : null,
                )
              }
              placeholder="w..."
              optionList={getWings(selections.tritypeThirdFix).map((wing) => ({
                value: wing.toString(),
                label: `w${wing}`,
              }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
