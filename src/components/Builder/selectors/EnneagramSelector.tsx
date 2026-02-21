import type {
  EnneagramNumber,
  EnneagramInstinct,
} from "../../../engine/types/index.ts";
import type { BuilderSelections } from "../../../types/builder.ts";
import {
  ENNEAGRAM_TYPE_LIST,
  ENNEAGRAM_INSTINCT_LIST,
  getWings,
  getEnneagramType,
  getInstinctLabel,
  getInstinctFullName,
} from "../../../data/index.ts";
import { Select } from "../../common/Select.tsx";
import { Toggle } from "../../common/Toggle.tsx";
import { TritypePicker } from "../pickers/TritypePicker.tsx";

// ============================================================
// SELECTOR
// ============================================================

interface EnneagramSelectorProps {
  selections: BuilderSelections;
  onUpdateSelection: <K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => void;
  onSetEnneagramType: (type: EnneagramNumber | null) => void;
}

export function EnneagramSelector({
  selections,
  onUpdateSelection,
  onSetEnneagramType,
}: EnneagramSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="flex-1">
          <Select
            value={selections.enneagramType?.toString() ?? ""}
            onChange={(value) =>
              onSetEnneagramType(
                value ? (Number(value) as EnneagramNumber) : null,
              )
            }
            placeholder="Type..."
            optionList={ENNEAGRAM_TYPE_LIST.map((type) => ({
              value: type.toString(),
              label: `${type} - ${getEnneagramType(type).className}`,
            }))}
          />
        </div>
        {selections.enneagramType && (
          <div className="w-20 sm:w-28">
            <Select
              value={selections.enneagramWing?.toString() ?? ""}
              onChange={(value) =>
                onUpdateSelection(
                  "enneagramWing",
                  value ? (Number(value) as EnneagramNumber) : null,
                )
              }
              placeholder="Wing..."
              optionList={getWings(selections.enneagramType).map((wing) => ({
                value: wing.toString(),
                label: `w${wing}`,
              }))}
            />
          </div>
        )}
      </div>

      {/* Instinctual variant */}
      {selections.enneagramType && (
        <Select
          value={selections.enneagramInstinct ?? ""}
          onChange={(value) =>
            onUpdateSelection(
              "enneagramInstinct",
              (value as EnneagramInstinct) || null,
            )
          }
          placeholder="Instinct..."
          optionList={ENNEAGRAM_INSTINCT_LIST.map((instinct) => ({
            value: instinct,
            label: `${instinct} - ${getInstinctLabel(instinct)} (${getInstinctFullName(instinct)})`,
          }))}
        />
      )}

      {/* Instinct stacking toggle */}
      {selections.enneagramInstinct && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Toggle
              checked={selections.instinctStackEnabled}
              onChange={() =>
                onUpdateSelection(
                  "instinctStackEnabled",
                  !selections.instinctStackEnabled,
                )
              }
              aria-label="Toggle instinct stacking"
              size="sm"
            />
            <span className="text-xs text-gray-400">Instinct Stacking</span>
          </div>
          {selections.instinctStackEnabled && (
            <div className="space-y-1.5">
              <span className="block text-[10px] font-semibold uppercase text-gray-500">
                {selections.enneagramInstinct} (dominant) &rarr; pick 2nd (3rd
                is auto)
              </span>
              <Select
                value={selections.instinctSecond ?? ""}
                onChange={(value) =>
                  onUpdateSelection(
                    "instinctSecond",
                    (value as EnneagramInstinct) || null,
                  )
                }
                placeholder="2nd instinct..."
                optionList={ENNEAGRAM_INSTINCT_LIST.filter(
                  (i) => i !== selections.enneagramInstinct,
                ).map((instinct) => ({
                  value: instinct,
                  label: `${instinct} - ${getInstinctLabel(instinct)} (${getInstinctFullName(instinct)})`,
                }))}
              />
              {selections.instinctSecond &&
                (() => {
                  const third = ENNEAGRAM_INSTINCT_LIST.find(
                    (i) =>
                      i !== selections.enneagramInstinct &&
                      i !== selections.instinctSecond,
                  );
                  if (!third) return null;
                  return (
                    <span className="block text-[10px] text-gray-600">
                      3rd (blind spot): {third} - {getInstinctLabel(third)}
                    </span>
                  );
                })()}
            </div>
          )}
        </div>
      )}

      {/* Tritype toggle */}
      <div className="flex items-center gap-2">
        <Toggle
          checked={selections.tritypeEnabled}
          onChange={() =>
            onUpdateSelection("tritypeEnabled", !selections.tritypeEnabled)
          }
          aria-label="Toggle enneagram tritype"
          size="sm"
        />
        <span className="text-xs text-gray-400">Tritype</span>
      </div>

      {/* Tritype fix pickers */}
      {selections.tritypeEnabled && selections.enneagramType && (
        <TritypePicker
          coreType={selections.enneagramType}
          selections={selections}
          onUpdateSelection={onUpdateSelection}
        />
      )}
    </div>
  );
}
