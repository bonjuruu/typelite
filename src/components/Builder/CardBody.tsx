import type { EnneagramNumber, ManualOverrides } from "../../engine/types/index.ts";
import type { BuilderSelections } from "../../types/builder.ts";
import type { SystemMeta } from "./systemMeta.ts";
import { SystemSelector } from "./SystemSelector.tsx";
import { OverrideSelector } from "./overrides/OverrideSelector.tsx";

// ============================================================
// CARD BODY (used in accordion mode)
// ============================================================

interface CardBodyProps {
  meta: SystemMeta;
  enabled: boolean;
  selections: BuilderSelections;
  overrides: ManualOverrides;
  showInfo: boolean;
  onToggleInfo: () => void;
  onUpdateSelection: <K extends keyof BuilderSelections>(
    key: K,
    value: BuilderSelections[K],
  ) => void;
  onUpdateOverride: <K extends keyof ManualOverrides>(
    key: K,
    value: ManualOverrides[K],
  ) => void;
  onSetEnneagramType: (type: EnneagramNumber | null) => void;
  onRandomize: () => void;
  showRandomize: boolean;
}

export function CardBody({
  meta,
  enabled,
  selections,
  overrides,
  showInfo,
  onToggleInfo,
  onUpdateSelection,
  onUpdateOverride,
  onSetEnneagramType,
  onRandomize,
  showRandomize,
}: CardBodyProps) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={onToggleInfo}
          aria-label={`Info about ${meta.name}`}
          aria-expanded={showInfo}
          className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
            showInfo
              ? "bg-indigo-600 text-white"
              : "bg-gray-600 text-gray-400 hover:bg-gray-500 hover:text-gray-200"
          }`}
        >
          ?
        </button>
        {showRandomize && enabled && (
          <button
            onClick={onRandomize}
            aria-label={`Randomize ${meta.name}`}
            className="rounded bg-gray-700 px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-600 hover:text-gray-200"
          >
            Randomize
          </button>
        )}
      </div>

      {showInfo && (
        <div className="mb-3 space-y-2 rounded border border-indigo-800/30 bg-indigo-950/10 p-3 text-xs leading-relaxed text-gray-400">
          <p>{meta.info.what}</p>
          <p>
            <span className="font-semibold text-indigo-400">Game mapping:</span>{" "}
            {meta.info.mapping}
          </p>
          <p>{meta.info.detail}</p>
        </div>
      )}

      <p className="mb-3 text-sm text-gray-400">{meta.description}</p>

      {enabled ? (
        <SystemSelector
          systemId={meta.id}
          selections={selections}
          onUpdateSelection={onUpdateSelection}
          onSetEnneagramType={onSetEnneagramType}
        />
      ) : (
        <OverrideSelector
          systemId={meta.id}
          overrides={overrides}
          onUpdateOverride={onUpdateOverride}
        />
      )}
    </>
  );
}
