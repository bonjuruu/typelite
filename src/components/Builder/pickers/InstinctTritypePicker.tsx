import type { InstinctRealm } from "../../../engine/types/index.ts";
import type { BuilderSelections } from "../../../types/builder.ts";
import {
  getRealmName,
  getRealmCenter,
  INSTINCT_CENTER_LIST,
  REALMS_BY_CENTER,
} from "../../../data/index.ts";
import { Select } from "../../common/Select.tsx";

interface InstinctTritypePickerProps {
  coreRealm: InstinctRealm;
  selections: BuilderSelections;
  onUpdateSelection: <K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => void;
}

export function InstinctTritypePicker({
  coreRealm,
  selections,
  onUpdateSelection,
}: InstinctTritypePickerProps) {
  const coreCenter = getRealmCenter(coreRealm);
  const otherCenterList = INSTINCT_CENTER_LIST.filter((c) => c !== coreCenter);

  // Determine which center the 2nd realm belongs to
  const secondRealm = selections.instinctSecondRealm;
  const secondRealmCenter = secondRealm ? getRealmCenter(secondRealm) : null;
  // 3rd realm must come from whichever remaining center the 2nd didn't use
  const thirdRealmCenterOptions = secondRealmCenter
    ? otherCenterList.filter((c) => c !== secondRealmCenter)
    : otherCenterList;

  // Options for 2nd realm: all realms from both non-core centers
  const secondRealmOptionList = otherCenterList.flatMap((center) =>
    REALMS_BY_CENTER[center].map((realm) => ({
      value: realm,
      label: `${realm} - ${getRealmName(realm)} (${center})`,
    })),
  );

  // Options for 3rd realm: only realms from the remaining center
  const thirdRealmOptionList = thirdRealmCenterOptions.flatMap((center) =>
    REALMS_BY_CENTER[center].map((realm) => ({
      value: realm,
      label: `${realm} - ${getRealmName(realm)} (${center})`,
    })),
  );

  return (
    <div className="space-y-1.5">
      <span className="block text-[10px] font-semibold uppercase text-gray-500">
        Tritype - adds passives from other centers
      </span>

      {/* Core (locked) */}
      <div className="flex items-center gap-2">
        <span className="w-14 text-xs font-medium text-indigo-400">Core</span>
        <span className="flex-1 rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-sm text-gray-400">
          {coreRealm} - {getRealmName(coreRealm)} ({coreCenter})
        </span>
      </div>

      {/* 2nd Realm */}
      <div className="flex items-center gap-2">
        <span className="w-14 text-xs font-medium text-gray-400">2nd</span>
        <div className="flex-1">
          <Select
            value={secondRealm ?? ""}
            onChange={(value) => {
              const newSecondRealm = (value as InstinctRealm) || null;
              onUpdateSelection("instinctSecondRealm", newSecondRealm);
              // Clear 3rd realm if it conflicts with the new 2nd realm's center
              if (newSecondRealm && selections.instinctThirdRealm) {
                const newSecondCenter = getRealmCenter(newSecondRealm);
                const thirdCenter = getRealmCenter(
                  selections.instinctThirdRealm,
                );
                if (newSecondCenter === thirdCenter) {
                  onUpdateSelection("instinctThirdRealm", null);
                }
              }
            }}
            placeholder="2nd realm..."
            optionList={secondRealmOptionList}
          />
        </div>
      </div>

      {/* 3rd Realm */}
      <div className="flex items-center gap-2">
        <span className="w-14 text-xs font-medium text-gray-400">3rd</span>
        <div className="flex-1">
          <Select
            value={selections.instinctThirdRealm ?? ""}
            onChange={(value) =>
              onUpdateSelection(
                "instinctThirdRealm",
                (value as InstinctRealm) || null,
              )
            }
            placeholder="3rd realm..."
            optionList={thirdRealmOptionList}
          />
        </div>
      </div>
    </div>
  );
}
